import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// CLERK INTEGRATION
const users = defineTable({
  clerkId: v.string(),
  email: v.string(),
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
  orgs: v.array(v.string()),
}).index("by_clerk_id", ["clerkId"]);

export const planSchema = v.union(
  v.literal("free"),
  v.literal("basic"),
  v.literal("pro"),
  v.literal("enterprise"),
);

const organization = defineTable({
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
}).index("by_org_id", ["orgId"]);

const plans = defineTable({
  slug: planSchema,
  maxNumberOfCondos: v.union(v.number(), v.literal("unlimited")),
}).index("by_slug", ["slug"]);
export type Plan = Infer<(typeof plans)["validator"]>;

// APPLICATION TABLES

const userSettings = defineTable({
  userId: v.id("users"),
  activeOrg: v.optional(v.string()),
});

const condo = defineTable({
  orgId: v.string(),
  address: v.string(),
  name: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
}).index("by_org_id", ["orgId"]);

const condoMember = defineTable({
  condoId: v.id("condo"),
  userId: v.id("users"),
  role: v.union(v.literal("admin"), v.literal("member")),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_condo_id", ["condoId"])
  .index("by_user_id", ["userId"]);

export default defineSchema({
  users,
  userSettings,
  condo,
  condoMember,
  organization,
  plans,
});
