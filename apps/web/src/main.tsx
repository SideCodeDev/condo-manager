import "@condo-manager/ui/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { ClerkProvider, useAuth } from "@clerk/react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);
const isClerkSatellite = import.meta.env.VITE_CLERK_IS_SATELLITE === "true";
const clerkSatelliteOptions = isClerkSatellite
  ? {
      isSatellite: true as const,
      domain: import.meta.env.VITE_CLERK_DOMAIN,
      signInUrl: import.meta.env.VITE_CLERK_SIGN_IN_URL,
      signUpUrl: import.meta.env.VITE_CLERK_SIGN_UP_URL,
      satelliteAutoSync: true,
    }
  : {};

if (isClerkSatellite && !clerkSatelliteOptions.domain) {
  throw new Error("VITE_CLERK_DOMAIN is required when the web app is a Clerk satellite.");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      {...clerkSatelliteOptions}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <RouterProvider router={router} />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </StrictMode>,
);
