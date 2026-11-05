import { makeFunctionReference, type FunctionReference } from "convex/server";
import type { Id } from "../_generated/dataModel";
import { expect, test } from "vitest";
import { setupBackend } from "./helpers";

type CreateOccurrenceArgs = {
  condoId: Id<"condos">;
  title: string;
  description: string;
  documentIds?: Id<"assets">[];
};
type UpdateOccurrenceArgs = {
  occurrenceId: Id<"occurrences">;
  title: string;
  description: string;
  documentIds: Id<"assets">[];
};
type Occurrence = {
  _id: Id<"occurrences">;
  _creationTime: number;
  condoId: Id<"condos">;
  title: string;
  description: string;
  documentIds: Id<"assets">[];
  createdByUserId: Id<"users">;
  createdAt: number;
  updatedAt: number;
};
const createOccurrence = makeFunctionReference(
  "modules/occurrences/mutations:create",
) as unknown as FunctionReference<
  "mutation",
  "public",
  CreateOccurrenceArgs,
  Id<"occurrences">
>;
const updateOccurrence = makeFunctionReference(
  "modules/occurrences/mutations:update",
) as unknown as FunctionReference<
  "mutation",
  "public",
  UpdateOccurrenceArgs,
  null
>;
const removeOccurrence = makeFunctionReference(
  "modules/occurrences/mutations:remove",
) as unknown as FunctionReference<
  "mutation",
  "public",
  { occurrenceId: Id<"occurrences"> },
  null
>;
const listOccurrences = makeFunctionReference(
  "modules/occurrences/queries:listByCondo",
) as unknown as FunctionReference<
  "query",
  "public",
  { condoId: Id<"condos"> },
  Occurrence[]
>;
const getOccurrence = makeFunctionReference(
  "modules/occurrences/queries:get",
) as unknown as FunctionReference<
  "query",
  "public",
  { occurrenceId: Id<"occurrences"> },
  Occurrence | null
>;

test("creates and lists an occurrence for an active condo member", async () => {
  const { asUser, condoId, userId } = await setupBackend("member");

  const occurrenceId = await asUser.mutation(createOccurrence, {
    condoId,
    title: "Water leak",
    description: "Leak in the garage ceiling",
  });
  const occurrences = await asUser.query(
    listOccurrences,
    { condoId },
  );

  expect(occurrences).toHaveLength(1);
  expect(occurrences[0]).toMatchObject({
    _id: occurrenceId,
    condoId,
    title: "Water leak",
    description: "Leak in the garage ceiling",
    documentIds: [],
    createdByUserId: userId,
  });
});

test("rejects creation when the user is not a condo member", async () => {
  const { t, condoId } = await setupBackend("member");
  const stranger = t.withIdentity({ subject: "clerk-user-2" });
  await t.run((ctx) =>
    ctx.db.insert("users", {
      authProviderId: "clerk-user-2",
      email: "stranger@example.com",
      updatedAt: Date.now(),
    }),
  );

  await expect(
    stranger.mutation(createOccurrence, {
      condoId,
      title: "Water leak",
      description: "Leak in the garage ceiling",
    }),
  ).rejects.toThrowError("unauthorized");
});

test("rejects empty title or description", async () => {
  const { asUser, condoId } = await setupBackend("member");

  await expect(
    asUser.mutation(createOccurrence, {
      condoId,
      title: "   ",
      description: "Description",
    }),
  ).rejects.toThrowError("invalid_occurrence");
  await expect(
    asUser.mutation(createOccurrence, {
      condoId,
      title: "Title",
      description: "   ",
    }),
  ).rejects.toThrowError("invalid_occurrence");
});

test("updates and removes an occurrence for an active condo member", async () => {
  const { asUser, condoId } = await setupBackend("member");
  const occurrenceId = await asUser.mutation(
    createOccurrence,
    { condoId, title: "Old title", description: "Old description" },
  );

  await asUser.mutation(updateOccurrence, {
    occurrenceId,
    title: "Updated title",
    description: "Updated description",
    documentIds: [],
  });
  expect(
    await asUser.query(getOccurrence, { occurrenceId }),
  ).toMatchObject({ title: "Updated title", description: "Updated description" });

  await asUser.mutation(removeOccurrence, { occurrenceId });
  expect(
    await asUser.query(getOccurrence, { occurrenceId }),
  ).toBeNull();
});
