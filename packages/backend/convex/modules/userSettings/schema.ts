import { defineTable } from "convex/server";
import { v } from "convex/values";

export const userSettings = defineTable({
  userId: v.id("users"),
  selectedClerkOrganizationId: v.optional(v.string()),
}).index("by_user_id", ["userId"]);
