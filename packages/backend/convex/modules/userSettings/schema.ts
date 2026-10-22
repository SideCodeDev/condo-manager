import { defineTable } from "convex/server";
import { v } from "convex/values";

export const userSettings = defineTable({
  userId: v.id("users"),
  selectedCondoId: v.optional(v.id("condos")),
}).index("by_user_id", ["userId"]);
