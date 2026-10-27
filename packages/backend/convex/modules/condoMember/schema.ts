import { defineTable } from "convex/server";
import { v } from "convex/values";

export const condoMember = defineTable({
  condoId: v.id("condos"),
  userId: v.id("users"),
  type: v.union(v.literal("member"), v.literal("admin")),
  unitId: v.optional(v.id("units")),
})
  .index("by_condo_id", ["condoId"])
  .index("by_user_id", ["userId"])
  .index("by_condo_and_user", ["condoId", "userId"])
  .index("by_unit_id", ["unitId"]);
