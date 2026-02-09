import { components, internal } from "@convex/api";
import { Id } from "@convex/dataModel";
import { internalMutation, internalQuery, MutationCtx } from "@convex/server";
import { v } from "convex/values";
import { ApplicationError } from "./errors";

export const getUserOrganization = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    const orgMembership =
      (await ctx.db
        .query("organizationMembership")
        .withIndex("by_user_id", (q) => q.eq("userId", userId))
        .collect()) ?? [];

    if (orgMembership.length === 0)
      throw new ApplicationError("user_has_no_orgs");

    const orgs = [];

    for (const membership of orgMembership) {
      const org = await ctx.db
        .query("organization")
        .withIndex("by_id", (q) => q.eq("_id", membership.orgId))
        .unique();
      if (org) {
        let plan = (await ctx.db
          .query("plans")
          .withIndex("by_slug", (q) => q.eq("slug", "free"))
          .unique())!;
        const subscriptions = await ctx.runQuery(
          components.stripe.public.listSubscriptionsByUserId,
          { userId: org._id },
        );
        const subscription = subscriptions.find((s) => s.status === "active");
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
