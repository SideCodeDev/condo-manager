import { db } from "./db";
import { condoMembersTable, condoTable, condoMemberRoleEnum } from "./schema";

type DbContext =
  | typeof db
  | Parameters<Parameters<typeof db.transaction>[0]>[0];

export async function createCondo(
  orgId: string,
  name: string,
  address: string,
  ctx: DbContext = db,
) {
  return ctx
    .insert(condoTable)
    .values({ orgId, name, address })
    .returning()
    .then((r) => r[0]);
}

type CondoMemberRole = (typeof condoMemberRoleEnum.enumValues)[number];
export function createCondoMember(
  condoId: string,
  userId: string,
  role: CondoMemberRole,
  ctx: DbContext = db,
) {
  return ctx
    .insert(condoMembersTable)
    .values({
      condoId,
      userId,
      role,
    })
    .returning()
    .then((r) => r[0]);
}
