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
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userOrgs = await ctx.runQuery(getUserOrgs, {});

    const condo = await ctx.db.get("condos", args.condoId);
    if (!condo) throw new ApplicationError("condo_not_found");

    const condoOrg = userOrgs.find((org) => org.id === condo.organizationId);
    if (!condoOrg) throw new ApplicationError("unauthorized");

    if (!args.name && !args.address)
      throw new ApplicationError("cannot_update_condo");

    await ctx.db.patch("condos", args.condoId, {
      ...(args.name ? { name: args.name.trim() } : {}),
      ...(args.address ? { address: args.address } : {}),
      updatedAt: Date.now(),
    });
    return null;
  },
});
