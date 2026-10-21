import { query } from "../../_generated/server";
import { getUserOrgs } from "../../lib/functionReferences";

export const listMine = query({
  handler: async (ctx) => {
    const userOrgs = await ctx.runQuery(getUserOrgs, {});

    const condosByOrg = await Promise.all(
      userOrgs.map((o) =>
        ctx.db
          .query("condos")
          .withIndex("by_organization_id", (q) => q.eq("organizationId", o.id)),
      ),
    );

    return condosByOrg.flat();
  },
});
