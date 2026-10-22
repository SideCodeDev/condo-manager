import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import { ApplicationError } from "../../lib/errors";
import { getUserOrgs } from "../../lib/functionReferences";
import { createCondoMembership } from "../condoMember/mutations";
import { getCurrentUser } from "../../authProvider/users/currentUser";

const condoAddress = v.object({
  street: v.string(),
  postalCode: v.string(),
  city: v.string(),
});

export const create = mutation({
  args: {
    name: v.string(),
    address: condoAddress,
    org: v.id("organizations"),
    backdropImage: v.optional(v.id("assets")),
  },
  returns: v.id("condos"),
  handler: async (ctx, args) => {
    const { user } = await getCurrentUser(ctx);
    const userOrgs = await ctx.runQuery(getUserOrgs, {});
    const selectedOrg = userOrgs.find(
      (organization) => organization.id === args.org,
    );
    if (!selectedOrg) throw new ApplicationError("unauthorized");
    const now = Date.now();
    const limit = selectedOrg.features.maxCondo;
    if (limit !== "unlimited") {
      if (limit === 0) throw new ApplicationError("max_condos_reached");

      const activeCondos = await ctx.db
        .query("condos")
        .withIndex("by_organization_id", (q) =>
          q.eq("organizationId", selectedOrg.id),
        )
        .take(limit);
      if (activeCondos.length >= limit) {
        throw new ApplicationError("max_condos_reached");
      }
    }

    if (!args.name.trim()) {
      throw new ApplicationError("cannot_create_condo");
    }

    const condoId = await ctx.db.insert("condos", {
      name: args.name.trim(),
      address: args.address,
      organizationId: selectedOrg.id,
      ...(args.backdropImage ? { backdropImage: args.backdropImage } : {}),
      createdAt: now,
      updatedAt: now,
    });
    await createCondoMembership(ctx, {
      condoId,
      userId: user._id,
      type: "admin",
    });
    return condoId;
  },
});

export const update = mutation({
  args: {
    condoId: v.id("condos"),
    name: v.optional(v.string()),
    address: v.optional(condoAddress),
    backdropImage: v.optional(v.union(v.id("assets"), v.null())),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { user } = await getCurrentUser(ctx);
    const condo = await ctx.db.get("condos", args.condoId);
    if (!condo) throw new ApplicationError("condo_not_found");

    const condoMembership = await ctx.db
      .query("condoMember")
      .withIndex("by_condo_and_user", (e) =>
        e.eq("condoId", args.condoId).eq("userId", user._id),
      )
      .first();

    if (!condoMembership || condoMembership.type !== "admin")
      throw new ApplicationError("unauthorized");
    if (!args.name && !args.address && args.backdropImage === undefined)
      throw new ApplicationError("cannot_update_condo");

    await ctx.db.patch("condos", args.condoId, {
      ...(args.name ? { name: args.name.trim() } : {}),
      ...(args.address ? { address: args.address } : {}),
      ...(args.backdropImage !== undefined
        ? { backdropImage: args.backdropImage ?? undefined }
        : {}),
      updatedAt: Date.now(),
    });
    return null;
  },
});
