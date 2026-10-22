import { makeFunctionReference, type FunctionReference } from "convex/server";
import type { Id } from "../_generated/dataModel";

export const getUserOrgs = makeFunctionReference(
  "authProvider/organizations/queries:getUserOrgs",
) as unknown as FunctionReference<
  "query",
  "public",
  {},
  {
    id: Id<"organizations">;
    clerkOrganizationId: string;
    name: string;
    features: { maxCondo: "unlimited" | number };
  }[]
>;

export const getAllCondoMemberships = makeFunctionReference(
  "modules/condoMember/queries:getAllMemberships",
) as unknown as FunctionReference<
  "query",
  "public",
  {},
  {
    _id: Id<"condoMember">;
    _creationTime: number;
    condoId: Id<"condos">;
    userId: Id<"users">;
    type: "member" | "admin";
  }[]
>;

export const provisionPersonalOrganization = makeFunctionReference(
  "authProvider/organizations/actions:provisionPersonalOrganization",
) as unknown as FunctionReference<
  "action",
  "internal",
  { clerkUserId: string },
  null
>;

export const getUserForProvisioning = makeFunctionReference(
  "authProvider/organizations/queries:getUserForProvisioning",
) as unknown as FunctionReference<
  "query",
  "internal",
  { clerkUserId: string },
  {
    email: string;
    firstName?: string;
    lastName?: string;
  } | null
>;

export const startProvisioning = makeFunctionReference(
  "authProvider/organizations/mutations:startProvisioning",
) as unknown as FunctionReference<
  "mutation",
  "internal",
  { clerkUserId: string },
  number | false
>;

export const completeProvisioning = makeFunctionReference(
  "authProvider/organizations/mutations:completeProvisioning",
) as unknown as FunctionReference<
  "mutation",
  "internal",
  {
    clerkUserId: string;
    clerkOrganizationId: string;
    organization: OrganizationInput;
    membership?: MembershipInput;
  },
  null
>;

export const failProvisioning = makeFunctionReference(
  "authProvider/organizations/mutations:failProvisioning",
) as unknown as FunctionReference<
  "mutation",
  "internal",
  { clerkUserId: string; error: string },
  null
>;

export const syncBillingSubscription = makeFunctionReference(
  "authProvider/billing/mutations:syncSubscription",
) as unknown as FunctionReference<
  "mutation",
  "internal",
  BillingSubscriptionInput,
  null
>;

export type OrganizationInput = {
  clerkOrganizationId: string;
  name: string;
  slug: string;
  imageUrl?: string;
  createdByClerkUserId?: string;
  kind: "personal" | "team";
  createdAt: number;
  updatedAt: number;
  raw?: string;
};

export type MembershipInput = {
  clerkMembershipId: string;
  clerkOrganizationId: string;
  clerkUserId: string;
  role: string;
  permissions: string[];
  createdAt: number;
  updatedAt: number;
  raw?: string;
};

export type BillingItemInput = {
  clerkSubscriptionItemId: string;
  clerkSubscriptionId?: string;
  clerkOrganizationId: string;
  clerkPlanId?: string;
  planSlug?: string;
  planName?: string;
  planIsDefault?: boolean;
  featureSlugs?: string[];
  status: string;
  billingPeriod?: string;
  isFreeTrial?: boolean;
  periodStart: number;
  periodEnd?: number;
  canceledAt?: number;
  endedAt?: number;
  pastDueAt?: number;
  updatedAt: number;
  raw?: string;
};

export type BillingSubscriptionInput = {
  clerkSubscriptionId: string;
  clerkOrganizationId: string;
  status: string;
  activeAt?: number;
  canceledAt?: number;
  endedAt?: number;
  pastDueAt?: number;
  createdAt: number;
  updatedAt: number;
  items: BillingItemInput[];
  raw?: string;
};
