import type { QueryCtx } from "../../_generated/server";
import { ApplicationError } from "../../lib/errors";

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ApplicationError("unauthenticated");

  const user = await ctx.db
    .query("users")
    .withIndex("by_auth_provider_id", (q) =>
      q.eq("authProviderId", identity.subject),
    )
    .unique();
  if (!user) throw new ApplicationError("unknown_error");

  return { identity, user };
}
