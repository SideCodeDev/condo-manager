import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const upsertUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    orgs: v.array(v.string()),
  },
  returns: v.id("users"),
  handler: async (
    ctx,
    { clerkId, email, firstName, lastName, imageUrl, orgs },
  ) => {
    const now = +Date.now();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();
    const patch = {
      clerkId,
      email: email,
      firstName,
      lastName,
      imageUrl,
      updatedAt: now,
      orgs,
    };
    if (existing) {
      await ctx.db.patch("users", existing._id, patch);
      return existing._id;
    }
    return await ctx.db.insert("users", { ...patch, createdAt: now });
  },
});

export const syncOrgsToUser = internalMutation({
  args: {
    clerkId: v.string(),
    orgId: v.string(),
  },
  handler: async (ctx, { clerkId, orgId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();
    if (!user) {
      throw new Error(`User with clerkId ${clerkId} not found`);
    }
    if (!user.orgs.includes(orgId)) {
      const updatedOrgs = [...user.orgs, orgId];
      await ctx.db.patch("users", user._id, { orgs: updatedOrgs });
    } else {
      const updatedOrgs = user.orgs.filter((o) => o !== orgId);
      await ctx.db.patch("users", user._id, { orgs: updatedOrgs });
    }
  },
});

export const deleteUserByClerkId = internalMutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, { clerkId }) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();
    if (existing) {
      await ctx.db.delete("users", existing._id);
    }
  },
});

export const upsertOrg = internalMutation({
  args: {
    orgId: v.string(),
    subscriptionPlan: v.optional(v.string()),
    status: v.union(
      v.literal("abandoned"),
      v.literal("active"),
      v.literal("canceled"),
      v.literal("ended"),
      v.literal("expired"),
      v.literal("incomplete"),
      v.literal("past_due"),
      v.literal("upcoming"),
    ),
  },
  returns: v.id("organization"),
  handler: async (ctx, { orgId, subscriptionPlan, status }) => {
    const now = +Date.now();
    const existing = await ctx.db
      .query("organization")
      .withIndex("by_org_id", (q) => q.eq("orgId", orgId))
      .unique();
    const plan =
      subscriptionPlan === "enterprise"
        ? ("enterprise" as const)
        : subscriptionPlan === "pro"
          ? ("pro" as const)
          : subscriptionPlan === "basic"
            ? ("basic" as const)
            : ("free" as const);
    const patch = {
      orgId,
      plan,
      updatedAt: now,
      status,
    };
    if (existing) {
      await ctx.db.patch("organization", existing._id, patch);
      return existing._id;
    }
    return await ctx.db.insert("organization", { ...patch, createdAt: now });
  },
});
