import { api } from "@condo-manager/backend";
import { useMutation, useQuery } from "convex/react";
import type { GenericId } from "convex/values";
import { useEffect, useRef } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/condo/$condoId")({
  component: CondoPage,
});

function CondoPage() {
  const { condoId } = Route.useParams();
  // Convex validates this route value against the `condos` ID type on the server.
  const condo = useQuery(api.modules.condos.queries.getById, {
    condoId: condoId as GenericId<"condos">,
  });
  const clearSelectedCondo = useMutation(
    api.modules.userSettings.mutations.clearSelectedCondo,
  );
  const navigate = useNavigate();
  const isReturningHome = useRef(false);

  useEffect(() => {
    if (condo !== null || isReturningHome.current) return;
    isReturningHome.current = true;
    void clearSelectedCondo()
      .catch(() => null)
      .finally(() => {
        void navigate({ to: "/", search: { showList: false }, replace: true });
      });
  }, [clearSelectedCondo, condo, navigate]);

  if (condo === undefined || condo === null) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-10">
        <p className="text-neutral-600">
          {condo === undefined
            ? "A carregar o condomínio…"
            : "A regressar aos seus condomínios…"}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-10">
      <Link
        className="w-fit text-sm font-medium text-teal-800 hover:text-teal-950"
        to="/"
        search={{ showList: true }}
        replace
      >
        ← Os meus condomínios
      </Link>
      <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        {condo.backdropImageAsset?.url ? (
          <img
            className="h-64 w-full object-cover sm:h-80"
            src={condo.backdropImageAsset.url}
            alt={`Imagem de ${condo.name}`}
          />
        ) : (
          <div className="flex h-64 items-end bg-gradient-to-br from-teal-100 via-cyan-50 to-amber-100 p-8 sm:h-80">
            <span className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-teal-900">
              Condo Manager
            </span>
          </div>
        )}
        <div className="flex flex-col gap-6 p-6 sm:p-10">
          <div>
            <p className="text-sm font-medium text-teal-700">
              Área do condomínio
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-neutral-950 sm:text-4xl">
              {condo.name}
            </h1>
            <p className="mt-3 text-neutral-600">
              {condo.address.street}, {condo.address.postalCode}{" "}
              {condo.address.city}
            </p>
          </div>
          <div className="grid gap-4 rounded-2xl bg-neutral-50 p-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-neutral-500">Localidade</p>
              <p className="mt-1 font-medium text-neutral-900">
                {condo.address.city || "Por definir"}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Código postal</p>
              <p className="mt-1 font-medium text-neutral-900">
                {condo.address.postalCode || "Por definir"}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Criado em</p>
              <p className="mt-1 font-medium text-neutral-900">
                {new Date(condo.createdAt).toLocaleDateString("pt-PT")}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Estado</p>
              <p className="mt-1 font-medium text-neutral-900">
                Pronto a configurar
              </p>
            </div>
          </div>
          <p className="text-sm text-neutral-500">
            Esta área está em preparação. Em breve poderá gerir aqui o seu
            condomínio.
          </p>
        </div>
      </section>
    </main>
  );
}
