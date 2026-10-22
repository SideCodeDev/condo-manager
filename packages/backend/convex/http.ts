import { verifyWebhook } from "@clerk/backend/webhooks";
import {
  httpRouter,
  makeFunctionReference,
  type DefaultFunctionArgs,
  type FunctionReference,
} from "convex/server";
import { httpAction } from "./_generated/server";
import type {
  BillingItemInput,
  BillingSubscriptionInput,
  MembershipInput,
  OrganizationInput,
} from "./lib/functionReferences";

const http = httpRouter();

type InternalMutation<
  Args extends DefaultFunctionArgs,
  Result = null,
> = FunctionReference<"mutation", "internal", Args, Result>;

type InternalAction<
  Args extends DefaultFunctionArgs,
  Result = null,
> = FunctionReference<"action", "internal", Args, Result>;

const syncOrganization = makeFunctionReference(
  "authProvider/organizations/mutations:syncOrganization",
) as unknown as InternalMutation<OrganizationInput, string>;
const deleteOrganization = makeFunctionReference(
  "authProvider/organizations/mutations:deleteOrganization",
) as unknown as InternalMutation<{ clerkOrganizationId: string }>;
const syncMembership = makeFunctionReference(
  "authProvider/organizations/mutations:syncMembership",
) as unknown as InternalMutation<MembershipInput>;
const deleteMembership = makeFunctionReference(
  "authProvider/organizations/mutations:deleteMembership",
) as unknown as InternalMutation<{ clerkMembershipId: string }>;
const syncSubscription = makeFunctionReference(
  "authProvider/billing/mutations:syncSubscription",
) as unknown as InternalMutation<BillingSubscriptionInput>;
const syncSubscriptionItem = makeFunctionReference(
  "authProvider/billing/mutations:syncSubscriptionItem",
) as unknown as InternalMutation<BillingItemInput>;
const refreshOrganizationSubscription = makeFunctionReference(
  "authProvider/billing/actions:refreshOrganizationSubscription",
) as unknown as InternalAction<{ clerkOrganizationId: string }>;
const upsertUser = makeFunctionReference(
  "authProvider/users/mutations:upsertUser",
) as unknown as InternalMutation<
  {
    authProviderId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    raw: string;
    provisionOrganization?: boolean;
  },
  unknown
>;
const deleteUserByAuthProviderId = makeFunctionReference(
  "authProvider/users/mutations:deleteUserByAuthProviderId",
) as unknown as InternalMutation<{ authProviderId: string }>;

function optionalNumber(value: number | null | undefined) {
  return value ?? undefined;
}

function organizationKind(metadata: unknown): "personal" | "team" {
  if (metadata && typeof metadata === "object") {
    const value = metadata as Record<string, unknown>;
    if (value.managedBy === "condo-manager" && value.kind === "personal") {
      return "personal";
    }
  }
  return "team";
}

function normalizeWebhookBillingItem(
  data: {
    id: string;
    status: string;
    plan_period: string;
    period_start: number;
    period_end: number | null;
    canceled_at?: number | null;
    past_due_at?: number | null;
    plan_id?: string | null;
    plan?: {
      id: string;
      slug: string;
      name: string;
      is_default: boolean;
    } | null;
  },
  clerkOrganizationId: string,
  clerkSubscriptionId?: string,
): BillingItemInput {
  return {
    clerkSubscriptionItemId: data.id,
    clerkSubscriptionId,
    clerkOrganizationId,
    clerkPlanId: data.plan_id ?? data.plan?.id ?? undefined,
    planSlug: data.plan?.slug,
    planName: data.plan?.name,
    planIsDefault: data.plan?.is_default,
    status: data.status,
    billingPeriod: data.plan_period,
    periodStart: data.period_start,
    periodEnd: optionalNumber(data.period_end),
    canceledAt: optionalNumber(data.canceled_at),
    pastDueAt: optionalNumber(data.past_due_at),
    updatedAt: Date.now(),
    raw: JSON.stringify(data),
  };
}

