"use node";

import {
  createClerkClient,
  type BillingSubscriptionItem,
} from "@clerk/backend";
import { internalAction } from "../../_generated/server";
import {
  completeProvisioning,
  failProvisioning,
  getUserForProvisioning,
  provisionPersonalOrganization as provisionPersonalOrganizationRef,
  startProvisioning,
  syncBillingSubscription,
  type BillingItemInput,
  type MembershipInput,
  type OrganizationInput,
} from "../../lib/functionReferences";
import { v } from "convex/values";
import { log } from "../../lib/logging";

const PERSONAL_ORGANIZATION_KIND = "personal";
const MAX_PROVISIONING_ATTEMPTS = 5;

function getClerkClient() {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) throw new Error("Missing CLERK_SECRET_KEY");
  return createClerkClient({ secretKey });
}

function organizationName(user: {
  email: string;
  firstName?: string;
  lastName?: string;
}) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  const fallback = user.email.split("@")[0] || "Utilizador";
  return `${fullName || fallback}'s Organization`;
}

function isPersonalOrganization(
  metadata: unknown,
  clerkUserId: string,
): boolean {
  if (!metadata || typeof metadata !== "object") return false;
  const value = metadata as Record<string, unknown>;
  return (
    value.managedBy === "condo-manager" &&
    value.kind === PERSONAL_ORGANIZATION_KIND &&
    value.ownerUserId === clerkUserId
  );
}

function normalizeOrganization(
  value: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
    createdBy?: string;
    createdAt: number;
    updatedAt: number;
  },
  raw: unknown,
): OrganizationInput {
  return {
    clerkOrganizationId: value.id,
    name: value.name,
    slug: value.slug,
    imageUrl: value.imageUrl || undefined,
    createdByClerkUserId: value.createdBy,
    kind: PERSONAL_ORGANIZATION_KIND,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
    raw: JSON.stringify(raw),
  };
}

function normalizeMembership(value: {
  id: string;
  role: string;
  permissions: string[];
  createdAt: number;
  updatedAt: number;
  organization: { id: string };
  publicUserData?: { userId: string } | null;
}): MembershipInput | undefined {
  const clerkUserId = value.publicUserData?.userId;
  if (!clerkUserId) return undefined;
  return {
    clerkMembershipId: value.id,
    clerkOrganizationId: value.organization.id,
    clerkUserId,
    role: value.role,
    permissions: value.permissions,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
    raw: JSON.stringify(value),
  };
}

function normalizeBillingItem(
  item: BillingSubscriptionItem,
  clerkOrganizationId: string,
  clerkSubscriptionId: string,
): BillingItemInput {
  return {
    clerkSubscriptionItemId: item.id,
    clerkSubscriptionId,
    clerkOrganizationId,
    clerkPlanId: item.planId ?? undefined,
    planSlug: item.plan?.slug,
    planName: item.plan?.name,
    planIsDefault: item.plan?.isDefault,
    featureSlugs: item.plan?.features.map((feature) => feature.slug),
    status: item.status,
    billingPeriod: item.planPeriod,
    isFreeTrial: item.isFreeTrial,
    periodStart: item.periodStart,
    periodEnd: item.periodEnd ?? undefined,
    canceledAt: item.canceledAt ?? undefined,
    endedAt: item.endedAt ?? undefined,
    pastDueAt: item.pastDueAt ?? undefined,
    updatedAt: item.updatedAt,
    raw: JSON.stringify(item),
  };
}

export const provisionPersonalOrganization = internalAction({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) => {
    const attempt = await ctx.runMutation(startProvisioning, { clerkUserId });
    if (attempt === false) return null;

    try {
      const user = await ctx.runQuery(getUserForProvisioning, { clerkUserId });
      if (!user) throw new Error(`User ${clerkUserId} was not found`);

      const clerk = getClerkClient();
      const memberships = await clerk.users.getOrganizationMembershipList({
        userId: clerkUserId,
        limit: 100,
      });
      const existingMembership = memberships.data.find((membership) =>
        isPersonalOrganization(
          membership.organization.privateMetadata,
          clerkUserId,
        ),
      );

      const organization = existingMembership
        ? existingMembership.organization
        : await clerk.organizations.createOrganization({
            name: organizationName(user),
            createdBy: clerkUserId,
            privateMetadata: {
              managedBy: "condo-manager",
              kind: PERSONAL_ORGANIZATION_KIND,
              ownerUserId: clerkUserId,
            },
          });

      let membership = existingMembership;
      if (!membership) {
        const refreshed = await clerk.users.getOrganizationMembershipList({
          userId: clerkUserId,
          limit: 100,
        });
        membership = refreshed.data.find(
          (item) => item.organization.id === organization.id,
        );
      }
      if (!membership) {
        throw new Error(
          `Membership for ${clerkUserId} in ${organization.id} is not available yet`,
        );
      }
      const normalizedMembership = normalizeMembership(membership);
      if (!normalizedMembership) {
        throw new Error(`Membership ${membership.id} has no Clerk user ID`);
      }

      await ctx.runMutation(completeProvisioning, {
        clerkUserId,
        clerkOrganizationId: organization.id,
        organization: normalizeOrganization(organization, organization),
        membership: normalizedMembership,
      });

      try {
        const subscription =
          await clerk.billing.getOrganizationBillingSubscription(
            organization.id,
          );
        await ctx.runMutation(syncBillingSubscription, {
          clerkSubscriptionId: subscription.id,
          clerkOrganizationId: organization.id,
          status: subscription.status,
          activeAt: subscription.activeAt ?? undefined,
          pastDueAt: subscription.pastDueAt ?? undefined,
          createdAt: subscription.createdAt,
          updatedAt: subscription.updatedAt,
          items: subscription.subscriptionItems.map((item) =>
            normalizeBillingItem(item, organization.id, subscription.id),
          ),
          raw: JSON.stringify(subscription),
        });
      } catch (error) {
        // Billing may not yet be materialized when the Organization is created.
        // Its Clerk webhook will populate the local projection afterwards.
        log.warn("organization.provisioning.initial_billing_unavailable", {
          errorName: log.errorName(error),
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await ctx.runMutation(failProvisioning, {
        clerkUserId,
        error: message,
      });
      if (attempt < MAX_PROVISIONING_ATTEMPTS) {
        await ctx.scheduler.runAfter(
          Math.min(30_000 * 2 ** (attempt - 1), 10 * 60_000),
          provisionPersonalOrganizationRef,
          { clerkUserId },
        );
      }
      log.error("organization.provisioning.failed", {
        attempt,
        retryScheduled: attempt < MAX_PROVISIONING_ATTEMPTS,
        errorName: log.errorName(error),
      });
      throw error;
    }
    return null;
  },
});
