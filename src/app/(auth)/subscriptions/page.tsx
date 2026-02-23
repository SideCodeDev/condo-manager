"use client";

import {
  useAction,
  useAuthenticatedQuery,
  useUnauthenticatedQuery,
} from "@/lib/data-utils";
import { api } from "@be/api";

export default function PricingPage() {
  const {
    data: plans,
    isPending,
    isError,
    error,
  } = useUnauthenticatedQuery(api.modules.billing.queries.getPlans);
  const { data: subscription } = useAuthenticatedQuery(
    api.modules.organizations.queries.getCurrentFeatureSet,
  );
  const { execute: subscribe } = useAction(
    api.modules.billing.actions.createSubscriptionCheckout,
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
    <main
      className="w-dvw h-dvh grid place-items-center"
      style={{ gridTemplateColumns: `repeat(${plans?.length}, 1fr)` }}
    >
      {plans?.map((p) => (
        <div
          key={p._id}
          className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center gap-4 border border-gray-200"
          style={{ minWidth: 280 }}
        >
          <h2 className="text-xl font-semibold text-gray-800">Plan {p.slug}</h2>
          <div className="text-2xl font-bold text-blue-600">
            €{p.priceMonth}/month
          </div>
          <ul className="text-gray-600 text-sm mb-4">
            <li className="mb-1">
              •{" "}
              {p.maxNumberOfCondos === "unlimited"
                ? "Unlimited condos"
                : ` up to ${p.maxNumberOfCondos} condos`}
            </li>
          </ul>
          <button
            disabled={!plans || subscription?.plan === p.slug}
            onClick={() => {
              subscribe({ planId: p._id });
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {subscription?.plan === p.slug ? "Current Plan" : "Subscribe"}
          </button>
        </div>
      ))}
    </main>
  );
}
