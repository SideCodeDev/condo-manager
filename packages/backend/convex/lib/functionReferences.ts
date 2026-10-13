import { makeFunctionReference, type FunctionReference } from "convex/server";

export const provisionPersonalOrganization = makeFunctionReference(
  "modules/organizations/actions:provisionPersonalOrganization",
) as unknown as FunctionReference<
  "action",
  "internal",
  { clerkUserId: string },
  null
>;

export const getUserForProvisioning = makeFunctionReference(
  "modules/organizations/queries:getUserForProvisioning",
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
  "modules/organizations/mutations:startProvisioning",
) as unknown as FunctionReference<
  "mutation",
  "internal",
  { clerkUserId: string },
  number | false
>;

export const completeProvisioning = makeFunctionReference(
  "modules/organizations/mutations:completeProvisioning",
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
  "modules/organizations/mutations:failProvisioning",
) as unknown as FunctionReference<
  "mutation",
  "internal",
  { clerkUserId: string; error: string },
  null
>;

export const syncBillingSubscription = makeFunctionReference(
  "modules/billing/mutations:syncSubscription",
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
