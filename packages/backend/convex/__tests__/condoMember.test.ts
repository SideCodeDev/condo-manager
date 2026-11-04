import { expect, test } from "vitest";
import { api, internal } from "../_generated/api";
import { setupBackend } from "./helpers";

test("admin creates condo members and membership queries omit inactive entries", async () => {
  const { asUser, t, condoId } = await setupBackend();
  const targetUserId = await t.run((ctx) =>
    ctx.db.insert("users", {
      authProviderId: "target",
      email: "target@example.com",
      updatedAt: Date.now(),
    }),
  );
  await asUser.mutation(api.modules.condoMember.mutations.create, {
    condoId,
    userId: targetUserId,
    type: "member",
  });
  const inactiveMember = await t.run((ctx) =>
    ctx.db.insert("condoMember", {
      condoId,
      userId: targetUserId,
      type: "member",
      active: false,
    }),
  );

  const myMemberships = await asUser.query(
    api.modules.condoMember.queries.getAllMemberships,
    {},
  );
  expect(myMemberships).toHaveLength(1);
  expect(myMemberships[0]?.type).toBe("admin");
  expect(myMemberships.some((membership) => membership._id === inactiveMember)).toBe(false);
});

test("non-admin cannot create a condo membership", async () => {
  const { t, condoId } = await setupBackend();
  await t.run(async (ctx) => {
    const userId = await ctx.db.insert("users", {
      authProviderId: "resident",
      email: "resident@example.com",
      updatedAt: Date.now(),
    });
    await ctx.db.insert("condoMember", { condoId, userId, type: "member", active: true });
  });
  const targetUserId = await t.run((ctx) =>
    ctx.db.insert("users", {
      authProviderId: "target",
      email: "target@example.com",
      updatedAt: Date.now(),
    }),
  );
  await expect(
    t.withIdentity({ subject: "resident" }).mutation(
      api.modules.condoMember.mutations.create,
      { condoId, userId: targetUserId, type: "member" },
    ),
  ).rejects.toThrowError("unauthorized");
});

test("pending invitations require admin access and validate unit ownership", async () => {
  const { asUser, condoId, t } = await setupBackend();
  const unitId = await t.run((ctx) =>
    ctx.db.insert("units", {
      condoId,
      floor: "0",
      side: "A",
      permillage: 100,
      usageType: "residential",
    }),
  );
  const invitations = await asUser.mutation(
    internal.modules.condoMember.mutations.createPendingInvitations,
    { condoId, members: [{ email: " New@Example.com ", unitId }] },
  );
  expect(invitations).toMatchObject([
    { email: "new@example.com", invitationStatus: "pending", active: false },
  ]);
  await expect(
    asUser.mutation(internal.modules.condoMember.mutations.createPendingInvitations, {
      condoId,
      members: [
        { email: "one@example.com", unitId },
        { email: "ONE@example.com", unitId },
      ],
    }),
  ).rejects.toThrowError("duplicate_condo_member_email");
});

test("invitation actions return safely when there is no pending invitation work", async () => {
  const { asUser, condoId } = await setupBackend("admin");
  expect(
    await asUser.action(api.modules.condoMember.actions.sendInvitations, {
      condoId,
      members: [],
    }),
  ).toEqual([]);
  expect(
    await asUser.action(api.modules.condoMember.actions.acceptPendingInvitation, {}),
  ).toBeNull();
});
