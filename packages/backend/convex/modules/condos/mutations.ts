import { v } from "convex/values";
import { mutation, type MutationCtx } from "../../_generated/server";
import type { Id } from "../../_generated/dataModel";
import { ApplicationError } from "../../lib/errors";

const condoAddress = v.object({
  street: v.string(),
  postalCode: v.string(),
  city: v.string(),
  region: v.optional(v.string()),
  countryCode: v.string(),
});

type CondoLimit = { kind: "limited"; value: number } | { kind: "unlimited" };

async function getCondoForMember(
  ctx: MutationCtx,
  condoId: Id<"condos">,
) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ApplicationError("unauthenticated");

  const condo = await ctx.db.get("condos", condoId);
  if (!condo || condo.archivedAt !== undefined) {
    throw new ApplicationError("condo_not_found");
  }

  const membership = await ctx.db
    .query("organizationMemberships")
    .withIndex("by_user_and_organization", (q) =>
      q
        .eq("clerkUserId", identity.subject)
        .eq("clerkOrganizationId", condo.clerkOrganizationId),
    )
    .unique();
  if (!membership || membership.deletedAt) {
    throw new ApplicationError("unauthorized");
  }

  const organization = await ctx.db
    .query("organizations")
    .withIndex("by_clerk_organization_id", (q) =>
      q.eq("clerkOrganizationId", condo.clerkOrganizationId),
    )
    .unique();
  if (!organization || organization.deletedAt) {
    throw new ApplicationError("unauthorized");
  }

  return condo;
}

function getCondoLimit(featureSlugs: string[]): CondoLimit {
  // Configure exactly one of these Clerk Billing features on each plan.
  const condoFeatures = featureSlugs.filter(
    (slug) =>
      slug === "max_condo_1" ||
      slug === "max_condo_5" ||
      slug === "max_condo_unlimited",
  );
  if (condoFeatures.length !== 1) {
    throw new ApplicationError("plan_not_found");
  }

  const feature = condoFeatures[0];
  if (!feature) throw new ApplicationError("plan_not_found");
  if (feature === "max_condo_unlimited") return { kind: "unlimited" };
  return { kind: "limited", value: feature === "max_condo_1" ? 1 : 5 };
}

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    address: condoAddress,
  },
  returns: v.id("condos"),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ApplicationError("unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_provider_id", (q) =>
        q.eq("authProviderId", identity.subject),
      )
      .unique();
    if (!user) throw new ApplicationError("unauthorized");

    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .unique();
    const clerkOrganizationId = settings?.selectedClerkOrganizationId;
    if (!clerkOrganizationId) throw new ApplicationError("user_has_no_orgs");

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

    const organization = await ctx.db
      .query("organizations")
      .withIndex("by_clerk_organization_id", (q) =>
        q.eq("clerkOrganizationId", clerkOrganizationId),
      )
      .unique();
    if (!organization || organization.deletedAt) {
      throw new ApplicationError("org_not_found");
    }

    const subscriptionItems = await ctx.db
      .query("billingSubscriptionItems")
      .withIndex("by_clerk_organization_id", (q) =>
        q.eq("clerkOrganizationId", clerkOrganizationId),
      )
      .collect();
    const now = Date.now();
    const currentItem =
      subscriptionItems.find((item) => item.status === "active") ??
      subscriptionItems.find(
        (item) =>
          item.status === "canceled" &&
          item.periodEnd !== undefined &&
          item.periodEnd > now,
      );
    if (!currentItem) throw new ApplicationError("plan_not_found");

    const limit = getCondoLimit(currentItem.featureSlugs ?? []);
    if (limit.kind === "limited") {
      const activeCondos = await ctx.db
        .query("condos")
        .withIndex("by_clerk_organization_and_archived_at", (q) =>
          q
            .eq("clerkOrganizationId", clerkOrganizationId)
            .eq("archivedAt", undefined),
        )
        .take(limit.value);
      if (activeCondos.length >= limit.value) {
        throw new ApplicationError("max_condos_reached");
      }
    }

    if (!args.name.trim() || !args.slug.trim()) {
      throw new ApplicationError("cannot_create_condo");
    }

    return ctx.db.insert("condos", {
      ...args,
      clerkOrganizationId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    condoId: v.id("condos"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    address: v.optional(condoAddress),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await getCondoForMember(ctx, args.condoId);

    if (
      args.name === undefined &&
      args.slug === undefined &&
      args.address === undefined
    ) {
      throw new ApplicationError("cannot_update_condo");
    }
    if (args.name !== undefined && !args.name.trim()) {
      throw new ApplicationError("cannot_update_condo");
    }
    if (args.slug !== undefined && !args.slug.trim()) {
      throw new ApplicationError("cannot_update_condo");
    }

    await ctx.db.patch("condos", args.condoId, {
      ...(args.name !== undefined ? { name: args.name.trim() } : {}),
      ...(args.slug !== undefined ? { slug: args.slug.trim() } : {}),
      ...(args.address !== undefined ? { address: args.address } : {}),
      updatedAt: Date.now(),
    });
    return null;
  },
});

export const archive = mutation({
  args: { condoId: v.id("condos") },
  returns: v.null(),
  handler: async (ctx, { condoId }) => {
    await getCondoForMember(ctx, condoId);
    const now = Date.now();
    await ctx.db.patch("condos", condoId, {
      archivedAt: now,
      updatedAt: now,
    });
    return null;
  },
});
