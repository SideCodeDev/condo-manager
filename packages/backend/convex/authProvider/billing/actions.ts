"use node";

import {
  createClerkClient,
  type BillingSubscriptionItem,
} from "@clerk/backend";
import { v } from "convex/values";
import { internalAction, type ActionCtx } from "../../_generated/server";
import {
  syncBillingSubscription,
  type BillingItemInput,
} from "../../lib/functionReferences";

function normalizeItem(
  item: BillingSubscriptionItem,
  clerkOrganizationId: string,
  clerkSubscriptionId: string,
): BillingItemInput {
  return {
    clerkSubscriptionItemId: item.id,
    clerkSubscriptionId,
    clerkOrganizationId,
    clerkPlanId: item.planId ?? undefined,
    planSlug: item.plan?.slug,
    planName: item.plan?.name,
    planIsDefault: item.plan?.isDefault,
    featureSlugs: item.plan?.features.map((feature) => feature.slug),
    status: item.status,
    billingPeriod: item.planPeriod,
    isFreeTrial: item.isFreeTrial,
    periodStart: item.periodStart,
    periodEnd: item.periodEnd ?? undefined,
    canceledAt: item.canceledAt ?? undefined,
    endedAt: item.endedAt ?? undefined,
    pastDueAt: item.pastDueAt ?? undefined,
    updatedAt: item.updatedAt,
    raw: JSON.stringify(item),
  };
}

async function refreshSubscription(
  ctx: ActionCtx,
  clerkOrganizationId: string,
) {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) throw new Error("Missing CLERK_SECRET_KEY");

  const clerk = createClerkClient({ secretKey });
  const subscription =
    await clerk.billing.getOrganizationBillingSubscription(clerkOrganizationId);

  await ctx.runMutation(syncBillingSubscription, {
    clerkSubscriptionId: subscription.id,
    clerkOrganizationId,
    status: subscription.status,
    activeAt: subscription.activeAt ?? undefined,
    pastDueAt: subscription.pastDueAt ?? undefined,
    createdAt: subscription.createdAt,
    updatedAt: subscription.updatedAt,
    items: subscription.subscriptionItems.map((item) =>
      normalizeItem(item, clerkOrganizationId, subscription.id),
    ),
    raw: JSON.stringify(subscription),
  });
  return null;
}

export const refreshOrganizationSubscription = internalAction({
  args: { clerkOrganizationId: v.string() },
  handler: (ctx, { clerkOrganizationId }) =>
    refreshSubscription(ctx, clerkOrganizationId),
});
