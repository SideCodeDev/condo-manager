import { StripeSubscriptions } from "@convex-dev/stripe";
import { v } from "convex/values";
import { components, internal } from "./_generated/api";
import { action } from "./_generated/server";
import { ApplicationError } from "./errors";

const stripeClient = new StripeSubscriptions(components.stripe, {});

// Create a checkout session for a subscription
export const createSubscriptionCheckout = action({
  returns: v.string(),
  args: { planId: v.id("plans") },
  handler: async (ctx, arg) => {
    const user = await ctx.runQuery(internal.user.getUser);
    const orgs = await ctx.runQuery(internal.organization.getUserOrganization, {
      userId: user._id,
    });
    const org = orgs?.[0];
    if (!org) throw new ApplicationError("org_not_found");
    const id = org._id;

    const plan = await ctx.runQuery(internal.billing.getPlan, {
      id: arg.planId,
    });
    if (!plan) throw new ApplicationError("plan_not_found");

    const subs = await ctx.runQuery(
      components.stripe.public.listSubscriptionsByUserId,
      { userId: id },
    );

    const existingSubscription = subs.find((s) => s.status === "active");

    // If there's an existing subscription, redirect to customer portal
    // This allows users to upgrade/downgrade/cancel safely
    if (existingSubscription) {
      console.log(
        `Existing subscription found for org ${id} with status: ${existingSubscription.status}. Redirecting to customer portal.`,
      );
      const stripeRes = await stripeClient.createCustomerPortalSession(ctx, {
        customerId: existingSubscription.stripeCustomerId,
        returnUrl: "http://localhost:3000/app",
      });
      return stripeRes.url;
    }

    // No subscription exists, create a new one
    const customer = await stripeClient.getOrCreateCustomer(ctx, {
      userId: id,
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
      subscriptionMetadata: { userId: org._id },
    });
    if (!stripeRes.url) throw new ApplicationError("checkout_session_failed");
    return stripeRes.url;
  },
});
