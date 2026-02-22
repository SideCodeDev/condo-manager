import { Id } from "@be/dataModel";
import { QueryCtx } from "@be/server";
import { ApplicationError } from "../../lib/errors";

export async function getUserSettings(ctx: QueryCtx, userId: Id<"users">) {
  const settings = await ctx.db
    .query("userSettings")
    .withIndex("by_user_id", (q) => q.eq("userId", userId))
    .unique();
  if (!settings) {
    throw new ApplicationError("user_settings_not_found");
  }
  return settings;
}

export async function getActiveOrg(ctx: QueryCtx, userId: Id<"users">) {
  const settings = await getUserSettings(ctx, userId);
  return settings.activeOrg;
}
