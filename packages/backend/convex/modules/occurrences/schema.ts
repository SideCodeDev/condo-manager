import { defineTable } from "convex/server";
import { v } from "convex/values";

export const occurrences = defineTable({
  condoId: v.id("condos"),
  title: v.string(),
  description: v.string(),
  documentIds: v.array(v.id("assets")),
  createdByUserId: v.id("users"),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_condo", ["condoId"])
  .index("by_creator", ["createdByUserId"]);
