import { v } from "convex/values";
import { internalMutation, mutation, query } from "../../_generated/server";
import { getCurrentUser } from "../../authProvider/users/currentUser";
import { ApplicationError } from "../../lib/errors";

const DEFAULT_SELECTED_CONDO_HOURS = 24;

function getSelectedCondoExpiresAt(now: number) {
  const configuredHours = Number(process.env.SELECTED_CONDO_DEFAULT_HOURS);
  const hours =
    Number.isFinite(configuredHours) && configuredHours > 0
      ? configuredHours
      : DEFAULT_SELECTED_CONDO_HOURS;
  return now + hours * 60 * 60 * 1000;
}

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

export const getMine = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await getCurrentUser(ctx);
    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .unique();
    return { selectedCondoId: settings?.selectedCondoId };
  },
});

export const selectCondo = mutation({
  args: { condoId: v.id("condos") },
  returns: v.null(),
  handler: async (ctx, { condoId }) => {
    const { user } = await getCurrentUser(ctx);
    const membership = await ctx.db
      .query("condoMember")
      .withIndex("by_condo_and_user", (q) =>
        q.eq("condoId", condoId).eq("userId", user._id),
      )
      .first();
    if (!membership || !(await ctx.db.get("condos", condoId))) {
      throw new ApplicationError("unauthorized");
    }

    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .unique();
    const selectedCondoExpiresAt = getSelectedCondoExpiresAt(Date.now());
    if (settings) {
      await ctx.db.patch("userSettings", settings._id, {
        selectedCondoId: condoId,
        selectedCondoExpiresAt,
      });
    } else {
      await ctx.db.insert("userSettings", {
        userId: user._id,
        selectedCondoId: condoId,
        selectedCondoExpiresAt,
      });
    }
    return null;
  },
});

export const clearSelectedCondo = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const { user } = await getCurrentUser(ctx);
    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .unique();
    if (settings?.selectedCondoId) {
      await ctx.db.patch("userSettings", settings._id, {
        selectedCondoId: undefined,
      });
    }
    return null;
  },
});
