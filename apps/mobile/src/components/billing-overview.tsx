import { api } from "@condo-manager/backend";
import { useAction, useQuery } from "convex/react";
import { useOrganization } from "@clerk/expo";
import { useConvexAuth } from "convex/react";
import { useEffect, useRef } from "react";
import { Text, View } from "react-native-css/components";

export function BillingOverview() {
  const convexAuth = useConvexAuth();
  const organizations = useQuery(
    api.modules.organizations.queries.listMineWithBilling,
    convexAuth.isAuthenticated ? {} : "skip",
  );
  const refreshSubscription = useAction(
    api.modules.billing.actions.refreshSelectedOrganizationSubscription,
  );
  const { organization } = useOrganization();
  const refreshedOrganizationId = useRef<string | null>(null);

  useEffect(() => {
    if (
      !convexAuth.isAuthenticated ||
      !organization ||
      refreshedOrganizationId.current === organization.id
    ) {
      return;
    }

    refreshedOrganizationId.current = organization.id;
    void refreshSubscription().catch(() => {
      refreshedOrganizationId.current = null;
    });
  }, [convexAuth.isAuthenticated, organization, refreshSubscription]);

  return (
    <View className="self-stretch gap-3">
      <Text className="text-lg font-bold">Organizações e billing</Text>
      {organizations === undefined ? (
        <Text>A carregar billing…</Text>
      ) : organizations.length === 0 ? (
        <Text>Não existem organizações disponíveis.</Text>
      ) : (
        organizations.map(({ organization: item, billing }) => (
          <View className="gap-1" key={item.clerkOrganizationId}>
            <Text className="font-semibold">{item.name}</Text>
            <Text>
              Plano: {billing.currentPlan?.name ?? "Sem plano"} · Estado: {billing.state}
            </Text>
            {billing.currentPlan?.featureSlugs.map((featureSlug) => (
              <Text key={featureSlug}>• {featureSlug}</Text>
            ))}
          </View>
        ))
      )}
    </View>
  );
}
