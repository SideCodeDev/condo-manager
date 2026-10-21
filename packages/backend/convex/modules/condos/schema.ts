import { defineTable } from "convex/server";
import { v } from "convex/values";

export const condos = defineTable({
  organizationId: v.id("organizations"),
  name: v.string(),
  address: v.object({
    street: v.string(),
    postalCode: v.string(),
    city: v.string(),
  }),
  createdAt: v.number(),
  updatedAt: v.number(),
}).index("by_organization_id", ["organizationId"]);
