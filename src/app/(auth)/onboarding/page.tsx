"use client";

import { onboardUser } from "@/server/actions";
import { mutations } from "@/server/db";
import { useOrganizationList, useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OnboardingPage() {
  const { user } = useUser();
  const orgs = useOrganizationList();
  const router = useRouter();
  const sp = useSearchParams();
  const redirectTo = sp.get("redirect") || "/app";
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    if (!user || !orgs.isLoaded || validating) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValidating(true);

    (async () => {
      // Se já há orgs, apenas garantir active e seguir
      const first = orgs.userMemberships?.data?.[0]?.organization ?? null;
      if (first) {
        await orgs.setActive({ organization: first.id });
        router.replace(redirectTo);
        return;
      }

      // Criar org default
      const name = `Workspace ${user.id}`;

      const created = await orgs.createOrganization({ name });

      await orgs.setActive({ organization: created.id });

      await onboardUser(
        user.id,
        user.emailAddresses[0]?.emailAddress,
        user.firstName,
        user.lastName,
      );

      router.replace(redirectTo);
    })();
  }, [user, orgs.isLoaded, validating]);

  return <div>Setting up your account...</div>;
}
