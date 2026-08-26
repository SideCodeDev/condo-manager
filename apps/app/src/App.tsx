import { RedirectToSignIn, Show, SignOutButton } from "@clerk/react";
import { BillingOverview } from "./components/billing-overview";
import { OrganizationGate } from "./components/organization-gate";

export function App() {
  return (
    <>
      <Show when="signed-in">
        <OrganizationGate>
          <div className="grid gap-2">
            <SignOutButton />
            <BillingOverview />
          </div>
        </OrganizationGate>
      </Show>

      <Show when="signed-out">
        <RedirectToSignIn />
      </Show>
    </>
  );
}
