import { StripeSubscriptions } from "@convex-dev/stripe";
import { v } from "convex/values";
import { components, internal } from "./_generated/api";
import { action } from "./_generated/server";
import { ApplicationError } from "./errors";

const stripeClient = new StripeSubscriptions(components.stripe, {});

// Create a checkout session for a subscription
export const createSubscriptionCheckout = action({
  args: { planId: v.id("plans"), orgId: v.id("organization") },
  returns: v.object({
    sessionId: v.string(),
    url: v.union(v.string(), v.null()),
  }),
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.user.getUser);
    const orgs = await ctx.runQuery(internal.organizaton.getUserOrganization, {
      userId: user._id,
    });
    const org = orgs.find((org) => org._id === args.orgId);
    if (!org) throw new ApplicationError("org_not_found");

    // Get or create a Stripe customer
    const customer = await stripeClient.getOrCreateCustomer(ctx, {
      userId: args.orgId,
    });

    // Create checkout session
    return await stripeClient.createCheckoutSession(ctx, {
      priceId: args.planId,
      customerId: customer.customerId,
      mode: "subscription",
      successUrl: "http://localhost:5173/?success=true",
      cancelUrl: "http://localhost:5173/?canceled=true",
      subscriptionMetadata: { userId: args.orgId },
    });
  },
});
