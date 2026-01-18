import { auth, clerkClient } from "@clerk/nextjs/server";

interface SubscriptionPlan {
  id: string;
  features: {
    maxNumberOfCondos: number | "unlimited";
  };
}

export async function getActiveSubscription(): Promise<SubscriptionPlan | null> {
  const { isAuthenticated, orgId } = await auth();
  if (!isAuthenticated || !orgId) return null;

  const client = await clerkClient();
  const billing =
    await client.billing.getOrganizationBillingSubscription(orgId);

  const activePlan = billing.subscriptionItems.find(
    (itm) => itm.status === "active",
  )?.plan;

  if (!activePlan || activePlan.slug === "free") return null;

  return {
    id: activePlan.slug,
    features: {
      maxNumberOfCondos: getMaxNumberOfCondosFeature(activePlan.features),
    },
  };
}

function getMaxNumberOfCondosFeature(
  features: { slug: string }[],
): SubscriptionPlan["features"]["maxNumberOfCondos"] {
  const maxNumberOfCondosFeatureKey = "max_condominiums_";
  const slug = features
    .map((feat) => feat.slug)
    .find(
      (s) => typeof s === "string" && s.startsWith(maxNumberOfCondosFeatureKey),
    );

  if (!slug) return 0;

  const slugValue = slug.replace(maxNumberOfCondosFeatureKey, "");
  if (slugValue === "unlimited") return "unlimited";
  const n = Number(slugValue);
  return Number.isFinite(n) ? n : 0;
}
