import { internalQuery } from "@be/server";
import { ApplicationError } from "../../lib/errors";

export const getUser = internalQuery({
  handler: async (ctx) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) throw new ApplicationError("unauthenticated");
    const id = userIdentity.subject;
    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_provider_id", (q) => q.eq("authProviderId", id))
      .unique();
    if (!user) throw new ApplicationError("unknown_error");
    return user;
  },
});
