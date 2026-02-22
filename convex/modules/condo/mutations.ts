import { internal } from "@be/api";
import { mutation } from "@be/server";
import { v } from "convex/values";
import { getActiveOrg } from "../userSettings/helpers";
import { ApplicationError } from "../../lib/errors";
import { ensureUserCanCreateCondo } from "./helpers";

export const createCondo = mutation({
  args: {
    address: v.string(),
    name: v.string(),
  },
  handler: async (ctx, { address, name }) => {
    const { _id: userId } = await ctx.runQuery(
      internal.modules.users.queries.getUser,
    );
    const orgId = await getActiveOrg(ctx, userId);
    if (!orgId) throw new ApplicationError("org_not_found");
    await ensureUserCanCreateCondo(ctx, userId);
    await ctx.db.insert("condo", {
      orgId,
      address,
      name,
    });
  },
});
