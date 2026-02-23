import { internal } from "@be/api";
import { query } from "@be/server";
import { getActiveOrg } from "../userSettings/helpers";
import { getCondosOfOrg } from "./helpers";

export const getCondos = query({
  handler: async (ctx) => {
    const { _id: userId } = await ctx.runQuery(
      internal.modules.users.queries.getUser,
    );
    const activeOrgId = await getActiveOrg(ctx, userId);
    if (!activeOrgId) return [];
    return getCondosOfOrg(ctx, activeOrgId);
  },
});
