import { v } from "convex/values";
import { internalMutation } from "../../_generated/server";

export const createUserSettings = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const existing = await ctx.db
      .query("userSettings")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();
    if (existing) return;

    await ctx.db.insert("userSettings", { userId });
  },
});
