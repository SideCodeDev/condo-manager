import { v } from "convex/values";
import { makeFunctionReference, type FunctionReference } from "convex/server";
import type { Id } from "../../_generated/dataModel";
import { internalMutation, mutation } from "../../_generated/server";
import { getCurrentUser } from "../../authProvider/users/currentUser";
import { ApplicationError } from "../../lib/errors";
import { log } from "../../lib/logging";
import { assetType, type AssetType } from "./schema";

type CreateAssetArgs = {
  storageId: Id<"_storage">;
  type: AssetType;
  mimeType?: string;
  createdByUserId: Id<"users">;
};

const createAssetInternalRef = makeFunctionReference(
  "modules/assets/mutations:createAssetInternal",
) as unknown as FunctionReference<
  "mutation",
  "internal",
  CreateAssetArgs,
  Id<"assets">
>;

function getAssetType(mimeType: string) {
  const normalizedMimeType = (
    mimeType.toLowerCase().split(";")[0] ?? ""
  ).trim();

  if (normalizedMimeType.startsWith("image/")) return "image" as const;
  if (normalizedMimeType.startsWith("audio/")) return "audio" as const;
  if (normalizedMimeType === "application/pdf") return "pdf" as const;
  if (
    normalizedMimeType.startsWith("text/") ||
    normalizedMimeType === "application/rtf" ||
    normalizedMimeType === "application/msword" ||
    normalizedMimeType === "application/vnd.ms-excel" ||
    normalizedMimeType === "application/vnd.ms-powerpoint" ||
    normalizedMimeType.includes("wordprocessingml") ||
    normalizedMimeType.includes("spreadsheetml") ||
    normalizedMimeType.includes("presentationml") ||
    normalizedMimeType.includes("opendocument.text") ||
    normalizedMimeType.includes("opendocument.spreadsheet") ||
    normalizedMimeType.includes("opendocument.presentation")
  ) {
    return "document" as const;
  }
  return "other" as const;
}

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    await getCurrentUser(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const createAsset = mutation({
  args: {
    storageId: v.id("_storage"),
    type: assetType,
    mimeType: v.optional(v.string()),
  },
  returns: v.id("assets"),
  handler: async (ctx, args) => {
    const { user } = await getCurrentUser(ctx);
    return await ctx.runMutation(createAssetInternalRef, {
      ...args,
      createdByUserId: user._id,
    });
  },
});

export const createAssetInternal = internalMutation({
  args: {
    storageId: v.id("_storage"),
    type: assetType,
    mimeType: v.optional(v.string()),
    createdByUserId: v.id("users"),
  },
  returns: v.id("assets"),
  handler: async (ctx, args) => {
    const metadata = await ctx.db.system.get("_storage", args.storageId);
    if (!metadata) throw new ApplicationError("uploaded_file_not_found");

    const mimeType = metadata.contentType ?? args.mimeType;
    if (!mimeType?.trim()) {
      throw new ApplicationError("invalid_mime_type");
    }

    const type = getAssetType(mimeType);
    if (args.type !== type) {
      throw new ApplicationError("asset_type_mismatch");
    }

    const existing = await ctx.db
      .query("assets")
      .withIndex("by_storage_id", (q) => q.eq("storageId", args.storageId))
      .unique();
    if (existing) return existing._id;

    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) throw new ApplicationError("uploaded_file_not_found");

    const assetId = await ctx.db.insert("assets", {
      storageId: args.storageId,
      url,
      type,
      mimeType,
      size: metadata.size,
      sha256: metadata.sha256,
      createdByUserId: args.createdByUserId,
      createdAt: Date.now(),
    });
    log.info("asset.created", {
      assetId,
      type,
      size: metadata.size,
      mimeType,
    });
    return assetId;
  },
});
