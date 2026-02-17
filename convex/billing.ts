import { v } from "convex/values";
import { internalQuery, query } from "./_generated/server";

export const getPlans = query({
  handler: (ctx) =>
    ctx.db
      .query("plans")
      .filter((fb) => fb.neq(fb.field("slug"), "free"))
      .collect(),
});
export const getPlan = internalQuery({
  args: {
    id: v.id("plans"),
  },
  handler: (ctx, { id }) => ctx.db.get("plans", id),
});
