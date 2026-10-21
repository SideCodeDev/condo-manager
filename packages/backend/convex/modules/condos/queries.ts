import { query } from "../../_generated/server";
import { getAllCondoMemberships } from "../../lib/functionReferences";

export const listMine = query({
  handler: async (ctx) => {
    const memberships = await ctx.runQuery(getAllCondoMemberships, {});

    const condos = await Promise.all(
      memberships.map((membership) => ctx.db.get("condos", membership.condoId)),
    );

    return condos.filter((condo) => !!condo);
  },
});
