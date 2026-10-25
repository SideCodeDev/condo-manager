---
applyTo: "apps/mobile/**"
---

# Mobile application

- This is a native-only iOS and Android app built with Expo SDK 57, Expo Router, Clerk, and Convex. Do not treat mobile web as a supported target.
- Define screens in `src/app/` using Expo Router. Keep provider setup and root navigation in `src/app/_layout.tsx`; preserve font loading and the existing splash-screen lifecycle.
- Clerk auth is passed to Convex through `ConvexProviderWithClerk`. Client-side auth or organization selection is for app flow only; enforce identity, organization membership, authorization, and input validation in Convex functions.
- Do not assume an `OrganizationGate` exists. Inspect the current routes and components before changing organization selection or readiness behavior.
- Preserve the NativeWind integration: `src/global.css` is imported by the root layout, and Metro configuration enables NativeWind. Use base UI components from `@condo-manager/ui` and check its exports before introducing another component. If no existing base component fits, ask the user before creating a new reusable UI primitive; compose existing primitives for app-specific interfaces. Use Tailwind/NativeWind classes for fixed visual styling and keep runtime styles only for dynamic values or native API integration.
- Keep the shared global font loading in the root layout. Do not add per-component font-family styles unless a design intentionally uses another typeface.
- Never hand-edit generated `ios/` or `android/` projects. Configure native behavior through `app.json` or config plugins. For Expo or React Native API changes, consult the official documentation matching SDK 57.
- Install or change native dependencies through Expo's installer using pnpm from the repository root. Do not run EAS builds or submissions, change signing credentials, or publish updates unless explicitly requested.
- Use `pnpm dev:ios` or `pnpm dev:android` to start a native target. Relevant checks are `pnpm --filter @condo-manager/mobile lint` and `pnpm --filter @condo-manager/mobile exec tsc --noEmit`.
