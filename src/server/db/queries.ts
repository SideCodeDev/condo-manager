import { db } from "./db";

export function getOrgCondos(orgId: string) {
  return db.query.condoTable.findMany({
    where: (tb, { eq }) => eq(tb.orgId, orgId),
  });
}
