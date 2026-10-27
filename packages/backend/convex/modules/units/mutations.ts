import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import { getCurrentUser } from "../../authProvider/users/currentUser";
import { ApplicationError } from "../../lib/errors";
import { log } from "../../lib/logging";

export const create = mutation({
  args: {
    condoId: v.id("condos"),
    floor: v.string(),
    side: v.string(),
    permillage: v.number(),
    usageType: v.union(v.literal("residential"), v.literal("commercial")),
    condoMemberIds: v.optional(v.array(v.id("condoMember"))),
  },
  returns: v.id("units"),
  handler: async (ctx, args) => {
    const { user } = await getCurrentUser(ctx);
    const condo = await ctx.db.get("condos", args.condoId);
    if (!condo) throw new ApplicationError("condo_not_found");

    const adminMembership = await ctx.db
      .query("condoMember")
      .withIndex("by_condo_and_user", (q) =>
        q.eq("condoId", args.condoId).eq("userId", user._id),
      )
      .unique();
    if (!adminMembership || adminMembership.type !== "admin") {
      throw new ApplicationError("unauthorized");
    }

    if (
      !args.floor.trim() ||
      !args.side.trim() ||
      args.permillage < 0 ||
      args.permillage > 1000
    ) {
      throw new ApplicationError("invalid_unit");
    }

    const condoMemberIds = [...new Set(args.condoMemberIds ?? [])];
    const memberships = await Promise.all(
      condoMemberIds.map((membershipId) =>
        ctx.db.get("condoMember", membershipId),
      ),
    );
    for (const membership of memberships) {
      if (!membership || membership.condoId !== args.condoId) {
        throw new ApplicationError("condo_member_not_found");
      }
      if (membership.unitId) {
        throw new ApplicationError("condo_member_already_assigned");
      }
    }

    const unitId = await ctx.db.insert("units", {
      condoId: args.condoId,
      floor: args.floor.trim(),
      side: args.side.trim(),
      permillage: args.permillage,
      usageType: args.usageType,
    });
    await Promise.all(
      condoMemberIds.map((membershipId) =>
        ctx.db.patch("condoMember", membershipId, { unitId }),
      ),
    );

    log.info("condo.unit.created", {
      unitId,
      condoId: args.condoId,
      createdByUserId: user._id,
      condoMemberCount: condoMemberIds.length,
    });
    return unitId;
  },
});
