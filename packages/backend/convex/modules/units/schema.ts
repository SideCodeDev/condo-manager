import { defineTable } from "convex/server";
import { v } from "convex/values";

export const units = defineTable({
  condoId: v.id("condos"),
  floor: v.string(),
  side: v.string(),
  permillage: v.number(),
  usageType: v.union(v.literal("residential"), v.literal("commercial")),
}).index("by_condo_id", ["condoId"]);
