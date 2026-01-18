import { PrismaClient } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const globalForDb = global as unknown as {
  db: PrismaClient;
};

export const db =
  globalForDb.db ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForDb.db = db;
