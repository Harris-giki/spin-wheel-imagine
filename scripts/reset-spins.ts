/* eslint-disable no-console */
import { config as loadEnv } from "dotenv";
import path from "path";
// Load .env.local first (Next.js convention), then fall back to .env.
loadEnv({ path: path.resolve(process.cwd(), ".env.local") });
loadEnv({ path: path.resolve(process.cwd(), ".env") });
import mongoose from "mongoose";
import readline from "readline";
import { Spin, PrizeInventory } from "../src/lib/models";
import { PRIZES, TOTAL_PRIZE_SLOTS } from "../src/lib/prizes";

function ask(q: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(q, (a) => { rl.close(); resolve(a); }));
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is required. Set it in .env.local.");
    process.exit(1);
  }

  const force = process.argv.includes("--yes") || process.argv.includes("-y");
  const keepInventory = process.argv.includes("--keep-inventory");

  console.log("[reset] connecting...");
  await mongoose.connect(uri);

  const spinCount = await Spin.countDocuments();
  const inv = await PrizeInventory.aggregate([
    { $group: { _id: null, remaining: { $sum: "$remaining" } } },
  ]);
  const remaining = inv[0]?.remaining ?? 0;

  console.log(`[reset] current state: ${spinCount} spin(s), ${remaining}/${TOTAL_PRIZE_SLOTS} prize slots remaining`);

  if (!force) {
    const answer = (await ask(`Delete ALL ${spinCount} spin(s) and restore inventory to full? (type 'yes'): `)).trim().toLowerCase();
    if (answer !== "yes") {
      console.log("[reset] aborted.");
      await mongoose.disconnect();
      process.exit(0);
    }
  }

  // Drop the collection entirely so any stale indexes (e.g. an older unique
  // index on `code` from a previous schema) are removed. Mongoose will
  // recreate indexes on the next insert per the current schema.
  try {
    await Spin.collection.drop();
    console.log(`[reset] dropped 'spins' collection (and its indexes)`);
  } catch (err: unknown) {
    const code = (err as { code?: number })?.code;
    if (code === 26) {
      console.log(`[reset] 'spins' collection didn't exist — nothing to drop`);
    } else {
      throw err;
    }
  }

  if (keepInventory) {
    console.log("[reset] --keep-inventory flag: prize stock left untouched.");
  } else {
    let restored = 0;
    for (const prize of PRIZES) {
      const res = await PrizeInventory.updateOne(
        { key: prize.key },
        {
          $set: {
            remaining: prize.quantity,
            initialQuantity: prize.quantity,
            label: prize.label,
            title: prize.title,
            subtitle: prize.subtitle,
            category: prize.category,
          },
        },
        { upsert: true }
      );
      if (res.matchedCount || res.upsertedCount) restored++;
      console.log(`  · ${prize.key.padEnd(14)} remaining -> ${prize.quantity}`);
    }
    console.log(`[reset] restored inventory for ${restored} prize(s); total slots = ${TOTAL_PRIZE_SLOTS}`);
  }

  await mongoose.disconnect();
  console.log("[reset] done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
