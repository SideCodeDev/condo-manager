import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { ApplicationError } from "./errors";
import { createOrganizationForUser } from "./organization";

export const upsertUser = internalMutation({
  args: {
    authProviderId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    orgs: v.array(v.string()),
  },
  returns: v.id("users"),
  handler: async (
    ctx,
    { authProviderId, email, firstName, lastName, imageUrl, orgs },
  ) => {
    const now = +Date.now();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_auth_provider_id", (q) =>
        q.eq("authProviderId", authProviderId),
      )
      .unique();
    const patch = {
      authProviderId,
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
    const id = await ctx.db.insert("users", { ...patch });
    await createOrganizationForUser(ctx, id, `${firstName}'s Organization`);
    return id;
  },
});

export const getUser = internalQuery({
  handler: async (ctx) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) throw new ApplicationError("unauthenticated");
    const id = userIdentity.subject;
    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_provider_id", (q) => q.eq("authProviderId", id))
      .unique();
    if (!user) throw new ApplicationError("unknown_error");
    return user;
  },
});

export const deleteUserByClerkId = internalMutation({
  args: {
    authProviderId: v.string(),
  },
  handler: async (ctx, { authProviderId }) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_auth_provider_id", (q) =>
        q.eq("authProviderId", authProviderId),
      )
      .unique();
    if (existing) {
      await ctx.db.delete("users", existing._id);
    }
  },
});
