import { SignOutButton } from "@clerk/react";
import { Button, TabContent, TabItem, Tabs } from "@condo-manager/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <SignOutButton />
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
    </>
  );
}
