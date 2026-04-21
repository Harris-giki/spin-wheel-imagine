/* eslint-disable no-console */
import { config as loadEnv } from "dotenv";
import path from "path";
// Load .env.local first (Next.js convention), then fall back to .env.
loadEnv({ path: path.resolve(process.cwd(), ".env.local") });
loadEnv({ path: path.resolve(process.cwd(), ".env") });
import mongoose from "mongoose";
import { PRIZES, TOTAL_PRIZE_SLOTS } from "../src/lib/prizes";
import { PrizeInventory } from "../src/lib/models";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is required. Copy .env.example to .env.local and set it.");
    process.exit(1);
  }

  const reset = process.argv.includes("--reset");

  console.log(`[seed] connecting...`);
  await mongoose.connect(uri);
  console.log(`[seed] connected. total catalog slots = ${TOTAL_PRIZE_SLOTS}`);

  if (reset) {
    console.log("[seed] --reset flag: clearing prize_inventory collection");
    await PrizeInventory.deleteMany({});
  }

  for (const prize of PRIZES) {
    const existing = await PrizeInventory.findOne({ key: prize.key });
    if (!existing) {
      await PrizeInventory.create({
        key: prize.key,
        label: prize.label,
        title: prize.title,
        subtitle: prize.subtitle,
        category: prize.category,
        initialQuantity: prize.quantity,
        remaining: prize.quantity,
      });
      console.log(`  + created ${prize.key.padEnd(14)} remaining=${prize.quantity}`);
    } else {
      // Only update static metadata; never touch `remaining` on an existing row.
      existing.label = prize.label;
      existing.title = prize.title;
      existing.subtitle = prize.subtitle;
      existing.category = prize.category;
      existing.initialQuantity = prize.quantity;
      await existing.save();
      console.log(`  · updated meta for ${prize.key.padEnd(14)} remaining=${existing.remaining}`);
    }
  }

  const total = await PrizeInventory.aggregate([
    { $group: { _id: null, sum: { $sum: "$remaining" } } },
  ]);
  console.log(`[seed] total remaining across all prizes: ${total[0]?.sum ?? 0}`);

  await mongoose.disconnect();
  console.log("[seed] done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
