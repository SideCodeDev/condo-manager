import { internal } from "../../_generated/api";
import { internalMutation } from "../../_generated/server";
import { v } from "convex/values";
import { provisionPersonalOrganization } from "../../lib/functionReferences";

export const upsertUser = internalMutation({
  args: {
    authProviderId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    raw: v.string(),
    provisionOrganization: v.optional(v.boolean()),
  },
  returns: v.id("users"),
  handler: async (
    ctx,
    {
      authProviderId,
      email,
      firstName,
      lastName,
      imageUrl,
      raw,
      provisionOrganization,
    },
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
      raw,
    };
    if (existing) {
      await ctx.db.patch("users", existing._id, patch);
      if (provisionOrganization) {
        const state = await ctx.db
          .query("organizationProvisioning")
          .withIndex("by_clerk_user_id", (q) =>
            q.eq("clerkUserId", authProviderId),
          )
          .unique();
        if (!state) {
          await ctx.db.insert("organizationProvisioning", {
            clerkUserId: authProviderId,
            status: "pending",
            attempts: 0,
            updatedAt: now,
          });
          await ctx.scheduler.runAfter(0, provisionPersonalOrganization, {
            clerkUserId: authProviderId,
          });
        }
      }
      return existing._id;
    }
    const id = await ctx.db.insert("users", { ...patch });

    await ctx.runMutation(
      internal.modules.userSettings.mutations.createUserSettings,
      {
        userId: id,
      },
    );

    if (provisionOrganization) {
      await ctx.db.insert("organizationProvisioning", {
        clerkUserId: authProviderId,
        status: "pending",
        attempts: 0,
        updatedAt: now,
      });
      await ctx.scheduler.runAfter(0, provisionPersonalOrganization, {
        clerkUserId: authProviderId,
      });
    }

    return id;
  },
});

export const deleteUserByAuthProviderId = internalMutation({
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
