import { v } from "convex/values";
import { query } from "../../_generated/server";
import { getCurrentUser } from "../../authProvider/users/currentUser";

export const getAllMemberships = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("condoMember"),
      _creationTime: v.number(),
      condoId: v.id("condos"),
      userId: v.id("users"),
      type: v.union(v.literal("member"), v.literal("admin")),
      unitId: v.optional(v.id("units")),
    }),
  ),
  handler: async (ctx) => {
    const { user } = await getCurrentUser(ctx);
    const memberships = await ctx.db
      .query("condoMember")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .collect();
    return memberships.flatMap((membership) =>
      membership.userId && membership.active !== false
        ? [
            {
              _id: membership._id,
              _creationTime: membership._creationTime,
              condoId: membership.condoId,
              userId: membership.userId,
              type: membership.type,
              unitId: membership.unitId,
            },
          ]
        : [],
    );
  },
});
