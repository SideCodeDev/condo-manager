import { v } from "convex/values";
import { internalMutation, type MutationCtx } from "../../_generated/server";

const billingItem = {
  clerkSubscriptionItemId: v.string(),
  clerkSubscriptionId: v.optional(v.string()),
  clerkOrganizationId: v.string(),
  clerkPlanId: v.optional(v.string()),
  planSlug: v.optional(v.string()),
  planName: v.optional(v.string()),
  planIsDefault: v.optional(v.boolean()),
  featureSlugs: v.optional(v.array(v.string())),
  status: v.string(),
  billingPeriod: v.optional(v.string()),
  isFreeTrial: v.optional(v.boolean()),
  periodStart: v.number(),
  periodEnd: v.optional(v.number()),
  canceledAt: v.optional(v.number()),
  endedAt: v.optional(v.number()),
  pastDueAt: v.optional(v.number()),
  updatedAt: v.number(),
  raw: v.optional(v.string()),
};

async function upsertItem(
  ctx: MutationCtx,
  item: {
    clerkSubscriptionItemId: string;
    clerkSubscriptionId?: string;
    clerkOrganizationId: string;
    clerkPlanId?: string;
    planSlug?: string;
    planName?: string;
    planIsDefault?: boolean;
    featureSlugs?: string[];
    status: string;
    billingPeriod?: string;
    isFreeTrial?: boolean;
    periodStart: number;
    periodEnd?: number;
    canceledAt?: number;
    endedAt?: number;
    pastDueAt?: number;
    updatedAt: number;
    raw?: string;
  },
) {
  const existing = await ctx.db
    .query("billingSubscriptionItems")
    .withIndex("by_clerk_subscription_item_id", (q) =>
      q.eq("clerkSubscriptionItemId", item.clerkSubscriptionItemId),
    )
    .unique();
  if (existing) await ctx.db.patch(existing._id, item);
  else
    await ctx.db.insert("billingSubscriptionItems", {
      ...item,
      isFreeTrial: item.isFreeTrial ?? false,
    });
}

export const syncSubscription = internalMutation({
  args: {
    clerkSubscriptionId: v.string(),
    clerkOrganizationId: v.string(),
    status: v.string(),
    activeAt: v.optional(v.number()),
    canceledAt: v.optional(v.number()),
    endedAt: v.optional(v.number()),
    pastDueAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
    items: v.array(v.object(billingItem)),
    raw: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("billingSubscriptions")
      .withIndex("by_clerk_subscription_id", (q) =>
        q.eq("clerkSubscriptionId", args.clerkSubscriptionId),
      )
      .unique();
    const { items, ...subscription } = args;
    if (existing) await ctx.db.patch(existing._id, subscription);
    else await ctx.db.insert("billingSubscriptions", subscription);
    for (const item of items) await upsertItem(ctx, item);
    return null;
  },
});

export const syncSubscriptionItem = internalMutation({
  args: billingItem,
  handler: async (ctx, item) => upsertItem(ctx, item),
});
