# Condo Manager Mobile

Native iOS and Android application built with Expo, Expo Router, Clerk, and
Convex. Mobile web is not a target. Repository-wide setup and architecture are
documented in the root [README](../../README.md); mobile-specific agent rules
are in [AGENTS.md](AGENTS.md).

## Setup

From the monorepo root, install dependencies and create `apps/mobile/.env` from
`.env.example` with:

```dotenv
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
EXPO_PUBLIC_CONVEX_URL=
```

Use a Clerk publishable key for the intended development instance and the URL
of its configured Convex deployment. These values are public client config;
never put Clerk secret keys in this file.

## Run

From the monorepo root:

```sh
pnpm dev:ios
pnpm dev:android
```

The corresponding simulator/emulator must be installed and available. For
physical devices, use the Expo CLI's QR flow after starting the dev server. The
app uses native modules; Expo Go may not include every required module, in which
case use a development build for the project.

## App structure

- `src/app/_layout.tsx`: Clerk and Convex providers, shared DM Sans loading,
  root navigation layout, and NativeWind stylesheet import. The shared
  stylesheet applies DM Sans globally to native text; do not add font-family
  classes or styles to individual components.
- `src/app/index.tsx`: current home screen and sign-in/sign-up entry points.
- `src/components/`: app-specific organization gate, tabs, and billing view.
- `src/global.css` and `metro.config.js`: NativeWind and shared UI styling.

Clerk auth is passed to Convex through `ConvexProviderWithClerk`. Keep queries
and mutations behind authenticated state as appropriate, and enforce access
control in Convex functions regardless of client-side gates.

## Shared UI

Use `@condo-manager/ui` for shared components. Native styles are imported in
`src/global.css`; the root layout loads DM Sans from the shared package. If a
shared component's visuals or API change, update its Storybook stories under
`packages/ui/src/components/`.

## Checks

```sh
pnpm --filter @condo-manager/mobile lint
pnpm --filter @condo-manager/mobile exec tsc --noEmit
```
