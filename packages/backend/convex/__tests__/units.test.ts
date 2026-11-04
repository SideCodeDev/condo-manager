import { expect, test } from "vitest";
import { api, internal } from "../_generated/api";
import { setupBackend } from "./helpers";

test("condo admin creates units and invalid unit details are rejected", async () => {
  const { asUser, condoId } = await setupBackend();

  const unitId = await asUser.mutation(api.modules.units.mutations.create, {
    condoId,
    floor: "  1  ",
    side: " A ",
    permillage: 100,
    usageType: "residential",
  });
  const unit = await asUser.run((ctx) => ctx.db.get("units", unitId));
  expect(unit).toMatchObject({ floor: "1", side: "A", condoId });

  await expect(
    asUser.mutation(api.modules.units.mutations.create, {
      condoId,
      floor: " ",
      side: "A",
      permillage: 100,
      usageType: "residential",
    }),
  ).rejects.toThrowError("invalid_unit");
});

test("unit creation rejects non-admin condo members", async () => {
  const { t, condoId } = await setupBackend();
  await t.run(async (ctx) => {
    const userId = await ctx.db.insert("users", {
      authProviderId: "resident",
      email: "resident@example.com",
      updatedAt: Date.now(),
    });
    await ctx.db.insert("condoMember", {
      condoId,
      userId,
      type: "member",
      active: true,
    });
  });
  await expect(
    t.withIdentity({ subject: "resident" }).mutation(
      api.modules.units.mutations.create,
      {
        condoId,
        floor: "1",
        side: "A",
        permillage: 100,
        usageType: "residential",
      },
    ),
  ).rejects.toThrowError("unauthorized");
});

test("createMany persists valid units for an admin", async () => {
  const { asUser, condoId } = await setupBackend();
  const unitIds = await asUser.mutation(api.modules.units.mutations.createMany, {
    condoId,
    units: [
      { floor: "0", side: "A", permillage: 200, usageType: "residential" },
      { floor: "1", side: "B", permillage: 300, usageType: "commercial" },
    ],
  });
  const units = await asUser.run((ctx) =>
    Promise.all(unitIds.map((unitId) => ctx.db.get("units", unitId))),
  );
  expect(units).toMatchObject([
    { floor: "0", usageType: "residential", condoId },
    { floor: "1", usageType: "commercial", condoId },
  ]);
});
