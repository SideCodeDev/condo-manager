import { v } from "convex/values";
import type { Id } from "../../_generated/dataModel";
import {
  internalMutation,
  internalQuery,
  mutation,
  type MutationCtx,
} from "../../_generated/server";
import { ApplicationError } from "../../lib/errors";
import { getCurrentUser } from "../../authProvider/users/currentUser";
import { log } from "../../lib/logging";

type MembershipInput = {
  condoId: Id<"condos">;
  userId: Id<"users">;
  type: "member" | "admin";
  active?: boolean;
};

export async function createCondoMembership(
  ctx: MutationCtx,
  args: MembershipInput,
) {
  const existingMembership = await ctx.db
    .query("condoMember")
    .withIndex("by_condo_and_user", (q) =>
      q.eq("condoId", args.condoId).eq("userId", args.userId),
    )
    .unique();
  if (existingMembership) {
    throw new ApplicationError("condo_membership_exists");
  }

  const membershipId = await ctx.db.insert("condoMember", {
    ...args,
    active: args.active ?? true,
  });
  log.info("condo.membership.created", {
    membershipId,
    condoId: args.condoId,
    userId: args.userId,
    type: args.type,
  });
  return membershipId;
}

export const create = mutation({
  args: {
    condoId: v.id("condos"),
    userId: v.id("users"),
    type: v.union(v.literal("member"), v.literal("admin")),
  },
  returns: v.id("condoMember"),
  handler: async (ctx, args) => {
    const { user } = await getCurrentUser(ctx);
    const condo = await ctx.db.get("condos", args.condoId);
    if (!condo) throw new ApplicationError("condo_not_found");

    const adminMembership = await ctx.db
      .query("condoMember")
      .withIndex("by_condo_and_user", (q) =>
        q.eq("condoId", args.condoId).eq("userId", user._id),
      )
      .unique();
    if (
      !adminMembership ||
      adminMembership.type !== "admin" ||
      adminMembership.active === false
    ) {
      throw new ApplicationError("unauthorized");
    }

    const targetMembership = await ctx.db
      .query("condoMember")
      .withIndex("by_condo_and_user", (q) =>
        q.eq("condoId", args.condoId).eq("userId", args.userId),
      )
      .unique();
    if (targetMembership) {
      throw new ApplicationError("condo_membership_exists");
    }

    const membershipId = await ctx.db.insert("condoMember", {
      condoId: args.condoId,
      userId: args.userId,
      type: args.type,
      active: true,
    });
    log.info("condo.membership.created", {
      membershipId,
      condoId: args.condoId,
      userId: args.userId,
      type: args.type,
    });
    return membershipId;
  },
});

