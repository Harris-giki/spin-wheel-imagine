# Imagine Art — Spin & Win

A mobile-first, Creator-only spin-to-win web app for the Imagine Art Creator Program. One spin per Creator, 500 finite prize slots across 15 tiers, unique redemption codes, and a MongoDB-backed inventory so two people can never claim the same slot.

Stack: **Next.js 14 (App Router) · TypeScript · Tailwind · Framer Motion · MongoDB / Mongoose · Zod**.

---

## 1. One-time setup

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local` and set `MONGODB_URI` to your connection string. **Use MongoDB Atlas (free M0 tier)** — it stays online 24/7, which is what you want for launch.

Quick Atlas path:
1. Create a free M0 cluster at <https://cloud.mongodb.com>.
2. Add `0.0.0.0/0` (or your Vercel/host IP) to the network allow-list.
3. Create a DB user and copy the SRV connection string.
4. Append a database name, e.g. `/imagine_art_spin`.

Example:
```
MONGODB_URI=mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/imagine_art_spin?retryWrites=true&w=majority
```

---

## 2. Load the Creator allow-list

Open `creator-emails.txt` at the repo root and paste in the real Creator emails — one per line. Lines starting with `#` and blank lines are ignored. Matching is case-insensitive and whitespace-trimmed.

```
# Imagine Art Creator Program members
maha@imagine.art
alice@studio.io
bob@creators.tv
```

The file is read at request time (with a 60-second in-process cache), so you can update it without redeploying — but restart the dev server to force-refresh immediately.

---

## 3. Seed the prize inventory (first run only)

```bash
npm run seed
```

This writes one row per prize to the `prize_inventory` collection, totalling **exactly 500 slots** — matching the Combination 3 catalog:

| # | Prize                            | Category  | Qty |
|---|----------------------------------|-----------|----:|
| 1 | 30% off Creator Monthly          | creator   |   5 |
| 2 | 25% off Creator Monthly          | creator   |  10 |
| 3 | 15% off Creator Monthly          | creator   |  15 |
| 4 | 10% off Creator Monthly          | creator   |  20 |
| 5 | 35% off Ultimate Monthly         | ultimate  |  15 |
| 6 | 25% off Ultimate Monthly         | ultimate  |  35 |
| 7 | 20% off Standard Monthly         | standard  |  60 |
| 8 | 15% off Ultimate Monthly         | ultimate  |  60 |
| 9 | 15% off Standard Monthly         | standard  | 110 |
|10 | 30% off Standard Monthly         | standard  | 120 |
|11 | 5,000 credits                    | credits   |  15 |
|12 | 10,000 credits                   | credits   |  10 |
|13 | 15,000 credits                   | credits   |  10 |
|14 | 20,000 credits                   | credits   |  10 |
|15 | 25,000 credits                   | credits   |   5 |
|   | **Total**                        |           | **500** |

If you ever need to nuke and re-seed during testing:
```bash
npm run seed -- --reset
```
Never run `--reset` after launch — it will wipe `remaining` counts.

---

## 4. Run

```bash
npm run dev        # http://localhost:3000
npm run build && npm start
```

---

## 5. How the logic works

1. **Landing (`/`)** — user types their email. `/api/verify-email` cross-checks against `creator-emails.txt`.
2. If registered, they advance to the wheel; otherwise they see the "not a Creator" modal.
3. **Spin** — `/api/spin` is called. Server-side:
   - A unique index on `spins.email` enforces **one spin per Creator** (duplicate request returns their original prize).
   - A **weighted random pick** is made from prizes whose `remaining > 0`, weights proportional to remaining stock.
   - An **atomic `$inc: -1` with a `remaining > 0` guard** claims the slot. If another request just took the last one, the server rerolls and tries again (bounded retries).
   - If an individual prize tier is exhausted mid-campaign, the resolver rerolls to another available prize (the wheel still animates to the landed segment if we found one).
   - Once **all 500 slots are claimed**, every subsequent Creator gets a **50/50** consolation: either `5,000 credits` or `Better luck next time`.
4. **Prize won** — a unique code like `SPIN-CREATO-X7K9QP` is generated, stored with `codeStatus: "issued"` and `codeExpiresAt: now + 48h`, and shown on-screen for the Creator to screenshot and DM.

All prize logic is server-side; the client never sees remaining counts (anti-abuse note from the original design spec).

---

## 6. Data model

**`spins`** — one doc per Creator (unique on `email`):
```
email, prizeKey, prizeTitle, prizeSubtitle, prizeCategory,
code, codeStatus, codeIssuedAt, codeExpiresAt,
isConsolation, ip, userAgent, createdAt, updatedAt
```

**`prize_inventory`** — one doc per prize key:
```
key, label, title, subtitle, category,
initialQuantity, remaining, createdAt, updatedAt
```

Useful ops queries:
```js
// Remaining across all prizes
db.prize_inventory.aggregate([{ $group: { _id: null, sum: { $sum: "$remaining" } } }])

// Claim rate per prize
db.prize_inventory.find({}, { key: 1, initialQuantity: 1, remaining: 1 })

// All winners for a given prize
db.spins.find({ prizeKey: "creator_30" })
```

---

## 7. Deploy

Any Node host works. Easiest is **Vercel**:
1. Push this repo to GitHub.
2. Import into Vercel.
3. Set `MONGODB_URI` in Project → Settings → Environment Variables.
4. Deploy. Atlas + Vercel both stay on continuously.

Before the very first production deploy, run the seeder once against your production DB:
```bash
MONGODB_URI="<prod-uri>" npm run seed
```

---

## 8. File map

```
src/app/page.tsx                    # Full single-page flow (email → wheel → result)
src/app/layout.tsx                  # Root layout, fonts, metadata
src/app/api/verify-email/route.ts   # POST { email } → { ok, alreadySpun }
src/app/api/spin/route.ts           # POST { email } → { ok, result }
src/components/Wheel.tsx            # SVG wheel + framer-motion spin animation
src/lib/prizes.ts                   # Prize catalog (source of truth)
src/lib/creators.ts                 # Allow-list loader (from creator-emails.txt)
src/lib/mongodb.ts                  # Cached Mongoose connection
src/lib/models.ts                   # Spin + PrizeInventory schemas
src/lib/spin-engine.ts              # Weighted pick, atomic claim, code gen, fallback
scripts/seed.ts                     # Seeds prize_inventory from prizes.ts
creator-emails.txt                  # Creator allow-list (edit this!)
```
