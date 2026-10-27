"use node";

import { createClerkClient } from "@clerk/backend";
import { action } from "../../_generated/server";
import type { FunctionReference } from "convex/server";
import { makeFunctionReference } from "convex/server";
import type { Id } from "../../_generated/dataModel";
import { v } from "convex/values";
import { log } from "../../lib/logging";
import { ApplicationError } from "../../lib/errors";

type PendingMember = {
  membershipId: Id<"condoMember">;
  email: string;
  invitationStatus: "pending" | "sent" | "failed";
  active: boolean;
};
type PrepareArgs = {
  condoId: Id<"condos">;
  adminUnitId?: Id<"units">;
  members: Array<{ email: string; unitId: Id<"units"> }>;
};
type SetInvitationArgs = {
  membershipId: Id<"condoMember">;
  status: "sent" | "failed";
  invitationId?: string;
};
type AcceptanceContext = {
  userId: Id<"users">;
  email: string;
  invitationIds: string[];
};

const prepareInvitations = makeFunctionReference<
  "mutation",
  PrepareArgs,
  PendingMember[]
>(
  "modules/condoMember/mutations:createPendingInvitations",
) as unknown as FunctionReference<
  "mutation",
  "internal",
  PrepareArgs,
  PendingMember[]
>;
const setInvitationResult = makeFunctionReference<
  "mutation",
  SetInvitationArgs,
  null
>(
  "modules/condoMember/mutations:setInvitationResult",
) as unknown as FunctionReference<
  "mutation",
  "internal",
  SetInvitationArgs,
  null
>;
const getInvitationAcceptanceContext = makeFunctionReference<
  "query",
  Record<string, never>,
  AcceptanceContext | null
>(
  "modules/condoMember/mutations:getInvitationAcceptanceContext",
) as unknown as FunctionReference<
  "query",
  "internal",
  Record<string, never>,
  AcceptanceContext | null
>;
const activateAcceptedInvitation = makeFunctionReference<
  "mutation",
  AcceptanceContext,
  Id<"condos"> | null
>(
  "modules/condoMember/mutations:activateAcceptedInvitation",
) as unknown as FunctionReference<
  "mutation",
  "internal",
  AcceptanceContext,
  Id<"condos"> | null
>;

export const sendInvitations = action({
  args: {
    condoId: v.id("condos"),
    adminUnitId: v.optional(v.id("units")),
    members: v.array(v.object({ email: v.string(), unitId: v.id("units") })),
  },
  returns: v.array(
    v.object({
      email: v.string(),
      status: v.union(
        v.literal("sent"),
        v.literal("already_active"),
        v.literal("failed"),
      ),
      message: v.optional(v.string()),
    }),
  ),
  handler: async (ctx, args) => {
    const pending = await ctx.runMutation(prepareInvitations, args);
    const membersToInvite = pending.filter((member) => !member.active);
    if (membersToInvite.length === 0) {
      return pending.map((member) => ({
        email: member.email,
        status: "already_active" as const,
      }));
    }
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) throw new Error("Missing CLERK_SECRET_KEY");
    const clerk = createClerkClient({ secretKey });
    const results: Array<{
      email: string;
      status: "sent" | "already_active" | "failed";
      message?: string;
    }> = pending
      .filter((member) => member.active)
      .map((member) => ({
        email: member.email,
        status: "already_active" as const,
      }));

    for (const member of membersToInvite) {
      try {
        const existingInvitations = await clerk.invitations.getInvitationList({
          query: member.email,
        });
        const existingPending = existingInvitations.data.find(
          (invitation) =>
            invitation.emailAddress.toLowerCase() === member.email &&
            invitation.status === "pending" &&
            invitation.publicMetadata?.condoManagerCondoMemberId ===
              member.membershipId,
        );
        const invitation =
          existingPending ??
          (await clerk.invitations.createInvitation({
            emailAddress: member.email,
            ignoreExisting: true,
            redirectUrl: "/?acceptCondoInvite=true",
            publicMetadata: {
              condoManagerCondoMemberId: member.membershipId,
            },
          }));
        await ctx.runMutation(setInvitationResult, {
          membershipId: member.membershipId,
          status: "sent",
          invitationId: invitation.id,
        });
        results.push({ email: member.email, status: "sent" as const });
      } catch (error) {
        await ctx.runMutation(setInvitationResult, {
          membershipId: member.membershipId,
          status: "failed",
        });
        log.warn("condo.membership.invitation_failed", {
          membershipId: member.membershipId,
          condoId: args.condoId,
          errorName: log.errorName(error),
        });
        results.push({
          email: member.email,
          status: "failed" as const,
          message: "Não foi possível enviar o convite.",
        });
      }
    }
    return results;
  },
});

export const acceptPendingInvitation = action({
  args: {},
  returns: v.union(v.id("condos"), v.null()),
  handler: async (ctx) => {
    const acceptance = await ctx.runQuery(getInvitationAcceptanceContext, {});
    if (!acceptance || acceptance.invitationIds.length === 0) return null;
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) throw new Error("Missing CLERK_SECRET_KEY");
    const clerk = createClerkClient({ secretKey });
    const acceptedInvitations = await clerk.invitations.getInvitationList({
      query: acceptance.email,
      status: "accepted",
    });
    const acceptedIds = new Set(
      acceptedInvitations.data
        .filter(
          (invitation) =>
            invitation.emailAddress.toLowerCase() ===
            acceptance.email.toLowerCase(),
        )
        .map((invitation) => invitation.id),
    );
    const invitationIds = acceptance.invitationIds.filter((id) =>
      acceptedIds.has(id),
    );
    if (invitationIds.length === 0) {
      throw new ApplicationError("condo_invitation_not_accepted");
    }
    return await ctx.runMutation(activateAcceptedInvitation, {
      ...acceptance,
      invitationIds,
    });
  },
});
