"use client";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { api } from "@be/api";
import Link from "next/link";
import { useAuthenticatedQuery } from "@/lib/data-utils";

export default function Home() {
  const {
    data: subscription,
    status,
    error,
  } = useAuthenticatedQuery(api.organization.getCurrentFeatureSet);

  if (status === "pending") return <div>Loading...</div>;
  if (status === "error")
    return (
      <div>
        Error loading subscription info: {JSON.stringify(error, null, 2)}
      </div>
    );
  return (
    <main className="p-3 grid gap-3">
      <SignedIn>
        <UserButton />
      </SignedIn>
      <h1>
        Welcome to Condo Manager&apos;s app!. Esta pagina corresponde a estar
        logado e dentro a app para fazer coisas
      </h1>
      <pre>{JSON.stringify(subscription, null, 2)}</pre>
      <Link
        href="/subscriptions"
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg w-fit"
      >
        See subscription plans
      </Link>
    </main>
  );
}
