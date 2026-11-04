import { expect, test } from "vitest";
import { api, internal } from "../_generated/api";
import { setupBackend } from "./helpers";

test("asset upload URL requires an authenticated user", async () => {
  const { asUser, t } = await setupBackend();
  expect(await asUser.mutation(api.modules.assets.mutations.generateUploadUrl, {})).toContain("http");
  await expect(
    t.mutation(api.modules.assets.mutations.generateUploadUrl, {}),
  ).rejects.toThrowError("unauthenticated");
});

test("asset creation records uploaded file metadata and rejects mismatched types", async () => {
  const { t, userId } = await setupBackend();
  const storageId = await t.run((ctx) =>
    ctx.storage.store(new Blob(["sample pdf"], { type: "application/pdf" })),
  );
  const assetId = await t.mutation(
    internal.modules.assets.mutations.createAssetInternal,
    { storageId, type: "pdf", createdByUserId: userId },
  );
  const asset = await t.run((ctx) => ctx.db.get("assets", assetId));
  expect(asset).toMatchObject({
    type: "pdf",
    mimeType: "application/pdf",
    createdByUserId: userId,
    size: 10,
  });
  await expect(
    t.mutation(internal.modules.assets.mutations.createAssetInternal, {
      storageId,
      type: "image",
      createdByUserId: userId,
    }),
  ).rejects.toThrowError("asset_type_mismatch");
});