export const createPendingInvitations = internalMutation({
  args: {
    condoId: v.id("condos"),
    adminUnitId: v.optional(v.id("units")),
    members: v.array(v.object({ email: v.string(), unitId: v.id("units") })),
  },
  returns: v.array(
    v.object({
      membershipId: v.id("condoMember"),
      email: v.string(),
      invitationStatus: v.union(
        v.literal("pending"),
        v.literal("sent"),
        v.literal("failed"),
      ),
      active: v.boolean(),
    }),
  ),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ApplicationError("unauthenticated");
    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_provider_id", (q) =>
        q.eq("authProviderId", identity.subject),
      )
      .unique();
    if (!user) throw new ApplicationError("unknown_error");

    const condo = await ctx.db.get("condos", args.condoId);
    const adminMembership = await ctx.db
      .query("condoMember")
      .withIndex("by_condo_and_user", (q) =>
        q.eq("condoId", args.condoId).eq("userId", user._id),
      )
      .unique();
    if (!condo) throw new ApplicationError("condo_not_found");
    if (
      !adminMembership ||
      adminMembership.type !== "admin" ||
      adminMembership.active === false
    ) {
      throw new ApplicationError("unauthorized");
    }

    const unitIds = new Set([
      ...(args.adminUnitId ? [args.adminUnitId] : []),
      ...args.members.map((member) => member.unitId),
    ]);
    const units = await Promise.all(
      [...unitIds].map((unitId) => ctx.db.get("units", unitId)),
    );
    if (units.some((unit) => !unit || unit.condoId !== args.condoId)) {
      throw new ApplicationError("invalid_unit");
    }

    await ctx.db.patch("condoMember", adminMembership._id, {
      unitId: args.adminUnitId,
      active: true,
    });

    const normalizedEmails = args.members.map((member) =>
      member.email.trim().toLowerCase(),
    );
    if (new Set(normalizedEmails).size !== normalizedEmails.length) {
      throw new ApplicationError("duplicate_condo_member_email");
    }

    const results = [];
    for (const [index, member] of args.members.entries()) {
      const email = normalizedEmails[index];
      if (!email || !email.includes("@")) {
        throw new ApplicationError("invalid_condo_member_email");
      }
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();
      const existingUserMembership = existingUser
        ? await ctx.db
            .query("condoMember")
            .withIndex("by_condo_and_user", (q) =>
              q.eq("condoId", args.condoId).eq("userId", existingUser._id),
            )
            .unique()
        : null;
      if (existingUserMembership) {
        await ctx.db.patch("condoMember", existingUserMembership._id, {
          unitId: member.unitId,
          active: true,
        });
        results.push({
          membershipId: existingUserMembership._id,
          email,
          invitationStatus: "sent" as const,
          active: true,
        });
        continue;
      }
      const existing = await ctx.db
        .query("condoMember")
        .withIndex("by_condo_and_email", (q) =>
          q.eq("condoId", args.condoId).eq("email", email),
        )
        .unique();
      if (existing) {
        await ctx.db.patch("condoMember", existing._id, {
          unitId: member.unitId,
          ...(existing.userId ? { active: true } : {}),
        });
        results.push({
          membershipId: existing._id,
          email,
          invitationStatus: existing.invitationStatus ?? "pending",
          active: existing.userId ? true : (existing.active ?? false),
        });
        continue;
      }
      const membershipId = await ctx.db.insert("condoMember", {
        condoId: args.condoId,
        email,
        unitId: member.unitId,
        type: "member",
        active: false,
        invitationStatus: "pending",
      });
      results.push({
        membershipId,
        email,
        invitationStatus: "pending" as const,
        active: false,
      });
    }
    return results;
  },
});

export const setInvitationResult = internalMutation({
  args: {
    membershipId: v.id("condoMember"),
    status: v.union(v.literal("sent"), v.literal("failed")),
    invitationId: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const membership = await ctx.db.get("condoMember", args.membershipId);
    if (!membership || membership.userId) return null;
    await ctx.db.patch("condoMember", membership._id, {
      invitationStatus: args.status,
      invitationId: args.invitationId,
    });
    return null;
  },
});

export const getInvitationAcceptanceContext = internalQuery({
  args: {},
  returns: v.union(
    v.object({
      userId: v.id("users"),
      email: v.string(),
      invitationIds: v.array(v.string()),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_provider_id", (q) =>
        q.eq("authProviderId", identity.subject),
      )
      .unique();
    if (!user) throw new ApplicationError("unknown_error");
    const memberships = await ctx.db
      .query("condoMember")
      .withIndex("by_email", (q) =>
        q.eq("email", user.email.trim().toLowerCase()),
      )
      .collect();
    return {
      userId: user._id,
      email: user.email,
      invitationIds: memberships.flatMap((membership) =>
        !membership.userId && membership.invitationId
          ? [membership.invitationId]
          : [],
      ),
    };
  },
});

export const activateAcceptedInvitation = internalMutation({
  args: {
    email: v.string(),
    invitationIds: v.array(v.string()),
    userId: v.id("users"),
  },
  returns: v.union(v.id("condos"), v.null()),
  handler: async (ctx, { email, invitationIds, userId }) => {
    const memberships = await ctx.db
      .query("condoMember")
      .withIndex("by_email", (q) => q.eq("email", email.trim().toLowerCase()))
      .collect();
    const ownMemberships = memberships.filter(
      (membership) =>
        (!membership.userId || membership.userId === userId) &&
        membership.invitationId !== undefined &&
        invitationIds.includes(membership.invitationId),
    );
    await Promise.all(
      ownMemberships
        .filter((membership) => !membership.userId)
        .map((membership) =>
          ctx.db.patch("condoMember", membership._id, {
            userId,
            active: true,
            invitationStatus: undefined,
          }),
        ),
    );
    return ownMemberships[0]?.condoId ?? null;
  },
});
