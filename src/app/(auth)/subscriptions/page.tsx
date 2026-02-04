import { PricingTable } from "@clerk/nextjs";

export default function PricingPage() {
  return (
    <main className="w-dvw h-dvh grid place-items-center">
      <PricingTable for="organization" newSubscriptionRedirectUrl="/app" />
    </main>
  );
}
