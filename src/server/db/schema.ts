import { sql } from "drizzle-orm";
import { index, pgTableCreator, timestamp } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => name);

const baseTableColumns = {
  // deleted: boolean().default(false).notNull(), // might be useful for soft deletes, but not needed yet
  createdAt: timestamp()
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date())
    .notNull(),
  // deletedAt: timestamp(), // might be useful for soft deletes, but not needed yet
};

export const user = createTable(
  "user",
  (d) => ({
    id: d.uuid().defaultRandom().primaryKey(),
    name: d.text(),
    ...baseTableColumns,
  }),
  (t) => [index("name_idx").on(t.name)]
);
