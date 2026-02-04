import { Infer } from "convex/values";
import { query, QueryCtx } from "./_generated/server";
import { Plan, planSchema } from "./schema";

export const getActiveSubscription = query({
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return getPlanFromDb(ctx, "free");
    }
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

async function getCurrentUser(ctx: QueryCtx) {
  const userIdentity = await ctx.auth.getUserIdentity();
  if (!userIdentity) return null;
  const id = userIdentity["id"] as string;
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", id))
    .unique();
  return user;
}

async function getPlanFromDb(
  ctx: QueryCtx,
  value: Infer<typeof planSchema>,
): Promise<Plan> {
  const plan = await ctx.db
    .query("plans")
    .withIndex("by_slug", (q) => q.eq("slug", value))
    .unique();

  if (!plan) {
    return {
      slug: "free" as Infer<typeof planSchema>,
      maxNumberOfCondos: 0 as number | "unlimited",
    };
  }
  return {
    slug: plan.slug,
    maxNumberOfCondos: plan.maxNumberOfCondos,
  };
}
