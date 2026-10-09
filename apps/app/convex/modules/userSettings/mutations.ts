import { v } from "convex/values";
import { internalMutation, mutation } from "../../_generated/server";
import { ApplicationError } from "../../lib/errors";

export const createUserSettings = internalMutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    const existing = await ctx.db
      .query("userSettings")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();
    if (existing) {
      return;
    }
    await ctx.db.insert("userSettings", {
      userId: userId,
    });
  },
});

export const selectOrganization = mutation({
  args: {
    clerkOrganizationId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, { clerkOrganizationId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ApplicationError("unauthenticated");

    const membership = await ctx.db
      .query("organizationMemberships")
      .withIndex("by_user_and_organization", (q) =>
        q
          .eq("clerkUserId", identity.subject)
          .eq("clerkOrganizationId", clerkOrganizationId),
      )
      .unique();
    if (!membership || membership.deletedAt) {
      throw new ApplicationError("unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_provider_id", (q) =>
        q.eq("authProviderId", identity.subject),
      )
      .unique();
    if (!user) throw new ApplicationError("unknown_error");

    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .unique();
    if (!settings) throw new ApplicationError("user_settings_not_found");

    await ctx.db.patch(settings._id, {
      selectedClerkOrganizationId: clerkOrganizationId,
    });
    return null;
  },
});
