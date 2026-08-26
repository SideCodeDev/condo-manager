import { v } from "convex/values";
import { internalQuery, query } from "../../_generated/server";
import { ApplicationError } from "../../lib/errors";

export const getUserForProvisioning = internalQuery({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_provider_id", (q) =>
        q.eq("authProviderId", clerkUserId),
      )
      .unique();
    if (!user) return null;
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  },
});

export const listMine = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ApplicationError("unauthenticated");
    const memberships = await ctx.db
      .query("organizationMemberships")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerkUserId", identity.subject),
      )
      .collect();

    const activeMemberships = memberships.filter((item) => !item.deletedAt);
    return Promise.all(
      activeMemberships.map(async (membership) => {
        const organization = await ctx.db
          .query("organizations")
          .withIndex("by_clerk_organization_id", (q) =>
            q.eq("clerkOrganizationId", membership.clerkOrganizationId),
          )
          .unique();
        return { membership, organization };
      }),
    );
  },
});

function billingState(
  subscriptionStatus: string | undefined,
  currentItem:
    | {
        status: string;
        isFreeTrial: boolean;
        planIsDefault?: boolean;
      }
    | undefined,
  hasUpcomingItem: boolean,
) {
  if (!subscriptionStatus) return "no_subscription" as const;
  if (subscriptionStatus === "past_due") return "past_due" as const;
  if (
    subscriptionStatus === "incomplete" ||
    subscriptionStatus === "upcoming"
  ) {
    return "pending" as const;
  }
  if (currentItem?.isFreeTrial) return "trial" as const;
  if (currentItem?.planIsDefault) return "free" as const;
  if (currentItem) return "active" as const;
  if (hasUpcomingItem) {
    return "pending" as const;
  }
  if (subscriptionStatus === "canceled") return "canceled" as const;
  if (
    subscriptionStatus === "ended" ||
    subscriptionStatus === "abandoned" ||
    subscriptionStatus === "expired"
  ) {
    return "ended" as const;
  }
  return "no_subscription" as const;
}

export const listMineWithBilling = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ApplicationError("unauthenticated");

    const memberships = await ctx.db
      .query("organizationMemberships")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerkUserId", identity.subject),
      )
      .collect();

    const result = await Promise.all(
      memberships
        .filter((membership) => !membership.deletedAt)
        .map(async (membership) => {
          const [organization, subscription, items] = await Promise.all([
            ctx.db
              .query("organizations")
              .withIndex("by_clerk_organization_id", (q) =>
                q.eq("clerkOrganizationId", membership.clerkOrganizationId),
              )
              .unique(),
            ctx.db
              .query("billingSubscriptions")
              .withIndex("by_clerk_organization_id", (q) =>
                q.eq("clerkOrganizationId", membership.clerkOrganizationId),
              )
              .unique(),
            ctx.db
              .query("billingSubscriptionItems")
              .withIndex("by_clerk_organization_id", (q) =>
                q.eq("clerkOrganizationId", membership.clerkOrganizationId),
              )
              .collect(),
          ]);

          if (!organization || organization.deletedAt) return null;

          const currentItem =
            items.find((item) => item.status === "active") ??
            items.find((item) => item.status === "past_due") ??
            items.find((item) => item.status === "incomplete") ??
            items.find(
              (item) =>
                item.status === "canceled" &&
                item.periodEnd !== undefined &&
                item.periodEnd > Date.now(),
            );
          const upcomingItem = items.find((item) => item.status === "upcoming");

          return {
            organization,
            membership,
            billing: {
              state: billingState(
                subscription?.status,
                currentItem,
                Boolean(upcomingItem),
              ),
              subscription,
              currentPlan: currentItem
                ? {
                    id: currentItem.clerkPlanId,
                    slug: currentItem.planSlug,
                    name: currentItem.planName,
                    status: currentItem.status,
                    isDefault: currentItem.planIsDefault ?? false,
                    isFreeTrial: currentItem.isFreeTrial,
                    featureSlugs: currentItem.featureSlugs ?? [],
                    periodEnd: currentItem.periodEnd,
                  }
                : null,
              upcomingPlan: upcomingItem
                ? {
                    id: upcomingItem.clerkPlanId,
                    slug: upcomingItem.planSlug,
                    name: upcomingItem.planName,
                    status: upcomingItem.status,
                    featureSlugs: upcomingItem.featureSlugs ?? [],
                    periodStart: upcomingItem.periodStart,
                  }
                : null,
            },
          };
        }),
    );

    return result.filter((item) => item !== null);
  },
});

export const getProvisioningStatus = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ApplicationError("unauthenticated");
    return ctx.db
      .query("organizationProvisioning")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerkUserId", identity.subject),
      )
      .unique();
  },
});
