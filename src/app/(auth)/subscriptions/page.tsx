"use client";

import { useAction, useUnauthenticatedQuery } from "@/lib/data-utils";
import { api } from "@be/api";

export default function PricingPage() {
  const {
    data: plans,
    isPending,
    isError,
    error,
  } = useUnauthenticatedQuery(api.billing.getPlans);
  const { execute: subscribe } = useAction(
    api.stripe.createSubscriptionCheckout,
    {
      onSuccess: (url) => {
        if (url) {
          window.location.href = url;
        }
      },
    },
  );
  if (isPending) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading plans.{JSON.stringify(error, null, 2)}</div>;
  }
  return (
    <main className="w-dvw h-dvh grid place-items-center">
      {plans?.map((p) => (
        <div key={p._id}>
          <h2>Plan {p.slug}</h2>
          <button
            disabled={!plans}
            onClick={() => {
              subscribe({ planId: p._id });
            }}
          >
            subscribe
          </button>
        </div>
      ))}
    </main>
  );
}
