import { components } from "@be/api";
import { Id } from "@be/dataModel";
import { QueryCtx } from "@be/server";
import { ApplicationError } from "../../lib/errors";

export async function getUserOrgs(ctx: QueryCtx, userId: Id<"users">) {
  const orgMembership =
    (await ctx.db
      .query("organizationMembership")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect()) ?? [];

  if (orgMembership.length === 0)
    throw new ApplicationError("user_has_no_orgs");

  const orgs = [];

  for (const membership of orgMembership) {
    const org = await ctx.db.get("organization", membership.orgId);
    if (org) {
      let plan = (await ctx.db
        .query("plans")
        .withIndex("by_slug", (q) => q.eq("slug", "free"))
        .unique())!;
      const subscription = await ctx
        .runQuery(components.stripe.public.getSubscriptionByOrgId, {
          orgId: org._id,
        })
        .then((sub) => (sub?.status === "active" ? sub : null));
      if (subscription) {
        const priceId = subscription.priceId;
        plan =
          (await ctx.db
            .query("plans")
            .withIndex("by_price_id", (q) => q.eq("priceId", priceId))
            .unique()) ?? plan;
      }
      const enhancedOrg = { ...org, role: membership.role, plan };
      orgs.push(enhancedOrg);
    }
  }
  return orgs;
}
