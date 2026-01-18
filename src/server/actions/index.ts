"use server";

import { ApplicationError } from "@/utils/error";
import { auth } from "@clerk/nextjs/server";
import { getActiveSubscription } from "../auth/queries";
import { mutations, queries } from "../db";

export async function createCondo(name: string, address: string) {
  const { isAuthenticated, orgId, userId } = await auth();
  if (!isAuthenticated) throw new ApplicationError("unauthenticated");

  if (!orgId) throw new ApplicationError("unauthorized");

  const orgDetails = await getActiveSubscription();
  if (!orgDetails) throw new ApplicationError("unauthorized");

  const { maxNumberOfCondos } = orgDetails.features;
  if (maxNumberOfCondos === 0) throw new ApplicationError("unauthorized");

  const condosOfOrg = await queries.getOrgCondosCount(orgId);
  if (maxNumberOfCondos !== "unlimited" && condosOfOrg >= maxNumberOfCondos) {
    throw new ApplicationError("max_condos_reached");
  }
  const condo = await mutations.createCondo(orgId, name, address);
  await mutations.createCondoMember(condo.id, userId!, "admin");
  return condo;
}
