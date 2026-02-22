import { components, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import {
  internalMutation,
  internalQuery,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
import { v } from "convex/values";
import { ApplicationError } from "./errors";

export const getUserOrganization = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    return await getUserOrgs(ctx, userId);
  },
});

export const createOrganization = internalMutation({
  args: {
    name: v.string(),
  },
  returns: v.id("organization"),
  handler: async (ctx, { name }) => {
    const { _id: userId } = await ctx.runQuery(internal.user.getUser);
    const id = await createOrganizationForUser(ctx, userId, name);
    return id;
  },
});

export async function createOrganizationForUser(
  ctx: MutationCtx,
  userId: Id<"users">,
  name: string,
) {
  const orgId = await ctx.db.insert("organization", { name });

  await ctx.db.insert("organizationMembership", {
    orgId,
    userId,
    role: "owner",
  });

  return orgId;
}

export const updateOrganization = internalMutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    const { _id: userId } = await ctx.runQuery(internal.user.getUser);
    const orgMembership = await ctx.db
      .query("organizationMembership")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();

    if (!orgMembership) throw new ApplicationError("user_has_no_orgs");
    if (orgMembership.role === "member")
      throw new ApplicationError("unauthorized");

    await ctx.db.patch("organization", orgMembership.orgId, { name });
  },
});

export const getCurrentFeatureSet = query({
  handler: async (ctx) => {
    const { _id: userId } = await ctx.runQuery(internal.user.getUser);
    const orgs = await getUserOrgs(ctx, userId);
    const org = orgs?.[0];
    if (!org) throw new ApplicationError("org_not_found");
    // return org;
    const {
      plan: { slug, maxNumberOfCondos },
    } = org;
    return {
      plan: slug,
      features: {
        maxNumberOfCondos,
      },
    };
  },
});

async function getUserOrgs(ctx: QueryCtx, userId: Id<"users">) {
  const orgMembership =
    (await ctx.db
      .query("organizationMembership")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect()) ?? [];

  if (orgMembership.length === 0)
    throw new ApplicationError("user_has_no_orgs");

  const orgs = [];

  for (const membership of orgMembership) {
    const org = await ctx.db.get("organization", membership.orgId);
    if (org) {
      let plan = (await ctx.db
        .query("plans")
        .withIndex("by_slug", (q) => q.eq("slug", "free"))
        .unique())!;
      const subscription = await ctx
        .runQuery(components.stripe.public.getSubscriptionByOrgId, {
          orgId: org._id,
        })
        .then((sub) => (sub?.status === "active" ? sub : null));
      if (subscription) {
        const priceId = subscription.priceId;
        plan =
          (await ctx.db
            .query("plans")
            .withIndex("by_price_id", (q) => q.eq("priceId", priceId))
            .unique()) ?? plan;
      }
      const enhancedOrg = { ...org, role: membership.role, plan };
      orgs.push(enhancedOrg);
    }
  }
  return orgs;
}
