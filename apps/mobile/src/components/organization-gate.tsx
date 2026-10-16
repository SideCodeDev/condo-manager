import { useOrganization, useOrganizationList } from "@clerk/expo";
import { api } from "@condo-manager/backend";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useEffect, useRef, type ReactNode } from "react";
import { ActivityIndicator } from "react-native";
import { Text, View } from "react-native-css/components";

type OrganizationGateProps = {
  children: ReactNode;
};

export function OrganizationGate({ children }: OrganizationGateProps) {
  const convexAuth = useConvexAuth();
  const settings = useQuery(
    api.modules.userSettings.queries.getCurrent,
    convexAuth.isAuthenticated ? {} : "skip",
  );
  const provisioning = useQuery(
    api.modules.organizations.queries.getProvisioningStatus,
    convexAuth.isAuthenticated ? {} : "skip",
  );
  const saveSelectedOrganization = useMutation(
    api.modules.userSettings.mutations.selectOrganization,
  );
  const { isLoaded: isOrganizationLoaded, organization } = useOrganization();
  const { isLoaded, setActive, userMemberships } = useOrganizationList({
    userMemberships: true,
  });
  const activatingOrganizationId = useRef<string | null>(null);

  useEffect(() => {
    const revalidateMemberships = userMemberships.revalidate;
    if (
      !isLoaded ||
      organization ||
      provisioning?.status === "failed" ||
      provisioning === undefined ||
      !revalidateMemberships
    ) {
      return;
    }

    void revalidateMemberships();
    const interval = setInterval(() => {
      void revalidateMemberships();
    }, 1_000);

    return () => clearInterval(interval);
  }, [isLoaded, organization, provisioning, userMemberships.revalidate]);

  useEffect(() => {
    if (
      !isLoaded ||
      !convexAuth.isAuthenticated ||
      settings === undefined ||
      !setActive
    ) {
      return;
    }

    const memberships = userMemberships.data;
    const selectedMembership = memberships?.find(
      (membership) =>
        membership.organization.id === settings.selectedClerkOrganizationId,
    );
    const targetOrganizationId =
      selectedMembership?.organization.id ?? memberships?.[0]?.organization.id;
    if (
      !targetOrganizationId ||
      organization?.id === targetOrganizationId ||
      activatingOrganizationId.current === targetOrganizationId
    ) {
      return;
    }

    activatingOrganizationId.current = targetOrganizationId;
    void (async () => {
      try {
        if (settings.selectedClerkOrganizationId !== targetOrganizationId) {
          await saveSelectedOrganization({
            clerkOrganizationId: targetOrganizationId,
          });
        }
        await setActive({ organization: targetOrganizationId });
      } catch {
        activatingOrganizationId.current = null;
      }
    })();
  }, [
    isLoaded,
    convexAuth.isAuthenticated,
    organization,
    saveSelectedOrganization,
    setActive,
    settings,
    userMemberships.data,
  ]);

  if (provisioning?.status === "failed") {
    return (
      <Text className="text-center">
        Não foi possível preparar a organização.
      </Text>
    );
  }

  if (
    convexAuth.isLoading ||
    !convexAuth.isAuthenticated ||
    !isLoaded ||
    !isOrganizationLoaded ||
    settings === undefined ||
    !organization
  ) {
    const message = convexAuth.isLoading
      ? "A autenticar a tua sessão…"
      : !convexAuth.isAuthenticated
        ? "A ligar à sessão segura…"
        : "A preparar a tua organização…";

    return (
      <View className="items-center gap-2">
        <ActivityIndicator />
        <Text className="text-center">{message}</Text>
      </View>
    );
  }

  return children;
}
