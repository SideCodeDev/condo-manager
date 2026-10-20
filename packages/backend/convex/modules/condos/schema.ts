import { defineTable } from "convex/server";
import { v } from "convex/values";

export const condos = defineTable({
  clerkOrganizationId: v.string(),
  name: v.string(),
  address: v.object({
    street: v.string(),
    postalCode: v.string(),
    city: v.string(),
    region: v.optional(v.string()),
    countryCode: v.string(),
  }),
  createdAt: v.number(),
  updatedAt: v.number(),
}).index("by_clerk_organization_id", ["clerkOrganizationId"]);
