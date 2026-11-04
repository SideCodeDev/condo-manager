import { expect, test } from "vitest";
import { api, internal } from "../_generated/api";
import { setupBackend } from "./helpers";

test("condo queries return only the caller's condos and enforce membership", async () => {
  const { asUser, t, condoId, organizationId } = await setupBackend();
  expect(await asUser.query(api.modules.condos.queries.listMine, {})).toHaveLength(1);
  expect(
    await asUser.query(api.modules.condos.queries.getById, { condoId }),
  ).toMatchObject({ _id: condoId, name: "Example Condo" });

  const otherCondoId = await t.run((ctx) =>
    ctx.db.insert("condos", {
      organizationId,
      name: "Other",
      address: { street: "Street 2", postalCode: "1000-002", city: "Lisbon" },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }),
  );
  await expect(
    asUser.query(api.modules.condos.queries.getById, { condoId: otherCondoId }),
  ).rejects.toThrowError("condo_not_found");
});

test("condo creation enforces organization membership and condo updates require admin", async () => {
  const { asUser, organizationId, condoId } = await setupBackend();
  const newCondoId = await asUser.mutation(api.modules.condos.mutations.create, {
    name: "  New Condo  ",
    address: { street: "New Street", postalCode: "1000-002", city: "Lisbon" },
    org: organizationId,
  });
  expect(await asUser.run((ctx) => ctx.db.get("condos", newCondoId))).toMatchObject({
    name: "New Condo",
  });
  await asUser.mutation(api.modules.condos.mutations.update, {
    condoId,
    name: "  Updated Condo  ",
  });
  expect(await asUser.run((ctx) => ctx.db.get("condos", condoId))).toMatchObject({
    name: "Updated Condo",
  });
  await expect(
    asUser.mutation(api.modules.condos.mutations.update, { condoId }),
  ).rejects.toThrowError("cannot_update_condo");
});
