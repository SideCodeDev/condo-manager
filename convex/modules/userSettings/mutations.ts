import { internalMutation } from "@be/server";
import { v } from "convex/values";

export const createUserSettings = internalMutation({
  args: {
    userId: v.id("users"),
    orgId: v.id("organization"),
  },
  handler: async (ctx, { userId, orgId }) => {
    const existing = await ctx.db
      .query("userSettings")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();
    if (existing) {
      return;
    }
    await ctx.db.insert("userSettings", {
      userId: userId,
      activeOrg: orgId,
    });
  },
});
