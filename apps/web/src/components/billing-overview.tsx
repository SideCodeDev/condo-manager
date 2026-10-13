import { PricingTable, useOrganization } from "@clerk/react";
import { useAction, useQuery } from "convex/react";
import { useEffect, useRef } from "react";
import { api } from "@condo-manager/backend";

export function BillingOverview() {
  const organizations = useQuery(
    api.modules.organizations.queries.listMineWithBilling,
  );
  const refreshSubscription = useAction(
    api.modules.billing.actions.refreshSelectedOrganizationSubscription,
  );
  const { organization } = useOrganization();
  const refreshedOrganizationId = useRef<string | null>(null);

  useEffect(() => {
    if (!organization || refreshedOrganizationId.current === organization.id) {
      return;
    }

    refreshedOrganizationId.current = organization.id;
    void refreshSubscription().catch(() => {
      refreshedOrganizationId.current = null;
    });
  }, [organization, refreshSubscription]);

  return (
    <>
      <PricingTable for="organization" />

      <section className="grid gap-4">
        {organizations?.map(({ organization: item, billing }) => (
          <article className="grid gap-2" key={item.clerkOrganizationId}>
            <h2>{item.name}</h2>
            <p>
              Plano: {billing.currentPlan?.name ?? "Sem plano"} · Estado:{" "}
              {billing.state}
            </p>
            <ul>
              {billing.currentPlan?.featureSlugs.map((featureSlug) => (
                <li key={featureSlug}>{featureSlug}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <pre className="max-w-dvw overflow-hidden">
        {JSON.stringify(organizations, null, 2)}
      </pre>
    </>
  );
}
