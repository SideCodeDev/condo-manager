import { useOrganization, useOrganizationList } from "@clerk/react";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useRef, type ReactNode } from "react";
import { api } from "../../convex/_generated/api";

type OrganizationGateProps = {
  children: ReactNode;
};

export function OrganizationGate({ children }: OrganizationGateProps) {
  const settings = useQuery(api.modules.userSettings.queries.getCurrent);
  const provisioning = useQuery(
    api.modules.organizations.queries.getProvisioningStatus,
  );
  const saveSelectedOrganization = useMutation(
    api.modules.userSettings.mutations.selectOrganization,
  );
  const { organization } = useOrganization();
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
    const interval = window.setInterval(() => {
      void revalidateMemberships();
    }, 1_000);

    return () => window.clearInterval(interval);
  }, [isLoaded, organization, provisioning, userMemberships.revalidate]);

  useEffect(() => {
    if (!isLoaded || settings === undefined) return;

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
    organization,
    saveSelectedOrganization,
    setActive,
    settings,
    userMemberships.data,
  ]);

  if (provisioning?.status === "failed") {
    return <p>Não foi possível preparar a organização.</p>;
  }

  if (!isLoaded || settings === undefined || !organization) {
    return <p>A preparar a tua organização…</p>;
  }

  return children;
}
