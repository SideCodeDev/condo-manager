import { v } from "convex/values";
import type { Id } from "../../_generated/dataModel";
import { mutation, type MutationCtx } from "../../_generated/server";
import { getCurrentUser } from "../../authProvider/users/currentUser";
import { ApplicationError } from "../../lib/errors";
import { log } from "../../lib/logging";

async function requireCondoMembership(
  ctx: MutationCtx,
  condoId: Id<"condos">,
  userId: Id<"users">,
) {
  const condo = await ctx.db.get("condos", condoId);
  if (!condo) throw new ApplicationError("condo_not_found");
  const membership = await ctx.db
    .query("condoMember")
    .withIndex("by_condo_and_user", (q) =>
      q.eq("condoId", condoId).eq("userId", userId),
    )
    .unique();
  if (!membership || membership.active === false) {
    throw new ApplicationError("unauthorized");
  }
  return membership;
}

async function validateDocuments(ctx: MutationCtx, documentIds: Id<"assets">[]) {
  const uniqueIds = [...new Set(documentIds)];
  if (uniqueIds.length !== documentIds.length) {
    throw new ApplicationError("invalid_occurrence_documents");
  }
  const documents = await Promise.all(
    uniqueIds.map((documentId) => ctx.db.get("assets", documentId)),
  );
  if (documents.some((document) => !document)) {
    throw new ApplicationError("invalid_occurrence_documents");
  }
}

function validateText(title: string, description: string) {
  if (!title.trim() || !description.trim()) {
    throw new ApplicationError("invalid_occurrence");
  }
}

export const create = mutation({
  args: {
    condoId: v.id("condos"),
    title: v.string(),
    description: v.string(),
    documentIds: v.optional(v.array(v.id("assets"))),
  },
  returns: v.id("occurrences"),
  handler: async (ctx, args) => {
    const { user } = await getCurrentUser(ctx);
    await requireCondoMembership(ctx, args.condoId, user._id);
    validateText(args.title, args.description);
    const documentIds = args.documentIds ?? [];
    await validateDocuments(ctx, documentIds);
    const now = Date.now();
    const occurrenceId = await ctx.db.insert("occurrences", {
      condoId: args.condoId,
      title: args.title.trim(),
      description: args.description.trim(),
      documentIds,
      createdByUserId: user._id,
      createdAt: now,
      updatedAt: now,
    });
    log.info("condo.occurrence.created", {
      occurrenceId,
      condoId: args.condoId,
      createdByUserId: user._id,
      documentCount: documentIds.length,
    });
    return occurrenceId;
  },
});

export const update = mutation({
  args: {
    occurrenceId: v.id("occurrences"),
    title: v.string(),
    description: v.string(),
    documentIds: v.array(v.id("assets")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { user } = await getCurrentUser(ctx);
    const occurrence = await ctx.db.get("occurrences", args.occurrenceId);
    if (!occurrence) throw new ApplicationError("occurrence_not_found");
    await requireCondoMembership(ctx, occurrence.condoId, user._id);
    if (occurrence.createdByUserId !== user._id) {
      throw new ApplicationError("unauthorized");
    }
    validateText(args.title, args.description);
    await validateDocuments(ctx, args.documentIds);
    await ctx.db.patch("occurrences", occurrence._id, {
      title: args.title.trim(),
      description: args.description.trim(),
      documentIds: args.documentIds,
      updatedAt: Date.now(),
    });
    log.info("condo.occurrence.updated", {
      occurrenceId: occurrence._id,
      condoId: occurrence.condoId,
      updatedByUserId: user._id,
    });
    return null;
  },
});

export const remove = mutation({
  args: { occurrenceId: v.id("occurrences") },
  returns: v.null(),
  handler: async (ctx, { occurrenceId }) => {
    const { user } = await getCurrentUser(ctx);
    const occurrence = await ctx.db.get("occurrences", occurrenceId);
    if (!occurrence) throw new ApplicationError("occurrence_not_found");
    const membership = await requireCondoMembership(
      ctx,
      occurrence.condoId,
      user._id,
    );
    if (
      occurrence.createdByUserId !== user._id &&
      membership.type !== "admin"
    ) {
      throw new ApplicationError("unauthorized");
    }
    await ctx.db.delete("occurrences", occurrenceId);
    log.info("condo.occurrence.deleted", {
      occurrenceId,
      condoId: occurrence.condoId,
      deletedByUserId: user._id,
    });
    return null;
  },
});
