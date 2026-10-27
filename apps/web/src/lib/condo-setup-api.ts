import { makeFunctionReference } from "convex/server";
import type { GenericId } from "convex/values";

export type CondoUnitInput = {
  floor: string;
  side: string;
  permillage: number;
  usageType: "residential" | "commercial";
};

export const createManyUnits = makeFunctionReference<
  "mutation",
  { condoId: GenericId<"condos">; units: CondoUnitInput[] },
  GenericId<"units">[]
>("modules/units/mutations:createMany");

export type CondoInvitationInput = {
  email: string;
  unitId: GenericId<"units">;
};

export const sendCondoInvitations = makeFunctionReference<
  "action",
  {
    condoId: GenericId<"condos">;
    adminUnitId?: GenericId<"units">;
    members: CondoInvitationInput[];
  },
  Array<{
    email: string;
    status: "sent" | "already_active" | "failed";
    message?: string;
  }>
>("modules/condoMember/actions:sendInvitations");

export const acceptCondoInvitation = makeFunctionReference<
  "action",
  Record<string, never>,
  GenericId<"condos"> | null
>("modules/condoMember/actions:acceptPendingInvitation");
