import { expect, test } from "vitest";
import { api, internal } from "../_generated/api";
import { setupBackend } from "./helpers";

test("organization sync is idempotent and deletion marks the projection", async () => {
  const { t } = await setupBackend();
  const value = {
    clerkOrganizationId: "synced-org",
    name: "Synced Org",
    slug: "synced-org",
    kind: "team" as const,
    createdAt: 1,
    updatedAt: 2,
  };
  const firstId = await t.mutation(internal.authProvider.organizations.mutations.syncOrganization, value);
  const secondId = await t.mutation(internal.authProvider.organizations.mutations.syncOrganization, {
    ...value,
    name: "Renamed Org",
    updatedAt: 3,
  });
  expect(secondId).toBe(firstId);
  expect(await t.run((ctx) => ctx.db.get("organizations", firstId))).toMatchObject({ name: "Renamed Org" });

  await t.mutation(internal.authProvider.organizations.mutations.deleteOrganization, {
    clerkOrganizationId: "synced-org",
  });
  expect(await t.run((ctx) => ctx.db.get("organizations", firstId))).toMatchObject({ deletedAt: expect.any(Number) });
});

test("organization queries expose current membership and plan limits", async () => {
  const { asUser, organizationId } = await setupBackend();
  const organizations = await asUser.query(
    api.authProvider.organizations.queries.getUserOrgs,
    {},
  );
  expect(organizations).toMatchObject([
    {
      id: organizationId,
      clerkOrganizationId: "org-1",
      features: { maxCondo: "unlimited" },
    },
  ]);

  const withBilling = await asUser.query(
    api.authProvider.organizations.queries.listMineWithBilling,
    {},
  );
  expect(withBilling[0]?.billing).toMatchObject({
    state: "no_subscription",
    currentPlan: {
      status: "active",
      featureSlugs: ["max_condo_unlimited"],
    },
    upcomingPlan: null,
  });
});

test("personal organization provisioning tracks retries and completion", async () => {
  const { t } = await setupBackend();
  expect(
    await t.mutation(internal.authProvider.organizations.mutations.startProvisioning, {
      clerkUserId: "provisioned-user",
    }),
  ).toBe(1);
  expect(
    await t.mutation(internal.authProvider.organizations.mutations.startProvisioning, {
      clerkUserId: "provisioned-user",
    }),
  ).toBe(false);
  await t.mutation(internal.authProvider.organizations.mutations.failProvisioning, {
    clerkUserId: "provisioned-user",
    error: "temporary failure",
  });
  expect(
    await t.mutation(internal.authProvider.organizations.mutations.startProvisioning, {
      clerkUserId: "provisioned-user",
    }),
  ).toBe(2);

  await t.mutation(internal.authProvider.organizations.mutations.completeProvisioning, {
    clerkUserId: "provisioned-user",
    clerkOrganizationId: "personal-org",
    organization: {
      clerkOrganizationId: "personal-org",
      name: "Personal",
      slug: "personal",
      kind: "personal",
      createdAt: 1,
      updatedAt: 2,
    },
  });
  expect(
    await t.run((ctx) =>
      ctx.db.query("organizationProvisioning")
        .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", "provisioned-user"))
        .unique(),
    ),
  ).toMatchObject({ status: "complete", clerkOrganizationId: "personal-org", attempts: 2 });
});
