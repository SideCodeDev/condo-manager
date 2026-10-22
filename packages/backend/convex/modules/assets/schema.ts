import { defineTable } from "convex/server";
import { v, type Infer } from "convex/values";

export const assetType = v.union(
  v.literal("image"),
  v.literal("pdf"),
  v.literal("document"),
  v.literal("audio"),
  v.literal("other"),
);
export type AssetType = Infer<typeof assetType>;

export const assets = defineTable({
  storageId: v.id("_storage"),
  url: v.string(),
  type: assetType,
  mimeType: v.string(),
  size: v.number(),
  sha256: v.string(),
  createdByUserId: v.id("users"),
  createdAt: v.number(),
})
  .index("by_storage_id", ["storageId"])
  .index("by_creator", ["createdByUserId"]);
