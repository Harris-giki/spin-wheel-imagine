import { customAlphabet } from "nanoid";
import { PrizeInventory, Spin } from "./models";
import { CONSOLATION_PRIZES, CREDITS_FORM_URL, PRIZES_BY_KEY } from "./prizes";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/1/I/O/L for readability
const codeSuffix = customAlphabet(CODE_ALPHABET, 6);

const CODE_TTL_MS = 48 * 60 * 60 * 1000;

/** Unique claim code for credit winners (e.g. "CREDITS10K-X7K9QP"). */
function buildCreditsCode(prizeKey: string): string {
  const shortKey = prizeKey.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10) || "CREDITS";
  return `${shortKey}-${codeSuffix()}`;
}

export type SpinResult =
  | {
      kind: "prize";
      prizeKey: string;
      title: string;
      subtitle: string;
      category: string;
      code: string;
      redemptionLink: string;
      codeExpiresAt: string;
    }
  | {
      kind: "consolation_credits";
      title: string;
      subtitle: string;
      code: string;
      redemptionLink: string;
      codeExpiresAt: string;
    }
  | {
      kind: "consolation_luck";
      title: string;
      subtitle: string;
    };

/**
 * Pick a key from a {key -> weight} map, weighted. Weights must be positive.
 */
function weightedPick(weights: Record<string, number>): string | null {
  let total = 0;
  for (const w of Object.values(weights)) total += w;
  if (total <= 0) return null;
  let r = Math.random() * total;
  for (const [key, w] of Object.entries(weights)) {
    r -= w;
    if (r <= 0) return key;
  }
  return Object.keys(weights)[Object.keys(weights).length - 1];
}

/**
 * Atomically decrement a prize's remaining counter iff > 0.
 * Returns true if this caller successfully claimed a slot.
 */
async function tryClaim(prizeKey: string): Promise<boolean> {
  const res = await PrizeInventory.updateOne(
    { key: prizeKey, remaining: { $gt: 0 } },
    { $inc: { remaining: -1 } }
  );
  return res.modifiedCount === 1;
}

/**
 * Resolve a spin for a given email. Enforces one-spin-per-email via a unique
 * index on Spin.email. Picks a prize weighted by configured odds, gated by
 * remaining stock. Falls through to a 50/50 consolation once all 500 are gone.
 */
export async function resolveSpin(args: {
  email: string;
  ip?: string;
  userAgent?: string;
}): Promise<SpinResult> {
  const { email, ip, userAgent } = args;
  const normalized = email.trim().toLowerCase();

  // Already spun? Return the same record so the user sees their prize again.
  const existing = await Spin.findOne({ email: normalized }).lean();
  if (existing) return hydrateExistingSpin(existing);

  // Load live inventory. A prize is pickable only if remaining > 0; weights
  // come from the configured odds in the catalog, not from remaining stock.
  const inventory = await PrizeInventory.find({}).lean();
  const weights: Record<string, number> = {};
  for (const row of inventory) {
    const meta = PRIZES_BY_KEY[row.key];
    if (!meta) continue;
    if (row.remaining > 0 && meta.odds > 0) {
      weights[row.key] = meta.odds;
    }
  }

  // Try to claim a real prize. If the first pick is stolen by a race, reroll.
  const MAX_ATTEMPTS = 8;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const picked = weightedPick(weights);
    if (!picked) break; // everything exhausted

    const claimed = await tryClaim(picked);
    if (claimed) {
      return await persistPrize(picked, normalized, ip, userAgent);
    }
    // Lost the race. Re-check that prize's inventory and continue.
    const fresh = await PrizeInventory.findOne({ key: picked }).lean();
    if (!fresh || fresh.remaining <= 0) {
      delete weights[picked];
    }
  }

  // All inventory exhausted (or unwinnable contention). 50/50 consolation.
  return await persistConsolation(normalized, ip, userAgent);
}

