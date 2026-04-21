/**
 * Source-of-truth prize catalog for the ImagineArt Spin & Win campaign.
 *
 * Totals to exactly 500 slots:
 *   3 + 5 + 10 + 15 + 25 + 25 + 60 + 67 + 110 + 130 + 10 + 10 + 10 + 10 + 10 = 500
 *
 * Prize selection is weighted by the `odds` field (not by remaining stock).
 * If a segment hits 0 remaining, the resolver rerolls weighted across whatever
 * is still available. Once all 500 are consumed, winners fall through to a
 * 50/50 consolation between 5,000 credits and "Better luck next time".
 *
 * Each discount prize has a FIXED promo code + redemption link — every winner
 * of that prize receives the same code. Credit prizes get a uniquely-generated
 * code per winner and all share one Google Form link to claim the credits.
 */

export const CREDITS_FORM_URL = "https://forms.gle/FgisyVGNiznR42tTA";

export type PrizeCategory =
  | "creator"
  | "ultimate"
  | "standard"
  | "credits"
  | "consolation";

export type Prize = {
  /** Stable key, used in DB + UI */
  key: string;
  /** Short label shown on the wheel */
  label: string;
  /** Full title shown on the prize-won screen */
  title: string;
  /** Subtitle / plan context on the prize-won screen */
  subtitle: string;
  /** Logical grouping */
  category: PrizeCategory;
  /** Initial stock */
  quantity: number;
  /**
   * Relative probability weight for this prize (before stock gating).
   * Values in this catalog sum to ~1.10; the resolver normalizes at pick-time.
   */
  odds: number;
  /**
   * Fixed promo code for discount prizes (shared by all winners of this prize).
   * Omitted for credit prizes — those generate a unique code per winner.
   */
  promoCode?: string;
  /**
   * Where the winner redeems their reward. For credit prizes this is the
   * shared Google Form; for discount prizes it's the plan checkout URL.
   */
  redemptionLink: string;
  /** Segment fill color on the wheel */
  color: string;
  /** Text color on the wheel segment */
  textColor: string;
};

const PLAN_URL = (plan: "Creator" | "Ultimate" | "Standard", promo: string) =>
  `https://www.imagine.art/custom-plan-iap?plan=${plan}&promo=${promo}`;

