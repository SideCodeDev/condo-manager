import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

const planSchema = v.union(
  v.literal("free"),
  v.literal("basic"),
  v.literal("pro"),
  v.literal("enterprise"),
);

const authTables = {
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    orgs: v.array(v.string()),
  }).index("by_clerk_id", ["clerkId"]),
  organization: defineTable({
    orgId: v.string(),
    plan: planSchema,
    createdAt: v.number(),
    updatedAt: v.number(),
    status: v.union(
      v.literal("abandoned"),
      v.literal("active"),
      v.literal("canceled"),
      v.literal("ended"),
      v.literal("expired"),
      v.literal("incomplete"),
      v.literal("past_due"),
      v.literal("upcoming"),
    ),
  }).index("by_org_id", ["orgId"]),
  plans: defineTable({
    slug: planSchema,
    maxNumberOfCondos: v.union(v.number(), v.literal("unlimited")),
  }).index("by_slug", ["slug"]),
};

const applicationTables = {
  userSettings: defineTable({
    userId: v.id("users"),
    activeOrg: v.optional(v.string()),
  }),
  condo: defineTable({
    orgId: v.string(),
    address: v.string(),
    name: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_org_id", ["orgId"]),
  condoMember: defineTable({
    condoId: v.id("condo"),
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("member")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_condo_id", ["condoId"])
    .index("by_user_id", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});

type TableSchema<
  K extends keyof (typeof authTables & typeof applicationTables),
  T extends typeof authTables & typeof applicationTables = typeof authTables &
    typeof applicationTables,
> = Infer<T[K]["validator"]>;

export type User = TableSchema<"users">;
export type UserSettings = TableSchema<"userSettings">;
export type Organization = TableSchema<"organization">;
export type Plan = TableSchema<"plans">;
export type PlanSlug = Plan["slug"];
export type Condo = TableSchema<"condo">;
export type CondoMember = TableSchema<"condoMember">;
