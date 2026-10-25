import { PricingTable, SignOutButton } from "@clerk/react";
import { api } from "@condo-manager/backend";
import { Button } from "@condo-manager/ui";
import { useQuery as useQueryWithStatus } from "convex-helpers/react";
import { useMutation } from "convex/react";
import type { GenericId } from "convex/values";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    showList: search.showList === true || search.showList === "true",
  }),
  component: HomePage,
});

function HomePage() {
  const { showList } = Route.useSearch();
  const condosQuery = useQueryWithStatus(api.modules.condos.queries.listMine);
  const condos = useMemo(
    () => (condosQuery.isSuccess ? condosQuery.data : []),
    [condosQuery.data, condosQuery.isSuccess],
  );
  const selectCondo = useMutation(
    api.modules.userSettings.mutations.selectCondo,
  );
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSelecting, setIsSelecting] = useState(false);
  const autoOpeningCondoId = useRef<string | null>(null);

  const openCondoRoute = useCallback(
    async (condoId: GenericId<"condos">) => {
      await navigate({
        to: "/",
        search: { showList: true },
        replace: true,
      });
      await navigate({ to: "/condo/$condoId", params: { condoId } });
    },
    [navigate],
  );

  useEffect(() => {
    if (!condosQuery.isSuccess || showList) return;
    const defaultCondo = condos.find((condo) => condo.isDefault);
    if (!defaultCondo || autoOpeningCondoId.current === defaultCondo._id)
      return;
    autoOpeningCondoId.current = defaultCondo._id;
    void openCondoRoute(defaultCondo._id);
  }, [condos, condosQuery.isSuccess, openCondoRoute, showList]);

  async function openCondo(condoId: GenericId<"condos">) {
    setIsSelecting(true);
    setErrorMessage("");
    try {
      await selectCondo({ condoId });
      await openCondoRoute(condoId);
    } catch {
      setErrorMessage(
        "Não foi possível abrir este condomínio. Tente novamente.",
      );
    } finally {
      setIsSelecting(false);
    }
  }

  const isLoading = condosQuery.isPending;
  const queryError = condosQuery.isError ? condosQuery.error : undefined;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-10">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-teal-700">Condo Manager</p>
          <h1 className="mt-1 text-3xl font-semibold text-neutral-950">
            Os meus condomínios
          </h1>
        </div>
        <SignOutButton />
      </header>

      <PricingTable for="organization" />

      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-neutral-600">
            Selecione um condomínio para continuar.
          </p>
          <Link to="/condo/new">
            <Button>Criar condomínio</Button>
          </Link>
        </div>

        {errorMessage ? (
          <p
            className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}

        {queryError ? (
          <p className="rounded-2xl bg-red-50 p-6 text-red-700" role="alert">
            Não foi possível carregar os seus condomínios. {queryError.message}
          </p>
        ) : isLoading ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-neutral-600">
            A carregar os seus condomínios…
          </div>
        ) : condos.length === 1 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
            <p className="text-neutral-600">
              {errorMessage || `A abrir ${condos[0].name}…`}
            </p>
            {errorMessage ? (
              <Button
                className="mt-4"
                onPress={() => void openCondo(condos[0]._id)}
              >
                Tentar novamente
              </Button>
            ) : null}
          </div>
        ) : condos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-14 text-center">
            <h2 className="text-xl font-semibold text-neutral-900">
              Ainda não tem condomínios
            </h2>
            <p className="mx-auto mt-2 max-w-md text-neutral-600">
              Crie o seu primeiro condomínio para começar a gerir o espaço e os
              seus membros.
            </p>
            <Link className="mt-6 inline-flex" to="/condo/new">
              <Button>Criar primeiro condomínio</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {condos.map((condo) => (
              <button
                key={condo._id}
                type="button"
                disabled={isSelecting}
                onClick={() => void openCondo(condo._id)}
                className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:opacity-60"
              >
                {condo.backdropImageAsset?.url ? (
                  <img
                    className="h-44 w-full object-cover"
                    src={condo.backdropImageAsset.url}
                    alt={`Imagem de ${condo.name}`}
                  />
                ) : (
                  <div className="flex h-44 items-end bg-gradient-to-br from-teal-100 via-cyan-50 to-amber-100 p-5">
                    <span className="text-sm font-medium text-teal-900">
                      Condo Manager
                    </span>
                  </div>
                )}
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-neutral-950 group-hover:text-teal-800">
                    {condo.name}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-600">
                    {[condo.address.city, condo.address.postalCode]
                      .filter(Boolean)
                      .join(" · ") || "Morada por definir"}
                  </p>
                  <p className="mt-4 text-sm font-medium text-teal-800">
                    Abrir condomínio →
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
