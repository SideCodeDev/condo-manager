import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const clerkTables = {
  users: defineTable({
    authProviderId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    updatedAt: v.number(),
    raw: v.optional(v.string()),
  }).index("by_auth_provider_id", ["authProviderId"]),
  organizations: defineTable({
    clerkOrganizationId: v.string(),
    name: v.string(),
    slug: v.string(),
    imageUrl: v.optional(v.string()),
    createdByClerkUserId: v.optional(v.string()),
    kind: v.union(v.literal("personal"), v.literal("team")),
    createdAt: v.number(),
    updatedAt: v.number(),
    deletedAt: v.optional(v.number()),
    raw: v.optional(v.string()),
  }).index("by_clerk_organization_id", ["clerkOrganizationId"]),
  organizationMemberships: defineTable({
    clerkMembershipId: v.string(),
    clerkOrganizationId: v.string(),
    clerkUserId: v.string(),
    role: v.string(),
    permissions: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    deletedAt: v.optional(v.number()),
    raw: v.optional(v.string()),
  })
    .index("by_clerk_membership_id", ["clerkMembershipId"])
    .index("by_clerk_user_id", ["clerkUserId"])
    .index("by_clerk_organization_id", ["clerkOrganizationId"])
    .index("by_user_and_organization", ["clerkUserId", "clerkOrganizationId"]),
  organizationProvisioning: defineTable({
    clerkUserId: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("complete"),
      v.literal("failed"),
    ),
    clerkOrganizationId: v.optional(v.string()),
    attempts: v.number(),
    lastError: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_clerk_user_id", ["clerkUserId"]),
  billingSubscriptions: defineTable({
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
    .index("by_clerk_organization_id", ["clerkOrganizationId"]),
  billingSubscriptionItems: defineTable({
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
    .index("by_clerk_organization_id", ["clerkOrganizationId"]),
};

const applicationTables = {
  condos: defineTable({
    clerkOrganizationId: v.string(),
    name: v.string(),
    slug: v.string(),
    address: v.object({
      street: v.string(),
      postalCode: v.string(),
      city: v.string(),
      region: v.optional(v.string()),
      countryCode: v.string(),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
    archivedAt: v.optional(v.number()),
  })
    .index("by_clerk_organization_id", ["clerkOrganizationId"])
    .index("by_clerk_organization_and_archived_at", [
      "clerkOrganizationId",
      "archivedAt",
    ]),
  userSettings: defineTable({
    userId: v.id("users"),
    selectedClerkOrganizationId: v.optional(v.string()),
  }).index("by_user_id", ["userId"]),
};

export default defineSchema({
  ...clerkTables,
  ...applicationTables,
});
