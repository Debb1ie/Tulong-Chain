// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Mirror of on-chain donations for real-time UI
  donations: defineTable({
    donor: v.string(),
    amount: v.number(),
    txHash: v.optional(v.string()),
    timestamp: v.number(),
  }).index("by_donor", ["donor"]),

  // Mirror of on-chain withdrawals
  withdrawals: defineTable({
    coordinator: v.string(),
    amount: v.number(),
    purpose: v.string(),
    txHash: v.optional(v.string()),
    timestamp: v.number(),
  }),

  // Activity feed for the live dashboard
  activity: defineTable({
    type: v.union(
      v.literal("donation"),
      v.literal("withdrawal"),
      v.literal("emergency_declared"),
      v.literal("emergency_lifted")
    ),
    address: v.string(),
    amount: v.optional(v.number()),
    description: v.string(),
    timestamp: v.number(),
  }),
});
