import { components, internal } from "@be/api";
import { action } from "@be/server";
import { StripeSubscriptions } from "@convex-dev/stripe";
import { v } from "convex/values";
import { ApplicationError } from "../../lib/errors";

const stripeClient = new StripeSubscriptions(components.stripe, {});

// Create a checkout session for a subscription
export const createSubscriptionCheckout = action({
  returns: v.string(),
  args: { planId: v.id("plans"), path: v.optional(v.string()) },
  handler: async (ctx, arg) => {
    const user = await ctx.runQuery(internal.modules.users.queries.getUser);
    const org = await ctx.runQuery(
      internal.modules.organizations.queries.getCurrentOrganization,
      {
        userId: user._id,
      },
    );
    if (!org) throw new ApplicationError("org_not_found");
    const id = org._id;

    const plan = await ctx.runQuery(internal.modules.billing.queries.getPlan, {
      id: arg.planId,
    });
    if (!plan) throw new ApplicationError("plan_not_found");

    const sub = await ctx.runQuery(
      components.stripe.public.getSubscriptionByOrgId,
      { orgId: id },
    );

    const existingSubscription = sub?.status === "active" ? sub : null;

    // If there's an existing subscription, redirect to customer portal
    // This allows users to upgrade/downgrade/cancel safely
    if (existingSubscription) {
      console.log(
        `Existing subscription found for org ${id} with status: ${existingSubscription.status}. Redirecting to customer portal.`,
      );
      const stripeRes = await stripeClient.createCustomerPortalSession(ctx, {
        customerId: existingSubscription.stripeCustomerId,
        returnUrl: new URL(
          arg.path ?? "/app",
          "http://localhost:3000",
        ).toString(),
      });
      return stripeRes.url;
    }

    // No subscription exists, create a new one
    const customer = await stripeClient.getOrCreateCustomer(ctx, {
      userId: org._id,
    });

    console.log(
      `No existing subscription found for org ${id}. Creating new checkout session for customer ${customer.customerId}`,
    );

    // Create checkout session
    const stripeRes = await stripeClient.createCheckoutSession(ctx, {
      priceId: plan.priceId,
      customerId: customer.customerId,
      mode: "subscription",
      successUrl: "http://localhost:3000/app",
      cancelUrl: "http://localhost:3000/app",
      subscriptionMetadata: { orgId: org._id, trial_period_days: "14" },
    });
    if (!stripeRes.url) throw new ApplicationError("checkout_session_failed");
    return stripeRes.url;
  },
});
