import { RedirectToSignIn, Show, useOrganization } from "@clerk/react";
import {
  createRootRoute,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { isLoaded, organization } = useOrganization();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const isOrganizationRoute = pathname === "/organization/activate";

  useEffect(() => {
    if (isLoaded && organization && isOrganizationRoute) {
      void navigate({
        to: "/",
        search: { showList: false, acceptCondoInvite: false },
        replace: true,
      });
      return;
    }
    if (isLoaded && !organization && !isOrganizationRoute) {
      void navigate({ to: "/organization/activate", replace: true });
    }
  }, [isLoaded, isOrganizationRoute, navigate, organization]);

  return (
    <>
      <Show when="signed-in">
        {isLoaded && (organization || isOrganizationRoute) ? <Outlet /> : null}
      </Show>
      <Show when="signed-out">
        <RedirectToSignIn />
      </Show>
    </>
  );
}
