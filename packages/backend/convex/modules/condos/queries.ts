import { query, type QueryCtx } from "../../_generated/server";
import { v } from "convex/values";
import { getAllCondoMemberships } from "../../lib/functionReferences";
import { getCurrentUser } from "../../authProvider/users/currentUser";
import type { Doc } from "../../_generated/dataModel";

async function withBackdropImage(ctx: QueryCtx, condo: Doc<"condos">) {
  const asset = condo.backdropImage
    ? await ctx.db.get("assets", condo.backdropImage)
    : null;
  return {
    ...condo,
    backdropImageAsset: asset
      ? {
          _id: asset._id,
          url: asset.url,
          type: asset.type,
          mimeType: asset.mimeType,
        }
      : null,
  };
}

export const listMine = query({
  handler: async (ctx) => {
    const memberships = await ctx.runQuery(getAllCondoMemberships, {});

    const condos = await Promise.all(
      memberships.map((membership) => ctx.db.get("condos", membership.condoId)),
    );

    return Promise.all(
      condos
        .filter((condo) => condo !== null)
        .map(async (condo) => {
          return withBackdropImage(ctx, condo);
        }),
    );
  },
});

export const getById = query({
  args: { condoId: v.id("condos") },
  handler: async (ctx, { condoId }) => {
    const { user } = await getCurrentUser(ctx);
    const membership = await ctx.db
      .query("condoMember")
      .withIndex("by_condo_and_user", (q) =>
        q.eq("condoId", condoId).eq("userId", user._id),
      )
      .first();
    if (!membership) return null;
    const condo = await ctx.db.get("condos", condoId);
    return condo ? withBackdropImage(ctx, condo) : null;
  },
});
