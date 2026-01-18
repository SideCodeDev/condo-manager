import { db } from "./db";

export function getOrgCondosCount(orgId: string) {
  return db.condo.count({
    where: {
      orgId,
    },
  });
}
