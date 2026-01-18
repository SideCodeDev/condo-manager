import { db } from "./db";
import { CondoMemberRole } from "./generated/enums";

export async function createCondo(
  orgId: string,
  name: string,
  address: string,
) {
  return db.condo.create({
    data: { orgId, name, address },
  });
}

export function createCondoMember(
  condoId: string,
  userId: string,
  role: CondoMemberRole,
) {
  return db.condoMember.create({
    data: { condoId, userId, role },
  });
}

export function upsertUser(
  clerkId: string,
  email: string,
  firstName: string | null,
  lastName: string | null,
) {
  return db.user.upsert({
    where: { clerkId },
    update: {
      email,
      firstName,
      lastName,
    },
    create: {
      email,
      firstName,
      lastName,
      clerkId,
    },
  });
}
