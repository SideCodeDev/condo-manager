import { RedirectToSignIn, Show, SignOutButton } from "@clerk/react";
import { OrganizationGate } from "./components/organization-gate";
import { Button, TabItem, Tabs, TabContent } from "@condo-manager/ui";
import { BillingOverview } from "./components/billing-overview";

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
        <Button>HELLO WORLD</Button>
        <Tabs variant="line-spaced" initialValue="tab1">
          <TabItem value="tab1" aria-label="Home">
            Home
          </TabItem>
          <TabItem value="tab2" aria-label="Profile">
            Profile
          </TabItem>
          <TabItem value="tab3" aria-label="Settings">
            Settings
          </TabItem>
          <TabContent value="tab1">
            <div className="p-4">Home Content</div>
          </TabContent>
          <TabContent value="tab2">
            <div className="p-4">Profile Content</div>
          </TabContent>
          <TabContent value="tab3">
            <div className="p-4">Settings Content</div>
          </TabContent>
        </Tabs>
      </Show>
      <Show when="signed-out">
        <RedirectToSignIn />
      </Show>
    </>
  );
}
