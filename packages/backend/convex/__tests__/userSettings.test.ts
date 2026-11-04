import { expect, test } from "vitest";
import { api, internal } from "../_generated/api";
import { setupBackend } from "./helpers";

test("condo members can select and clear their selected condo", async () => {
  const { asUser, condoId, userId } = await setupBackend();

  await asUser.mutation(api.modules.userSettings.mutations.selectCondo, {
    condoId,
  });
  expect(
    await asUser.query(api.modules.userSettings.mutations.getMine, {}),
  ).toMatchObject({ selectedCondoId: condoId });

  await asUser.mutation(api.modules.userSettings.mutations.clearSelectedCondo, {});
  expect(
    await asUser.query(api.modules.userSettings.mutations.getMine, {}),
  ).toEqual({ selectedCondoId: undefined });

  const settings = await asUser.run((ctx) =>
    ctx.db.query("userSettings").withIndex("by_user_id", (q) => q.eq("userId", userId)).unique(),
  );
  expect(settings?.selectedCondoExpiresAt).toBeTypeOf("number");
});

test("condo selection rejects a user without an active membership", async () => {
  const { t, condoId } = await setupBackend();
  await t.run(async (ctx) => {
    const userId = await ctx.db.insert("users", {
      authProviderId: "stranger",
      email: "stranger@example.com",
      updatedAt: Date.now(),
    });
    await ctx.db.insert("userSettings", { userId });
  });
  await expect(
    t.withIdentity({ subject: "stranger" }).mutation(
      api.modules.userSettings.mutations.selectCondo,
      { condoId },
    ),
  ).rejects.toThrowError("unauthorized");
});
