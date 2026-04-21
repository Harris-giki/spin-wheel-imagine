import mongoose, { Schema, Model, InferSchemaType } from "mongoose";

/* -------------------------------------------------------------------------- */
/* Spin — one document per email. Enforces "one spin per Creator".            */
/* -------------------------------------------------------------------------- */

const SpinSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    prizeKey: { type: String, required: true },
    prizeTitle: { type: String, required: true },
    prizeSubtitle: { type: String, required: true },
    prizeCategory: { type: String, required: true },
    /**
     * For discount prizes this is the catalog's fixed promo code (shared by
     * all winners of that prize). For credit prizes this is a uniquely
     * generated code per winner so the ops team can cross-ref the form entry.
     */
    code: { type: String, required: true, index: true },
    codeStatus: {
      type: String,
      enum: ["issued", "claimed", "expired", "void"],
      default: "issued",
    },
    codeIssuedAt: { type: Date, default: () => new Date() },
    codeExpiresAt: { type: Date, required: true },
    /** Where this winner goes to redeem (plan checkout URL or credits form). */
    redemptionLink: { type: String, default: "" },
    isConsolation: { type: Boolean, default: false },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true, collection: "spins" }
);

export type SpinDoc = InferSchemaType<typeof SpinSchema> & { _id: mongoose.Types.ObjectId };
export const Spin: Model<SpinDoc> =
  (mongoose.models.Spin as Model<SpinDoc>) || mongoose.model<SpinDoc>("Spin", SpinSchema);

/* -------------------------------------------------------------------------- */
/* PrizeInventory — tracks remaining stock per prize key. Used for atomic     */
/* decrements so two concurrent spins can never oversell a slot.              */
/* -------------------------------------------------------------------------- */

const PrizeInventorySchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    label: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    category: { type: String, required: true },
    initialQuantity: { type: Number, required: true },
    remaining: { type: Number, required: true, min: 0 },
  },
  { timestamps: true, collection: "prize_inventory" }
);

export type PrizeInventoryDoc = InferSchemaType<typeof PrizeInventorySchema> & {
  _id: mongoose.Types.ObjectId;
};
export const PrizeInventory: Model<PrizeInventoryDoc> =
  (mongoose.models.PrizeInventory as Model<PrizeInventoryDoc>) ||
  mongoose.model<PrizeInventoryDoc>("PrizeInventory", PrizeInventorySchema);
