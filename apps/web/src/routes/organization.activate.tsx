import {
  CreateOrganization,
  useOrganization,
  useOrganizationList,
} from "@clerk/react";
import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/organization/activate")({
  component: ActivateOrganizationPage,
});

function ActivateOrganizationPage() {
  const { organization, isLoaded: organizationLoaded } = useOrganization();
  const {
    isLoaded: organizationsLoaded,
    setActive,
    userMemberships,
  } = useOrganizationList({ userMemberships: { infinite: true } });
  const activationStarted = useRef(false);
  const [activationError, setActivationError] = useState(false);
  const memberships = userMemberships?.data ?? [];
  const firstOrganization = memberships[0]?.organization;

  useEffect(() => {
    if (
      !organizationLoaded ||
      !organizationsLoaded ||
      organization ||
      !firstOrganization ||
      !setActive ||
      activationStarted.current
    ) {
      return;
    }

    activationStarted.current = true;
    void setActive({ organization: firstOrganization.id }).catch(() => {
      setActivationError(true);
      activationStarted.current = false;
    });
  }, [
    firstOrganization,
    organization,
    organizationLoaded,
    organizationsLoaded,
    setActive,
  ]);

  if (!organizationLoaded || !organizationsLoaded || firstOrganization) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <p className="text-neutral-600">
          {activationError
            ? "Não foi possível selecionar a organização. Atualize a página para tentar novamente."
            : "A preparar a sua organização…"}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-6 px-6 py-10">
      <div className="text-center">
        <p className="text-sm font-medium text-teal-700">Condo Manager</p>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-950">
          Crie a sua organização
        </h1>
        <p className="mt-2 text-neutral-600">
          É necessária uma organização ativa para continuar.
        </p>
      </div>
      <CreateOrganization afterCreateOrganizationUrl="/" />
    </main>
  );
}