async function persistPrize(
  prizeKey: string,
  email: string,
  ip?: string,
  userAgent?: string
): Promise<SpinResult> {
  const meta = PRIZES_BY_KEY[prizeKey];
  const isCredits = meta.category === "credits";
  // Discount prizes share a fixed promo code; credit prizes get a unique code.
  const code = isCredits ? buildCreditsCode(prizeKey) : meta.promoCode || buildCreditsCode(prizeKey);
  const redemptionLink = meta.redemptionLink;
  const expiresAt = new Date(Date.now() + CODE_TTL_MS);

  try {
    await Spin.create({
      email,
      prizeKey,
      prizeTitle: meta.title,
      prizeSubtitle: meta.subtitle,
      prizeCategory: meta.category,
      code,
      codeStatus: "issued",
      codeIssuedAt: new Date(),
      codeExpiresAt: expiresAt,
      redemptionLink,
      isConsolation: false,
      ip,
      userAgent,
    });
  } catch (err: unknown) {
    // Duplicate email -> race on second tab. Refund the claimed slot and return their existing record.
    if (isDuplicateKeyError(err)) {
      await PrizeInventory.updateOne({ key: prizeKey }, { $inc: { remaining: 1 } });
      const existing = await Spin.findOne({ email }).lean();
      if (existing) return hydrateExistingSpin(existing);
    }
    throw err;
  }

  return {
    kind: "prize",
    prizeKey,
    title: meta.title,
    subtitle: meta.subtitle,
    category: meta.category,
    code,
    redemptionLink,
    codeExpiresAt: expiresAt.toISOString(),
  };
}

async function persistConsolation(
  email: string,
  ip?: string,
  userAgent?: string
): Promise<SpinResult> {
  const giveCredits = Math.random() < 0.5;
  const consolation = giveCredits ? CONSOLATION_PRIZES.credits : CONSOLATION_PRIZES.luck;
  const code = giveCredits ? buildCreditsCode("CREDITS5K") : "NO-WIN";
  const redemptionLink = giveCredits ? CREDITS_FORM_URL : "";
  const expiresAt = new Date(Date.now() + CODE_TTL_MS);

  try {
    await Spin.create({
      email,
      prizeKey: consolation.key,
      prizeTitle: consolation.title,
      prizeSubtitle: consolation.subtitle,
      prizeCategory: consolation.category,
      code,
      codeStatus: giveCredits ? "issued" : "void",
      codeIssuedAt: new Date(),
      codeExpiresAt: expiresAt,
      redemptionLink,
      isConsolation: true,
      ip,
      userAgent,
    });
  } catch (err: unknown) {
    if (isDuplicateKeyError(err)) {
      const existing = await Spin.findOne({ email }).lean();
      if (existing) return hydrateExistingSpin(existing);
    }
    throw err;
  }

  if (giveCredits) {
    return {
      kind: "consolation_credits",
      title: consolation.title,
      subtitle: consolation.subtitle,
      code,
      redemptionLink,
      codeExpiresAt: expiresAt.toISOString(),
    };
  }
  return {
    kind: "consolation_luck",
    title: consolation.title,
    subtitle: consolation.subtitle,
  };
}

function hydrateExistingSpin(doc: {
  prizeKey: string;
  prizeTitle: string;
  prizeSubtitle: string;
  prizeCategory: string;
  code: string;
  codeExpiresAt: Date;
  redemptionLink?: string;
  isConsolation: boolean;
}): SpinResult {
  const expires = doc.codeExpiresAt instanceof Date
    ? doc.codeExpiresAt.toISOString()
    : new Date(doc.codeExpiresAt).toISOString();

  // Fallback: older spin docs may not have redemptionLink stored; resolve it
  // from the catalog when possible so the UI can still render a claim button.
  const link = doc.redemptionLink ?? PRIZES_BY_KEY[doc.prizeKey]?.redemptionLink ?? "";

  if (!doc.isConsolation) {
    const meta = PRIZES_BY_KEY[doc.prizeKey];
    return {
      kind: "prize",
      prizeKey: doc.prizeKey,
      title: doc.prizeTitle,
      subtitle: doc.prizeSubtitle,
      category: doc.prizeCategory,
      code: doc.code,
      redemptionLink: link || meta?.redemptionLink || "",
      codeExpiresAt: expires,
    };
  }
  if (doc.prizeKey === CONSOLATION_PRIZES.credits.key) {
    return {
      kind: "consolation_credits",
      title: doc.prizeTitle,
      subtitle: doc.prizeSubtitle,
      code: doc.code,
      redemptionLink: link || CREDITS_FORM_URL,
      codeExpiresAt: expires,
    };
  }
  return {
    kind: "consolation_luck",
    title: doc.prizeTitle,
    subtitle: doc.prizeSubtitle,
  };
}

function isDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: number }).code === 11000
  );
}
