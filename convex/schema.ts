import { Id } from "./_generated/dataModel";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";
import { planSchema } from "./lib/validators";

const authTables = {
  users: defineTable({
    authProviderId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    updatedAt: v.number(),
    orgs: v.array(v.string()),
  }).index("by_auth_provider_id", ["authProviderId"]),
  organization: defineTable({
    name: v.string(),
  }),
  organizationMembership: defineTable({
    orgId: v.id("organization"),
    userId: v.id("users"),
    role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
  })
    .index("by_user_id", ["userId"])
    .index("by_org_id", ["orgId"]),
  plans: defineTable({
    slug: planSchema,
    priceId: v.string(),
    priceMonth: v.number(),
    maxNumberOfCondos: v.union(v.number(), v.literal("unlimited")),
  })
    .index("by_slug", ["slug"])
    .index("by_price_id", ["priceId"]),
};

const applicationTables = {
  userSettings: defineTable({
    userId: v.id("users"),
    activeOrg: v.id("organization"),
    activeCondo: v.optional(v.id("condo")),
  }).index("by_user_id", ["userId"]),
  condo: defineTable({
    orgId: v.string(),
    address: v.string(),
    name: v.string(),
  }).index("by_org_id", ["orgId"]),
  condoMember: defineTable({
    condoId: v.id("condo"),
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("member")),
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
> = Infer<T[K]["validator"]> & { _id: Id<K>; _creationTime: number };

export type User = TableSchema<"users">;
export type UserSettings = TableSchema<"userSettings">;
export type Organization = TableSchema<"organization">;
export type Plan = TableSchema<"plans">;
export type PlanSlug = Plan["slug"];
export type Condo = TableSchema<"condo">;
export type CondoMember = TableSchema<"condoMember">;
export type OrganizationMembership = TableSchema<"organizationMembership">;
