"use client";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { api } from "@be/api";
import Link from "next/link";
import { useAuthenticatedQuery, useMutation } from "@/lib/data-utils";

export default function Home() {
  return (
    <main className="p-3 grid gap-3">
      <SignedIn>
        <UserButton />
      </SignedIn>
      <h1>
        Welcome to Condo Manager&apos;s app!. Esta pagina corresponde a estar
        logado e dentro a app para fazer coisas
      </h1>
      <Link
        href="/subscriptions"
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg w-fit"
      >
        See subscription plans
      </Link>
      <Content />
    </main>
  );
}

function Content() {
  const {
    data: subscription,
    status,
    error,
  } = useAuthenticatedQuery(
    api.modules.organizations.queries.getCurrentFeatureSet,
  );
  const { data: condos } = useAuthenticatedQuery(
    api.modules.condo.queires.getCondos,
  );

  const { mutate } = useMutation(api.modules.condo.mutations.createCondo, {
    onError: (err) => {
      alert("Error creating condo: " + JSON.stringify(err, null, 2));
    },
  });

  if (status === "pending") return <div>Loading...</div>;
  if (status === "error")
    return (
      <div>
        Error loading subscription info: {JSON.stringify(error, null, 2)}
      </div>
    );
  return (
    <div className="grid gap-2">
      <pre>{JSON.stringify(subscription, null, 2)}</pre>;
      <button
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg w-fit"
        type="button"
        onClick={() => {
          const address = prompt("Enter condo address");
          const name = prompt("Enter condo name");
          if (!address || !name) {
            alert("Address and name are required");
            return;
          }
          mutate({
            address,
            name,
          });
        }}
      >
        Create Condo
      </button>
      <div className="grid gap-2">
        {condos?.map((condo) => (
          <div
            key={condo._id}
            className="p-3 border rounded-lg flex flex-col gap-1"
          >
            <div>Name: {condo.name}</div>
            <div>Address: {condo.address}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
