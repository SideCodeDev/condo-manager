import { convexTest } from "convex-test";
import schema from "../schema";

const modules = import.meta.glob("../**/*.ts");
const identityId = "clerk-user";

export async function setupBackend(condoMemberType: "admin" | "member" = "admin") {
  const t = convexTest(schema, modules);
  const { userId, organizationId, condoId } = await t.run(async (ctx) => {
    const userId = await ctx.db.insert("users", {
      authProviderId: identityId,
      email: "member@example.com",
      updatedAt: Date.now(),
    });
    const organizationId = await ctx.db.insert("organizations", {
      clerkOrganizationId: "org-1",
      name: "Example Org",
      slug: "example-org",
      kind: "team",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    await ctx.db.insert("organizationMemberships", {
      clerkMembershipId: "membership-1",
      clerkOrganizationId: "org-1",
      clerkUserId: identityId,
      role: "org:admin",
      permissions: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    await ctx.db.insert("billingSubscriptionItems", {
      clerkSubscriptionItemId: "item-1",
      clerkOrganizationId: "org-1",
      status: "active",
      isFreeTrial: false,
      featureSlugs: ["max_condo_unlimited"],
      periodStart: Date.now(),
      updatedAt: Date.now(),
    });
    const condoId = await ctx.db.insert("condos", {
      organizationId,
      name: "Example Condo",
      address: { street: "Street 1", postalCode: "1000-001", city: "Lisbon" },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    await ctx.db.insert("condoMember", {
      condoId,
      userId,
      type: condoMemberType,
      active: true,
    });
    return { userId, organizationId, condoId };
  });
  return {
    t,
    asUser: t.withIdentity({ subject: identityId }),
    userId,
    organizationId,
    condoId,
  };
}

