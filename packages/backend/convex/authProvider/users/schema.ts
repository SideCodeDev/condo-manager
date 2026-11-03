import { defineTable } from "convex/server";
import { v } from "convex/values";

export const users = defineTable({
  authProviderId: v.string(),
  email: v.string(),
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  updatedAt: v.number(),
  raw: v.optional(v.string()),
})
  .index("by_auth_provider_id", ["authProviderId"])
  .index("by_email", ["email"]);
