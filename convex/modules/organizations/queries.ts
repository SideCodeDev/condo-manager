import { internal } from "@be/api";
import { internalQuery, query } from "@be/server";
import { v } from "convex/values";
import { ApplicationError } from "../../lib/errors";
import { getActiveOrg } from "../userSettings/helpers";
import { getUserOrgs } from "./helpers";

export const getCurrentOrganization = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    const orgs = await getUserOrgs(ctx, userId);
    const activeOrgId = await getActiveOrg(ctx, userId);
    const org = orgs.find((o) => o._id === activeOrgId);
    if (!org) {
      throw new ApplicationError("org_not_found");
    }
    return org;
  },
});

export const getCurrentFeatureSet = query({
  handler: async (ctx) => {
    const { _id: userId } = await ctx.runQuery(
      internal.modules.users.queries.getUser,
    );
    const orgs = await getUserOrgs(ctx, userId);
    const activeOrgId = await getActiveOrg(ctx, userId);
    const org = orgs.find((o) => o._id === activeOrgId);
    if (!org) throw new ApplicationError("org_not_found");
    const {
      plan: { slug, maxNumberOfCondos },
    } = org;
    return {
      plan: slug,
      features: {
        maxNumberOfCondos,
      },
    };
  },
});
