import { query } from "../../_generated/server";
import { getAllCondoMemberships } from "../../lib/functionReferences";

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
          const backdropImageAsset = condo.backdropImage
            ? await ctx.db.get("assets", condo.backdropImage)
            : null;
          return {
            ...condo,
            backdropImageAsset: backdropImageAsset
              ? {
                  _id: backdropImageAsset._id,
                  url: backdropImageAsset.url,
                  type: backdropImageAsset.type,
                  mimeType: backdropImageAsset.mimeType,
                }
              : null,
          };
        }),
    );
  },
});
