"use client";

import { api } from "@be/api";
import { useAction, useQuery } from "convex/react";

export default function PricingPage() {
  const plans = useQuery(api.billing.getPlans);
  const subscribe = useAction(api.stripe.createSubscriptionCheckout);
  return (
    <main className="w-dvw h-dvh grid place-items-center">
      {plans?.map((p) => (
        <div key={p._id}>
          <h2>Plan {p.slug}</h2>
          <button
            onClick={async () => {
              const url = await subscribe({ planId: p._id });
              if (url) {
                window.location.href = url;
              }
            }}
          >
            subscribe
          </button>
        </div>
      ))}
    </main>
  );
}
