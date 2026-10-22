import { PricingTable, SignOutButton } from "@clerk/react";
import { Button } from "@condo-manager/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-6 py-10">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-950">Condomínios</h1>
        <SignOutButton />
      </header>
      <section className="flex flex-col items-start gap-4">
        <p className="text-neutral-600">Comece por criar um condomínio.</p>
        <a href="/condo/new">
          <Button>Criar condomínio</Button>
        </a>
        <PricingTable for="organization" />
      </section>
    </main>
  );
}
