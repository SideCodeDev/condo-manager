import { query, QueryCtx } from "./_generated/server";
import { getCurrentUser } from "./auth";
import { Plan, PlanSlug } from "./schema";

export const getActiveSubscription = query({
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    const org = await ctx.db
      .query("organization")
      .withIndex("by_org_id", (q) => q.eq("orgId", user.orgs[0]))
      .unique();
    if (!org || org.status !== "active") {
      return getPlanFromDb(ctx, "free");
    }

    return getPlanFromDb(ctx, org.plan);
  },
});

async function getPlanFromDb(ctx: QueryCtx, value: PlanSlug): Promise<Plan> {
  const plan = await ctx.db
    .query("plans")
    .withIndex("by_slug", (q) => q.eq("slug", value))
    .unique();

  if (!plan) {
    return {
      slug: "free" as PlanSlug,
      maxNumberOfCondos: 0 as number | "unlimited",
    };
  }
  return {
    slug: plan.slug,
    maxNumberOfCondos: plan.maxNumberOfCondos,
  };
}
