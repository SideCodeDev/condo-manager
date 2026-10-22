import { v } from "convex/values";
import { internalQuery, query } from "../../_generated/server";
import { getCurrentUser } from "../users/currentUser";

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
    const { user } = await getCurrentUser(ctx);

    const memberships = await ctx.db
      .query("organizationMemberships")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerkUserId", user.authProviderId),
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

function getMaxCondo(featureSlugs: string[] | undefined): "unlimited" | number {
  const feature = featureSlugs?.find((slug) => slug.startsWith("max_condo_"));
  if (!feature) return 0;

  const value = feature.slice("max_condo_".length);
  if (value === "unlimited") return "unlimited";

  const limit = Number(value);
  return Number.isInteger(limit) && limit >= 0 ? limit : 0;
}

export const getUserOrgs = query({
  args: {},
  returns: v.array(
    v.object({
      id: v.id("organizations"),
      clerkOrganizationId: v.string(),
      name: v.string(),
      features: v.object({
        maxCondo: v.union(v.literal("unlimited"), v.number()),
      }),
    }),
  ),
  handler: async (ctx) => {
    const { user } = await getCurrentUser(ctx);
    const memberships = await ctx.db
      .query("organizationMemberships")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerkUserId", user.authProviderId),
      )
      .collect();
    const activeMemberships = memberships.filter(
      (membership) => !membership.deletedAt,
    );
    const now = Date.now();

    const organizations = await Promise.all(
      activeMemberships.map(async (membership) => {
        const [organization, subscriptionItems] = await Promise.all([
          ctx.db
            .query("organizations")
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
          subscriptionItems.find((item) => item.status === "active") ??
          subscriptionItems.find(
            (item) =>
              item.status === "canceled" &&
              item.periodEnd !== undefined &&
              item.periodEnd > now,
          );

        return {
          id: organization._id,
          clerkOrganizationId: organization.clerkOrganizationId,
          name: organization.name,
          features: {
            maxCondo: getMaxCondo(currentItem?.featureSlugs),
          },
        };
      }),
    );

    return organizations.filter((organization) => organization !== null);
  },
});
