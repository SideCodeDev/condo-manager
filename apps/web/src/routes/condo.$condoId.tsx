import { api } from "@condo-manager/backend";
import type { GenericId } from "convex/values";
import { useQuery as useQueryWithStatus } from "convex-helpers/react";
import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GlassButton } from "@condo-manager/ui";
import { ArrowLeft, Bell, Layers, Settings, Users } from "lucide-react-native";
import condoBg from "../assets/condo-bg.svg";
export const Route = createFileRoute("/condo/$condoId")({
  component: CondoPage,
});

function CondoPage() {
  const { condoId } = Route.useParams();
  // Convex validates this route value against the `condos` ID type on the server.
  const condoQuery = useQueryWithStatus(api.modules.condos.queries.getById, {
    condoId: condoId as GenericId<"condos">,
  });
  const navigate = useNavigate();
  const isReturningHome = useRef(false);
  const backdropImageUrl = condoQuery.isSuccess
    ? condoQuery.data?.backdropImageAsset?.url
    : undefined;
  const [backdropImageFailed, setBackdropImageFailed] = useState(false);

  useEffect(() => {
    setBackdropImageFailed(false);
  }, [backdropImageUrl, condoId]);

  useEffect(() => {
    if (
      !condoQuery.isSuccess ||
      condoQuery.data !== null ||
      isReturningHome.current
    )
      return;
    isReturningHome.current = true;
    void navigate({
      to: "/",
      search: { showList: true, acceptCondoInvite: false },
      replace: true,
    });
  }, [condoQuery, navigate]);

  if (condoQuery.isPending) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-10">
        <p className="text-neutral-600">A carregar o condomínio…</p>
      </main>
    );
  }

  if (condoQuery.isError) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-10">
        <p className="text-red-700" role="alert">
          Não foi possível carregar o condomínio. {condoQuery.error.message}
        </p>
      </main>
    );
  }

  if (condoQuery.data === null) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-10">
        <p className="text-neutral-600">A regressar aos seus condomínios…</p>
      </main>
    );
  }

  const condo = condoQuery.data;

  return (
    <main className="min-h-dvh-safe w-dvw bg-neutral-50">
      <header className="sticky top-0 h-[200px] w-full overflow-hidden bg-primary">
        <img
          className="absolute inset-0 size-full object-cover"
          src={
            backdropImageFailed || !backdropImageUrl
              ? condoBg
              : backdropImageUrl
          }
          alt=""
          aria-hidden="true"
          onError={() => setBackdropImageFailed(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        <div className="size-full relative isolate flex flex-col items-stretch justify-end">
          <div className="grid gap-1 px-3.5 py-5">
            <div className="flex items-center gap-5">
              <GlassButton asChild className="size-8 p-1.5">
                <Link
                  to="/"
                  search={{ showList: true, acceptCondoInvite: false }}
                  replace
                >
                  <ArrowLeft />
                </Link>
              </GlassButton>
              <GlassButton className="ml-auto size-8 p-1.5">
                <Bell />
              </GlassButton>
              <GlassButton className="size-8 p-1.5">
                <Settings />
              </GlassButton>
            </div>
            <h1 className="font-h4 color-white font-bold">{condo.name}</h1>
            <div className="flex items-center gap-3">
              <GlassButton>
                <Users /> Inquilinos
              </GlassButton>
              <GlassButton>
                <Layers /> Andares
              </GlassButton>
            </div>
          </div>
        </div>
      </header>
    </main>
    // <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-10">
    //   <Link
    //     className="w-fit text-sm font-medium text-teal-800 hover:text-teal-950"
    //     to="/"
    //     search={{ showList: true }}
    //     replace
    //   >
    //     ← Os meus condomínios
    //   </Link>
    //   <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
    //     {condo.backdropImageAsset?.url ? (
    //       <img
    //         className="h-64 w-full object-cover sm:h-80"
    //         src={condo.backdropImageAsset.url}
    //         alt={`Imagem de ${condo.name}`}
    //       />
    //     ) : (
    //       <div className="flex h-64 items-end bg-gradient-to-br from-teal-100 via-cyan-50 to-amber-100 p-8 sm:h-80">
    //         <span className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-teal-900">
    //           Condo Manager
    //         </span>
    //       </div>
    //     )}
    //     <div className="flex flex-col gap-6 p-6 sm:p-10">
    //       <div>
    //         <p className="text-sm font-medium text-teal-700">
    //           Área do condomínio
    //         </p>
    //         <h1 className="mt-2 text-3xl font-semibold text-neutral-950 sm:text-4xl">
    //           {condo.name}
    //         </h1>
    //         <p className="mt-3 text-neutral-600">
    //           {condo.address.street}, {condo.address.postalCode}{" "}
    //           {condo.address.city}
    //         </p>
    //       </div>
    //       <div className="grid gap-4 rounded-2xl bg-neutral-50 p-5 sm:grid-cols-2">
    //         <div>
    //           <p className="text-sm text-neutral-500">Localidade</p>
    //           <p className="mt-1 font-medium text-neutral-900">
    //             {condo.address.city || "Por definir"}
    //           </p>
    //         </div>
    //         <div>
    //           <p className="text-sm text-neutral-500">Código postal</p>
    //           <p className="mt-1 font-medium text-neutral-900">
    //             {condo.address.postalCode || "Por definir"}
    //           </p>
    //         </div>
    //         <div>
    //           <p className="text-sm text-neutral-500">Criado em</p>
    //           <p className="mt-1 font-medium text-neutral-900">
    //             {new Date(condo.createdAt).toLocaleDateString("pt-PT")}
    //           </p>
    //         </div>
    //         <div>
    //           <p className="text-sm text-neutral-500">Estado</p>
    //           <p className="mt-1 font-medium text-neutral-900">
    //             Pronto a configurar
    //           </p>
    //         </div>
    //       </div>
    //       <p className="text-sm text-neutral-500">
    //         Esta área está em preparação. Em breve poderá gerir aqui o seu
    //         condomínio.
    //       </p>
    //     </div>
    //   </section>
    // </main>
  );
}