http.route({
  path: "/clerk/webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
    if (!signingSecret) {
      console.error("Missing CLERK_WEBHOOK_SIGNING_SECRET");
      return new Response("Webhook is not configured", { status: 500 });
    }

    try {
      const evt = await verifyWebhook(req as unknown as Request, {
        signingSecret,
      });
      console.log(`Processing Clerk webhook ${evt.type}`);

      switch (evt.type) {
        case "user.created":
        case "user.updated": {
          const email = evt.data.email_addresses[0]?.email_address;
          if (!email) throw new Error(`User ${evt.data.id} has no email`);
          await ctx.runMutation(upsertUser, {
            authProviderId: evt.data.id,
            email,
            firstName: evt.data.first_name ?? undefined,
            lastName: evt.data.last_name ?? undefined,
            imageUrl: evt.data.image_url ?? undefined,
            provisionOrganization: evt.type === "user.created",
            raw: JSON.stringify(evt),
          });
          break;
        }
        case "user.deleted":
          if (evt.data.id) {
            await ctx.runMutation(deleteUserByAuthProviderId, {
              authProviderId: evt.data.id,
            });
          }
          break;
        case "organization.created":
        case "organization.updated":
          await ctx.runMutation(syncOrganization, {
            clerkOrganizationId: evt.data.id,
            name: evt.data.name,
            slug: evt.data.slug,
            imageUrl: evt.data.image_url,
            createdByClerkUserId: evt.data.created_by,
            kind: organizationKind(evt.data.private_metadata),
            createdAt: evt.data.created_at,
            updatedAt: evt.data.updated_at,
            raw: JSON.stringify(evt),
          });
          break;
        case "organization.deleted":
          if (!evt.data.id) break;
          await ctx.runMutation(deleteOrganization, {
            clerkOrganizationId: evt.data.id,
          });
          break;
        case "organizationMembership.created":
        case "organizationMembership.updated":
          await ctx.runMutation(syncMembership, {
            clerkMembershipId: evt.data.id,
            clerkOrganizationId: evt.data.organization.id,
            clerkUserId: evt.data.public_user_data.user_id,
            role: evt.data.role,
            permissions: evt.data.permissions,
            createdAt: evt.data.created_at,
            updatedAt: evt.data.updated_at,
            raw: JSON.stringify(evt),
          });
          break;
        case "organizationMembership.deleted":
          await ctx.runMutation(deleteMembership, {
            clerkMembershipId: evt.data.id,
          });
          break;
        case "subscription.created":
        case "subscription.updated":
        case "subscription.active":
        case "subscription.pastDue": {
          const organizationId = evt.data.payer.organization_id;
          if (!organizationId) break;
          await ctx.runMutation(syncSubscription, {
            clerkSubscriptionId: evt.data.id,
            clerkOrganizationId: organizationId,
            status: evt.data.status,
            activeAt: optionalNumber(evt.data.active_at),
            canceledAt: optionalNumber(evt.data.canceled_at),
            endedAt: optionalNumber(evt.data.ended_at),
            pastDueAt: optionalNumber(evt.data.past_due_at),
            createdAt: evt.data.created_at,
            updatedAt: evt.data.updated_at,
            items: evt.data.items.map((item) =>
              normalizeWebhookBillingItem(item, organizationId, evt.data.id),
            ),
            raw: JSON.stringify(evt),
          });
          await ctx.scheduler.runAfter(0, refreshOrganizationSubscription, {
            clerkOrganizationId: organizationId,
          });
          break;
        }
        case "subscriptionItem.created":
        case "subscriptionItem.updated":
        case "subscriptionItem.active":
        case "subscriptionItem.canceled":
        case "subscriptionItem.upcoming":
        case "subscriptionItem.ended":
        case "subscriptionItem.abandoned":
        case "subscriptionItem.incomplete":
        case "subscriptionItem.pastDue":
        case "subscriptionItem.freeTrialEnding": {
          const organizationId = evt.data.payer?.organization_id;
          if (!organizationId) break;
          const item = normalizeWebhookBillingItem(evt.data, organizationId);
          if (evt.type === "subscriptionItem.freeTrialEnding") {
            item.isFreeTrial = true;
          }
          item.endedAt =
            evt.type === "subscriptionItem.ended" ? Date.now() : undefined;
          await ctx.runMutation(syncSubscriptionItem, item);
          await ctx.scheduler.runAfter(0, refreshOrganizationSubscription, {
            clerkOrganizationId: organizationId,
          });
          break;
        }
      }

      console.log(`Processed Clerk webhook ${evt.type}`);
      return new Response("Webhook received");
    } catch (error) {
      console.error("Error processing Clerk webhook", error);
      return new Response("Error processing webhook", { status: 500 });
    }
  }),
});

export default http;
