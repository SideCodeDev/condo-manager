"use client";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { api } from "@convex/api";
import { useQuery } from "convex/react";
import Link from "next/link";

export default function Home() {
  const subscription = useQuery(api.billing.getActiveSubscription);

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
