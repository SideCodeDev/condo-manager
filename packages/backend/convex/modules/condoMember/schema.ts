import { defineTable } from "convex/server";
import { v } from "convex/values";

export const condoMember = defineTable({
  condoId: v.id("condos"),
  userId: v.optional(v.id("users")),
  email: v.optional(v.string()),
  active: v.optional(v.boolean()),
  invitationStatus: v.optional(
    v.union(v.literal("pending"), v.literal("sent"), v.literal("failed")),
  ),
  invitationId: v.optional(v.string()),
  type: v.union(v.literal("member"), v.literal("admin")),
  unitId: v.optional(v.id("units")),
})
  .index("by_condo_id", ["condoId"])
  .index("by_user_id", ["userId"])
  .index("by_condo_and_user", ["condoId", "userId"])
  .index("by_condo_and_email", ["condoId", "email"])
  .index("by_email", ["email"])
  .index("by_unit_id", ["unitId"]);
