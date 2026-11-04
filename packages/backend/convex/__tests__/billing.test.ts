import { expect, test } from "vitest";
import { api, internal } from "../_generated/api";
import { setupBackend } from "./helpers";

test("billing sync upserts subscriptions and subscription items", async () => {
  const { t } = await setupBackend();
  const subscription = {
    clerkSubscriptionId: "sub-1",
    clerkOrganizationId: "org-1",
    status: "active",
    createdAt: 10,
    updatedAt: 10,
    items: [
      {
        clerkSubscriptionItemId: "sub-item-1",
        clerkSubscriptionId: "sub-1",
        clerkOrganizationId: "org-1",
        status: "active",
        isFreeTrial: false,
        periodStart: 10,
        updatedAt: 10,
        featureSlugs: ["max_condo_5"],
      },
    ],
  };
  await t.mutation(internal.authProvider.billing.mutations.syncSubscription, subscription);
  await t.mutation(internal.authProvider.billing.mutations.syncSubscription, {
    ...subscription,
    status: "past_due",
    updatedAt: 20,
    items: subscription.items.map((item) => ({ ...item, status: "past_due", updatedAt: 20 })),
  });

  const stored = await t.run(async (ctx) => ({
    subscription: await ctx.db.query("billingSubscriptions").withIndex("by_clerk_subscription_id", (q) => q.eq("clerkSubscriptionId", "sub-1")).unique(),
    items: await ctx.db.query("billingSubscriptionItems").withIndex("by_clerk_subscription_id", (q) => q.eq("clerkSubscriptionId", "sub-1")).collect(),
  }));
  expect(stored.subscription?.status).toBe("past_due");
  expect(stored.items).toHaveLength(1);
  expect(stored.items[0]?.status).toBe("past_due");
});
