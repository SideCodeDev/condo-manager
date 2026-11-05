import { v } from "convex/values";
import type { Id } from "../../_generated/dataModel";
import { query, type QueryCtx } from "../../_generated/server";
import { getCurrentUser } from "../../authProvider/users/currentUser";
import { ApplicationError } from "../../lib/errors";

async function requireCondoMembership(
  ctx: QueryCtx,
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
}

const occurrenceValidator = v.object({
  _id: v.id("occurrences"),
  _creationTime: v.number(),
  condoId: v.id("condos"),
  title: v.string(),
  description: v.string(),
  documentIds: v.array(v.id("assets")),
  createdByUserId: v.id("users"),
  createdAt: v.number(),
  updatedAt: v.number(),
});

export const listByCondo = query({
  args: { condoId: v.id("condos") },
  returns: v.array(occurrenceValidator),
  handler: async (ctx, { condoId }) => {
    const { user } = await getCurrentUser(ctx);
    await requireCondoMembership(ctx, condoId, user._id);
    return await ctx.db
      .query("occurrences")
      .withIndex("by_condo", (q) => q.eq("condoId", condoId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { occurrenceId: v.id("occurrences") },
  returns: v.union(occurrenceValidator, v.null()),
  handler: async (ctx, { occurrenceId }) => {
    const { user } = await getCurrentUser(ctx);
    const occurrence = await ctx.db.get("occurrences", occurrenceId);
    if (!occurrence) return null;
    await requireCondoMembership(ctx, occurrence.condoId, user._id);
    return occurrence;
  },
});
