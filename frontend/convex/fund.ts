// convex/fund.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ─── Queries ──────────────────────────────────────────────────────────────────

export const getRecentDonations = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("donations")
      .order("desc")
      .take(20);
  },
});

export const getRecentWithdrawals = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("withdrawals")
      .order("desc")
      .take(10);
  },
});

export const getActivityFeed = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("activity")
      .order("desc")
      .take(30);
  },
});

// ─── Mutations ────────────────────────────────────────────────────────────────

export const recordDonation = mutation({
  args: {
    donor: v.string(),
    amount: v.number(),
    txHash: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    await ctx.db.insert("donations", {
      donor: args.donor,
      amount: args.amount,
      txHash: args.txHash,
      timestamp: now,
    });

    await ctx.db.insert("activity", {
      type: "donation",
      address: args.donor,
      amount: args.amount,
      description: `Donated ${args.amount.toFixed(2)} USDC to TulongChain`,
      timestamp: now,
    });
  },
});

export const recordWithdrawal = mutation({
  args: {
    coordinator: v.string(),
    amount: v.number(),
    purpose: v.string(),
    txHash: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    await ctx.db.insert("withdrawals", {
      coordinator: args.coordinator,
      amount: args.amount,
      purpose: args.purpose,
      txHash: args.txHash,
      timestamp: now,
    });

    await ctx.db.insert("activity", {
      type: "withdrawal",
      address: args.coordinator,
      amount: args.amount,
      description: `Withdrew ${args.amount.toFixed(2)} USDC - ${args.purpose}`,
      timestamp: now,
    });
  },
});

export const recordEmergencyEvent = mutation({
  args: {
    type: v.union(v.literal("emergency_declared"), v.literal("emergency_lifted")),
    address: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("activity", {
      type: args.type,
      address: args.address,
      description:
        args.type === "emergency_declared"
          ? "Emergency declared - withdrawals now enabled"
          : "Emergency lifted - fund locked",
      timestamp: Date.now(),
    });
  },
});
