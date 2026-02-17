import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal, components } from "./_generated/api";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { registerRoutes } from "@convex-dev/stripe";

const http = httpRouter();

http.route({
  path: "/clerk/webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
      if (!secret) {
        throw new Error("Missing CLERK_WEBHOOK_SIGNING_SECRET");
      }
      const evt = await verifyWebhook(req as unknown as NextRequest, {
        signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
      });
      const { id } = evt.data;
      const eventType = evt.type;
      console.log(
        `Received webhook with ID ${id} and event type of ${eventType}`,
      );

      switch (eventType) {
        case "user.updated":
        case "user.created":
          const { id, first_name, last_name, email_addresses, image_url } =
            evt.data;

          const email = email_addresses[0]?.email_address;

          if (!email) {
            console.warn(
              `No email address found for user with ID ${id}. Ignoring webhook.`,
            );
            break;
          }

          await ctx.runMutation(internal.user.upsertUser, {
            authProviderId: id,
            email: email,
            firstName: first_name ?? undefined,
            lastName: last_name ?? undefined,
            imageUrl: image_url ?? undefined,
            orgs: [],
          });
          break;
        case "user.deleted":
          if (!evt.data.deleted) {
            console.warn(
              `User with ID ${evt.data.id} not marked as deleted. Ignoring webhook.`,
            );
            break;
          }
          if (!evt.data.id) {
            console.warn(
              `No user ID found in deleted user webhook. Ignoring webhook.`,
            );
            break;
          }
          await ctx.runMutation(internal.user.deleteUserByAuthProviderId, {
            authProviderId: evt.data.id,
          });
      }

      return new Response("Webhook received", { status: 200 });
    } catch (e) {
      console.error("Error processing webhook:", e);
      return new Response("Error processing webhook", { status: 500 });
    }
  }),
});

registerRoutes(http, components.stripe, {
  webhookPath: "/stripe/webhook",
});

export default http;
