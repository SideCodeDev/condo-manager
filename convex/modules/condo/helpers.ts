import { internal } from "@be/api";
import { Id } from "@be/dataModel";
import { QueryCtx } from "@be/server";
import { ApplicationError } from "../../lib/errors";

export async function ensureUserCanCreateCondo(
  ctx: QueryCtx,
  userId: Id<"users">,
) {
  const org = await ctx.runQuery(
    internal.modules.organizations.queries.getCurrentOrganization,
    { userId },
  );
  if (!org) throw new ApplicationError("org_not_found");
  const {
    role,
    plan: { maxNumberOfCondos },
  } = org;

  if (role === "member") throw new ApplicationError("cannot_create_condo");
  if (maxNumberOfCondos === "unlimited") return;

  const condosOfOrg = await getCondosOfOrg(ctx, org._id);
  if (condosOfOrg.length >= maxNumberOfCondos) {
    throw new ApplicationError("max_condos_reached");
  }
}

export function getCondosOfOrg(ctx: QueryCtx, orgId: Id<"organization">) {
  return ctx.db
    .query("condo")
    .withIndex("by_org_id", (q) => q.eq("orgId", orgId))
    .collect();
}
