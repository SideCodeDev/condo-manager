import { StripeSubscriptions } from "@convex-dev/stripe";
import { v } from "convex/values";
import { components, internal } from "./_generated/api";
import { action } from "./_generated/server";
import { ApplicationError } from "./errors";

const stripeClient = new StripeSubscriptions(components.stripe, {});

// Create a checkout session for a subscription
export const createSubscriptionCheckout = action({
  args: { planId: v.id("plans") },
  handler: async (ctx, arg) => {
    const user = await ctx.runQuery(internal.user.getUser);
    const orgs = await ctx.runQuery(internal.organization.getUserOrganization, {
      userId: user._id,
    });
    const plan = await ctx.runQuery(internal.billing.getPlan, {
      id: arg.planId,
    });
    if (!plan) throw new ApplicationError("plan_not_found");
    const org = orgs?.[0];
    if (!org) throw new ApplicationError("org_not_found");

    const id = org._id;

    // // Get or create a Stripe customer
    const customer = await stripeClient.getOrCreateCustomer(ctx, {
      userId: id,
    });

    // Create checkout session
    const stripeRes = await stripeClient.createCheckoutSession(ctx, {
      priceId: plan.priceId!,
      customerId: customer.customerId,
      mode: "subscription",
      successUrl: "http://localhost:5173/?success=true",
      cancelUrl: "http://localhost:5173/?canceled=true",
      subscriptionMetadata: { userId: org._id },
    });
    return stripeRes;
  },
});
