"use server";

import { ApplicationError } from "@/utils/error";
import { auth } from "@clerk/nextjs/server";
import { getActiveSubscription } from "../auth/queries";
import { mutations, queries } from "../db";
import { db } from "../db/db";

export async function createCondo(name: string, address: string) {
  const { isAuthenticated, orgId, userId } = await auth();
  if (!isAuthenticated) throw new ApplicationError("unauthenticated");
  if (!orgId) throw new ApplicationError("unauthorized");
  const orgDetails = await getActiveSubscription();
  if (!orgDetails) throw new ApplicationError("unauthorized");
  const { maxNumberOfCondos } = orgDetails.features;
  if (maxNumberOfCondos === 0) throw new ApplicationError("unauthorized");

  const condosOfOrg = await queries.getOrgCondos(orgId);
  if (
    maxNumberOfCondos !== "unlimited" &&
    condosOfOrg.length >= maxNumberOfCondos
  ) {
    throw new ApplicationError("max_condos_reached");
  }
  return db.transaction(async (tx) => {
    const condo = await mutations.createCondo(orgId, name, address, tx);
    await mutations.createCondoMember(condo.id, userId!, "admin", tx);
    return condo;
  });
}