export const PRIZES: Prize[] = [
  // Jackpots — triple 40% off (the headlines, deepest purples)
  {
    key: "creator_40",
    label: "40% OFF",
    title: "40% OFF",
    subtitle: "Creator Yearly",
    category: "creator",
    quantity: 3,
    odds: 0.01,
    promoCode: "STWCREATOR40",
    redemptionLink: PLAN_URL("Creator", "STWCREATOR40"),
    color: "#1f0e47",
    textColor: "#faf7ff",
  },
  {
    key: "ultimate_40",
    label: "40% OFF",
    title: "40% OFF",
    subtitle: "Ultimate Yearly",
    category: "ultimate",
    quantity: 5,
    odds: 0.01,
    promoCode: "STWULTIMATE40",
    redemptionLink: PLAN_URL("Ultimate", "STWULTIMATE40"),
    color: "#2a1263",
    textColor: "#faf7ff",
  },
  {
    key: "standard_40",
    label: "40% OFF",
    title: "40% OFF",
    subtitle: "Standard Yearly",
    category: "standard",
    quantity: 10,
    odds: 0.02,
    promoCode: "STWSTANDARD40",
    redemptionLink: PLAN_URL("Standard", "STWSTANDARD40"),
    color: "#371a7f",
    textColor: "#faf7ff",
  },

  // Creator tier — premium rewards
  {
    key: "creator_20",
    label: "20% OFF",
    title: "20% OFF",
    subtitle: "Creator Yearly",
    category: "creator",
    quantity: 15,
    odds: 0.03,
    promoCode: "STWCREATOR20",
    redemptionLink: PLAN_URL("Creator", "STWCREATOR20"),
    color: "#4d25ab",
    textColor: "#faf7ff",
  },
  {
    key: "creator_10",
    label: "10% OFF",
    title: "10% OFF",
    subtitle: "Creator Yearly",
    category: "creator",
    quantity: 25,
    odds: 0.06,
    promoCode: "STWCREATOR10",
    redemptionLink: PLAN_URL("Creator", "STWCREATOR10"),
    color: "#6a3fcb",
    textColor: "#faf7ff",
  },

  // Mid-tier — Ultimate & Standard value
  {
    key: "ultimate_25",
    label: "25% OFF",
    title: "25% OFF",
    subtitle: "Ultimate Yearly",
    category: "ultimate",
    quantity: 25,
    odds: 0.06,
    promoCode: "STWULTIMATE25",
    redemptionLink: PLAN_URL("Ultimate", "STWULTIMATE25"),
    color: "#7c3aed",
    textColor: "#faf7ff",
  },
  {
    key: "ultimate_15",
    label: "15% OFF",
    title: "15% OFF",
    subtitle: "Ultimate Yearly",
    category: "ultimate",
    quantity: 60,
    odds: 0.13,
    promoCode: "STWULTIMATE15",
    redemptionLink: PLAN_URL("Ultimate", "STWULTIMATE15"),
    color: "#8b5cf6",
    textColor: "#faf7ff",
  },

  // Common prizes — strong floor (soft lavenders)
  {
    key: "standard_30",
    label: "30% OFF",
    title: "30% OFF",
    subtitle: "Standard Yearly",
    category: "standard",
    quantity: 67,
    odds: 0.15,
    promoCode: "STWSTANDARD30",
    redemptionLink: PLAN_URL("Standard", "STWSTANDARD30"),
    color: "#a78bfa",
    textColor: "#1f0e47",
  },
  {
    key: "standard_25",
    label: "25% OFF",
    title: "25% OFF",
    subtitle: "Standard Yearly",
    category: "standard",
    quantity: 110,
    odds: 0.24,
    promoCode: "STWSTANDARD25",
    redemptionLink: PLAN_URL("Standard", "STWSTANDARD25"),
    color: "#c4b5fd",
    textColor: "#1f0e47",
  },
  {
    key: "standard_20",
    label: "20% OFF",
    title: "20% OFF",
    subtitle: "Standard Yearly",
    category: "standard",
    quantity: 130,
    odds: 0.29,
    promoCode: "STWSTANDARD20",
    redemptionLink: PLAN_URL("Standard", "STWSTANDARD20"),
    color: "#d8c7ff",
    textColor: "#1f0e47",
  },

  // Credit packs — warm cream/amber slots, claimed via Google Form
  {
    key: "credits_5k",
    label: "5K CREDITS",
    title: "5,000 Credits",
    subtitle: "Added to your ImagineArt balance",
    category: "credits",
    quantity: 10,
    odds: 0.02,
    redemptionLink: CREDITS_FORM_URL,
    color: "#fff4d6",
    textColor: "#1f0e47",
  },
  {
    key: "credits_10k",
    label: "10K CREDITS",
    title: "10,000 Credits",
    subtitle: "Added to your ImagineArt balance",
    category: "credits",
    quantity: 10,
    odds: 0.02,
    redemptionLink: CREDITS_FORM_URL,
    color: "#ffe6a3",
    textColor: "#1f0e47",
  },
  {
    key: "credits_15k",
    label: "15K CREDITS",
    title: "15,000 Credits",
    subtitle: "Added to your ImagineArt balance",
    category: "credits",
    quantity: 10,
    odds: 0.02,
    redemptionLink: CREDITS_FORM_URL,
    color: "#ffd770",
    textColor: "#1f0e47",
  },
  {
    key: "credits_20k",
    label: "20K CREDITS",
    title: "20,000 Credits",
    subtitle: "Added to your ImagineArt balance",
    category: "credits",
    quantity: 10,
    odds: 0.02,
    redemptionLink: CREDITS_FORM_URL,
    color: "#f5b941",
    textColor: "#1f0e47",
  },
  {
    key: "credits_25k",
    label: "25K CREDITS",
    title: "25,000 Credits",
    subtitle: "Added to your ImagineArt balance",
    category: "credits",
    quantity: 10,
    odds: 0.02,
    redemptionLink: CREDITS_FORM_URL,
    color: "#e09a1a",
    textColor: "#faf7ff",
  },
];

export const CONSOLATION_PRIZES = {
  credits: {
    key: "consolation_credits_5k",
    label: "5K CRED",
    title: "5,000 Credits",
    subtitle: "Consolation reward — claim via the credits form",
    category: "consolation" as PrizeCategory,
    redemptionLink: CREDITS_FORM_URL,
  },
  luck: {
    key: "consolation_luck",
    label: "TRY AGAIN",
    title: "Better luck next time",
    subtitle: "All rewards have been claimed — follow us for the next drop",
    category: "consolation" as PrizeCategory,
    redemptionLink: "",
  },
};

export const TOTAL_PRIZE_SLOTS = PRIZES.reduce((s, p) => s + p.quantity, 0);

export const PRIZES_BY_KEY: Record<string, Prize> = Object.fromEntries(
  PRIZES.map((p) => [p.key, p])
);
