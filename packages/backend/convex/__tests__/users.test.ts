import { expect, test } from "vitest";
import { api, internal } from "../_generated/api";
import { setupBackend } from "./helpers";

test("user upsert normalizes email and is idempotent", async () => {
  const { t } = await setupBackend();
  const input = {
    authProviderId: "upsert-user",
    email: "  PERSON@Example.com ",
    raw: "{}",
  };
  const firstId = await t.mutation(internal.authProvider.users.mutations.upsertUser, input);
  const secondId = await t.mutation(internal.authProvider.users.mutations.upsertUser, {
    ...input,
    firstName: "Person",
  });
  expect(secondId).toBe(firstId);
  expect(await t.run((ctx) => ctx.db.get("users", firstId))).toMatchObject({
    email: "person@example.com",
    firstName: "Person",
  });
  expect(
    await t.run((ctx) => ctx.db.query("userSettings").withIndex("by_user_id", (q) => q.eq("userId", firstId)).unique()),
  ).toMatchObject({ userId: firstId });
});
