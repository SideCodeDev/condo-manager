import { query } from "../../_generated/server";
import { ApplicationError } from "../../lib/errors";

export const listMine = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ApplicationError("unauthenticated");

    const memberships = await ctx.db
      .query("organizationMemberships")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerkUserId", identity.subject),
      )
      .collect();
    const organizationIds = [
      ...new Set(
        memberships
          .filter((membership) => !membership.deletedAt)
          .map((membership) => membership.clerkOrganizationId),
      ),
    ];

    const condosByOrganization = await Promise.all(
      organizationIds.map(async (clerkOrganizationId) => {
        const organization = await ctx.db
          .query("organizations")
          .withIndex("by_clerk_organization_id", (q) =>
            q.eq("clerkOrganizationId", clerkOrganizationId),
          )
          .unique();
        if (!organization || organization.deletedAt) return [];

        return ctx.db
          .query("condos")
          .withIndex("by_clerk_organization_and_archived_at", (q) =>
            q
              .eq("clerkOrganizationId", clerkOrganizationId)
              .eq("archivedAt", undefined),
          )
          .collect();
      }),
    );

    return condosByOrganization.flat();
  },
});
