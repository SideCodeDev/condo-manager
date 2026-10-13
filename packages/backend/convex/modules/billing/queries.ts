import { v } from "convex/values";
import { internalQuery, query } from "../../_generated/server";
import { ApplicationError } from "../../lib/errors";

function activeOrganizationId(identity: Record<string, unknown>) {
  const value = identity.org_id ?? identity.orgId;
  return typeof value === "string" ? value : undefined;
}

export const getSelectedOrganizationForUser = internalQuery({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_provider_id", (q) =>
        q.eq("authProviderId", clerkUserId),
      )
      .unique();
    if (!user) return null;

    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .unique();
    const organizationId = settings?.selectedClerkOrganizationId;
    if (!organizationId) return null;

    const membership = await ctx.db
      .query("organizationMemberships")
      .withIndex("by_user_and_organization", (q) =>
        q
          .eq("clerkUserId", clerkUserId)
          .eq("clerkOrganizationId", organizationId),
      )
      .unique();
    return membership && !membership.deletedAt ? organizationId : null;
  },
});

export const getCurrentSubscription = query({
  args: { clerkOrganizationId: v.optional(v.string()) },
  handler: async (ctx, { clerkOrganizationId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ApplicationError("unauthenticated");
    const organizationId =
      clerkOrganizationId ??
      activeOrganizationId(identity as unknown as Record<string, unknown>);
    if (!organizationId) throw new ApplicationError("user_has_no_orgs");

    const membership = await ctx.db
      .query("organizationMemberships")
      .withIndex("by_user_and_organization", (q) =>
        q
          .eq("clerkUserId", identity.subject)
          .eq("clerkOrganizationId", organizationId),
      )
      .unique();
    if (!membership || membership.deletedAt) {
      throw new ApplicationError("unauthorized");
    }

    const subscription = await ctx.db
      .query("billingSubscriptions")
      .withIndex("by_clerk_organization_id", (q) =>
        q.eq("clerkOrganizationId", organizationId),
      )
      .unique();
    const items = await ctx.db
      .query("billingSubscriptionItems")
      .withIndex("by_clerk_organization_id", (q) =>
        q.eq("clerkOrganizationId", organizationId),
      )
      .collect();

    const currentItem =
      items.find((item) => item.status === "active") ??
      items.find(
        (item) =>
          item.status === "canceled" &&
          item.periodEnd !== undefined &&
          item.periodEnd > Date.now(),
      );
    const upcomingItem = items.find((item) => item.status === "upcoming");

    return { subscription, currentItem, upcomingItem };
  },
});
