import { sql } from "drizzle-orm";
import {
  pgTableCreator,
  timestamp,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => name);

const baseTableColumns = {
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
    .notNull(),
  // deleted: boolean().default(false).notNull(), // might be useful for soft deletes, but not needed yet
  // deletedAt: timestamp(), // might be useful for soft deletes, but not needed yet
};

export const condoTable = createTable("condo", (d) => ({
  id: d.uuid("id").defaultRandom().primaryKey(),
  orgId: d.text("org_id").notNull(),
  address: d.text("address"),
  name: d.text("name"),
  ...baseTableColumns,
}));

export const condoMemberRoleEnum = pgEnum("condo_member_role", [
  "resident",
  "admin",
]);

export const condoMembersTable = createTable(
  "condo_members",
  (d) => ({
    condoId: d
      .uuid("condo_id")
      .notNull()
      .references(() => condoTable.id),
    userId: d.text("user_id").notNull(),
    role: condoMemberRoleEnum("role").notNull().default("resident"),
    ...baseTableColumns,
  }),
  (t) => [primaryKey({ columns: [t.condoId, t.userId] })],
);
