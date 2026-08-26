import { query } from "../../_generated/server";
import { ApplicationError } from "../../lib/errors";

export const getCurrent = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ApplicationError("unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_provider_id", (q) =>
        q.eq("authProviderId", identity.subject),
      )
      .unique();
    if (!user) throw new ApplicationError("unknown_error");

    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .unique();
    if (!settings) throw new ApplicationError("user_settings_not_found");

    return settings;
  },
});
