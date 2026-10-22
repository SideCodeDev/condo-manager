import { defineTable } from "convex/server";
import { v } from "convex/values";

export const billingSubscriptions = defineTable({
  clerkSubscriptionId: v.string(),
  clerkOrganizationId: v.string(),
  status: v.string(),
  activeAt: v.optional(v.number()),
  canceledAt: v.optional(v.number()),
  endedAt: v.optional(v.number()),
  pastDueAt: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number(),
  raw: v.optional(v.string()),
})
  .index("by_clerk_subscription_id", ["clerkSubscriptionId"])
  .index("by_clerk_organization_id", ["clerkOrganizationId"]);

export const billingSubscriptionItems = defineTable({
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
  isFreeTrial: v.boolean(),
  periodStart: v.number(),
  periodEnd: v.optional(v.number()),
  canceledAt: v.optional(v.number()),
  endedAt: v.optional(v.number()),
  pastDueAt: v.optional(v.number()),
  updatedAt: v.number(),
  raw: v.optional(v.string()),
})
  .index("by_clerk_subscription_item_id", ["clerkSubscriptionItemId"])
  .index("by_clerk_subscription_id", ["clerkSubscriptionId"])
  .index("by_clerk_organization_id", ["clerkOrganizationId"]);
