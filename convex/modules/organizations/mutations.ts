import { Id } from "@be/dataModel";
import { MutationCtx } from "@be/server";

export async function createOrganizationForUser(
  ctx: MutationCtx,
  userId: Id<"users">,
  name: string,
) {
  const orgId = await ctx.db.insert("organization", { name });

  await ctx.db.insert("organizationMembership", {
    orgId,
    userId,
    role: "owner",
  });

  return orgId;
}
