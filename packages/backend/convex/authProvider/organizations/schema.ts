import { defineTable } from "convex/server";
import { v } from "convex/values";

export const organizations = defineTable({
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
}).index("by_clerk_organization_id", ["clerkOrganizationId"]);

export const organizationMemberships = defineTable({
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
  .index("by_user_and_organization", ["clerkUserId", "clerkOrganizationId"]);

export const organizationProvisioning = defineTable({
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
}).index("by_clerk_user_id", ["clerkUserId"]);
