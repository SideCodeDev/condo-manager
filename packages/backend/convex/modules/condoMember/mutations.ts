import { v } from "convex/values";
import type { Id } from "../../_generated/dataModel";
import { mutation, type MutationCtx } from "../../_generated/server";
import { ApplicationError } from "../../lib/errors";
import { getCurrentUser } from "../users/currentUser";

type MembershipInput = {
  condoId: Id<"condos">;
  userId: Id<"users">;
  type: "member" | "admin";
};

export async function createCondoMembership(
  ctx: MutationCtx,
  args: MembershipInput,
) {
  const existingMembership = await ctx.db
    .query("condoMember")
    .withIndex("by_condo_and_user", (q) =>
      q.eq("condoId", args.condoId).eq("userId", args.userId),
    )
    .unique();
  if (existingMembership) {
    throw new ApplicationError("condo_membership_exists");
  }

  return await ctx.db.insert("condoMember", args);
}

export const create = mutation({
  args: {
    condoId: v.id("condos"),
    userId: v.id("users"),
    type: v.union(v.literal("member"), v.literal("admin")),
  },
  returns: v.id("condoMember"),
  handler: async (ctx, args) => {
    const { user } = await getCurrentUser(ctx);
    const condo = await ctx.db.get("condos", args.condoId);
    if (!condo) throw new ApplicationError("condo_not_found");

    const existingMembership = await ctx.db
      .query("condoMember")
      .withIndex("by_condo_and_user", (q) =>
        q.eq("condoId", args.condoId).eq("userId", user._id),
      )
      .unique();
    if (existingMembership) {
      throw new ApplicationError("condo_membership_exists");
    }

    return await ctx.db.insert("condoMember", args);
  },
});
