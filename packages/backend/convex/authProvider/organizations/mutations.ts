import { v } from "convex/values";
import { internalMutation, type MutationCtx } from "../../_generated/server";

const organization = {
  clerkOrganizationId: v.string(),
  name: v.string(),
  slug: v.string(),
  imageUrl: v.optional(v.string()),
  createdByClerkUserId: v.optional(v.string()),
  kind: v.union(v.literal("personal"), v.literal("team")),
  createdAt: v.number(),
  updatedAt: v.number(),
  raw: v.optional(v.string()),
};

const membership = {
  clerkMembershipId: v.string(),
  clerkOrganizationId: v.string(),
  clerkUserId: v.string(),
  role: v.string(),
  permissions: v.array(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
  raw: v.optional(v.string()),
};

async function upsertOrganization(
  ctx: MutationCtx,
  value: {
    clerkOrganizationId: string;
    name: string;
    slug: string;
    imageUrl?: string;
    createdByClerkUserId?: string;
    kind: "personal" | "team";
    createdAt: number;
    updatedAt: number;
    raw?: string;
  },
) {
  const existing = await ctx.db
    .query("organizations")
    .withIndex("by_clerk_organization_id", (q) =>
      q.eq("clerkOrganizationId", value.clerkOrganizationId),
    )
    .unique();
  if (existing) {
    await ctx.db.patch(existing._id, { ...value, deletedAt: undefined });
    return existing._id;
  }
  return ctx.db.insert("organizations", value);
}

async function upsertMembership(
  ctx: MutationCtx,
  value: {
    clerkMembershipId: string;
    clerkOrganizationId: string;
    clerkUserId: string;
    role: string;
    permissions: string[];
    createdAt: number;
    updatedAt: number;
    raw?: string;
  },
) {
  const existing = await ctx.db
    .query("organizationMemberships")
    .withIndex("by_clerk_membership_id", (q) =>
      q.eq("clerkMembershipId", value.clerkMembershipId),
    )
    .unique();
  if (existing) {
    await ctx.db.patch(existing._id, { ...value, deletedAt: undefined });
    return;
  }
  await ctx.db.insert("organizationMemberships", value);
}

export const syncOrganization = internalMutation({
  args: organization,
  handler: (ctx, args) => upsertOrganization(ctx, args),
});

export const deleteOrganization = internalMutation({
  args: { clerkOrganizationId: v.string() },
  handler: async (ctx, { clerkOrganizationId }) => {
    const existing = await ctx.db
      .query("organizations")
      .withIndex("by_clerk_organization_id", (q) =>
        q.eq("clerkOrganizationId", clerkOrganizationId),
      )
      .unique();
    if (existing) await ctx.db.patch(existing._id, { deletedAt: Date.now() });
  },
});

export const syncMembership = internalMutation({
  args: membership,
  handler: (ctx, args) => upsertMembership(ctx, args),
});

export const deleteMembership = internalMutation({
  args: { clerkMembershipId: v.string() },
  handler: async (ctx, { clerkMembershipId }) => {
    const existing = await ctx.db
      .query("organizationMemberships")
      .withIndex("by_clerk_membership_id", (q) =>
        q.eq("clerkMembershipId", clerkMembershipId),
      )
      .unique();
    if (!existing) return;

    await ctx.db.patch(existing._id, { deletedAt: Date.now() });
  },
});

export const startProvisioning = internalMutation({
  args: { clerkUserId: v.string() },
  returns: v.union(v.number(), v.literal(false)),
  handler: async (ctx, { clerkUserId }) => {
    const state = await ctx.db
      .query("organizationProvisioning")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", clerkUserId))
      .unique();
    if (state?.status === "complete" || state?.status === "running") {
      return false;
    }
    if (state) {
      await ctx.db.patch(state._id, {
        status: "running",
        attempts: state.attempts + 1,
        lastError: undefined,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("organizationProvisioning", {
        clerkUserId,
        status: "running",
        attempts: 1,
        updatedAt: Date.now(),
      });
    }
    return state ? state.attempts + 1 : 1;
  },
});

export const completeProvisioning = internalMutation({
  args: {
    clerkUserId: v.string(),
    clerkOrganizationId: v.string(),
    organization: v.object(organization),
    membership: v.optional(v.object(membership)),
  },
  handler: async (ctx, args) => {
    await upsertOrganization(ctx, args.organization);
    if (args.membership) await upsertMembership(ctx, args.membership);

    const state = await ctx.db
      .query("organizationProvisioning")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerkUserId", args.clerkUserId),
      )
      .unique();
    if (state) {
      await ctx.db.patch(state._id, {
        status: "complete",
        clerkOrganizationId: args.clerkOrganizationId,
        lastError: undefined,
        updatedAt: Date.now(),
      });
    }
    return null;
  },
});

export const failProvisioning = internalMutation({
  args: { clerkUserId: v.string(), error: v.string() },
  handler: async (ctx, { clerkUserId, error }) => {
    const state = await ctx.db
      .query("organizationProvisioning")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", clerkUserId))
      .unique();
    if (state) {
      await ctx.db.patch(state._id, {
        status: "failed",
        lastError: error,
        updatedAt: Date.now(),
      });
    }
    return null;
  },
});
