# Condo Manager — Agent Guide

This is the repository's only `AGENTS.md` guide. It applies to the whole
repository, including every app and package.

## Scope

- Preserve unrelated user changes. Do not rewrite or remove existing work merely
  to make a task easier.
- Use `pnpm` exclusively. The pinned package manager is declared in the root
  `package.json`.

## Repository map

- `apps/web`: the main React 19 + Vite application. Authentication,
  organizations, and billing come from Clerk; it calls the shared Convex backend.
- `apps/mobile`: the native-only Expo / React Native iOS and Android
  application, which can connect to the same Convex backend. It uses Expo
  Router, with route files in `src/app/` and providers in `_layout.tsx`.
- `apps/website`: TanStack Start sales/marketing application.
- `packages/backend`: the Convex project, including schema, functions, and HTTP
  routes. Its Convex source lives in `packages/backend/convex/`.
- `packages/ui`: cross-platform React Native UI, fonts, helpers, styles, and
  Storybook, consumed by the Vite web apps and the Expo app. Keep it independent
  of app routing, authentication, billing, and backend concerns.
- `packages/eslint-config`: shared ESLint base plus React/Vite and TanStack
  presets.
- `packages/prettier-config`: shared Prettier configuration.
- `packages/typescript-config`: shared TypeScript configurations.
- `pnpm-workspace.yaml`: workspace membership and the centralized dependency
  catalog. Put versions shared by multiple packages in the catalog.

## Architecture rules

- Clerk is the source of truth for identities, organizations, memberships, and
  billing subscriptions.
- Convex stores the application data and local projections needed by the app.
  Webhook handlers must be idempotent because delivery may be repeated or arrive
  out of order.
- The active organization preference is stored in Convex as
  `userSettings.selectedClerkOrganizationId`. The mobile app's
  `OrganizationGate` handles organization readiness and selection. Client-side
  gates are not security boundaries.
- Enforce organization membership and authorization in Convex functions. Never
  rely only on a client-provided organization ID.
- Normalize nullable third-party payload fields before passing them to Convex
  validators: use `undefined` for absent `v.optional(...)` values rather than
  `null`.
- Prefer indexed Convex queries over unbounded filtering and keep public
  functions thin; put trusted synchronization work in internal functions.
- Do not add webhook-event persistence solely for logging or deduplication. Use
  structured logs unless the product requirements explicitly change.

## Generated code and external state

- Do not manually edit files in `packages/backend/convex/_generated/`.
- Do not run `convex dev`, `convex deploy`, Convex code generation, migrations,
  webhook replays, or database cleanup unless the user explicitly asks for that
  exact action.
- Never delete or reset Clerk or Convex data without explicit approval.
- Never commit secrets. Refer only to environment variable names such as
  `CLERK_SECRET_KEY` and `CLERK_WEBHOOK_SIGNING_SECRET`.
- For Expo or React Native API changes, check the Expo SDK version in
  `apps/mobile/package.json` and consult the matching versioned official Expo
  documentation. For APIs outside Expo, consult their current official docs.
- Install or change native dependencies through Expo's installer, invoked with
  pnpm from the repository root: `pnpm --filter @condo-manager/mobile exec expo
  install <package>`. Verify the package manifest and lockfile, and preserve
  Expo SDK compatibility and the workspace dependency catalog.
- The mobile app's `src/global.css` is imported by `src/app/_layout.tsx`, and
  Metro's NativeWind integration is configured in `apps/mobile/metro.config.js`.
  Preserve these integration points and the root layout's font loading.
- Expo generates the `ios/` and `android/` native project directories when
  needed. Do not create or hand-edit generated native directories; configure
  native behavior through `app.json` or config plugins. Expo Go may not include
  every native module, so use the development-build workflow when required.
- Do not run EAS builds or submissions, change signing credentials, or publish
  updates unless the user explicitly requests that external action.

## Dependency and package conventions

- Add a dependency to the package that imports it. Hoisting is not a substitute
  for declaring direct dependencies.
- Use `workspace:*` for internal `@condo-manager/*` packages.
- Use `catalog:` for centrally managed third-party versions.
- Keep the universal UI package free of app-specific routing, authentication,
  billing, and Convex concerns. Export public APIs through `packages/ui` entry
  points and include platform-specific files only where behavior must differ.
- Use Tailwind CSS v4 tokens as the single source of truth for visual styling
  across web and native mobile. Apply colors, typography, spacing, borders,
  shadows, and other visual tokens with Tailwind/NativeWind class names; do not
  add or use a parallel TypeScript `theme`/design-token folder or read color
  values into component styles. Define or change shared tokens in the UI
  package's Tailwind CSS theme, and consume them through classes on both
  platforms.
- Prefer Tailwind/NativeWind `className` for fixed visual styling across every
  app and package. Use `style` props or `StyleSheet.create` only when a value is
  genuinely computed at runtime or required by a native API, and keep those
  styles limited to the dynamic/integration values. Do not duplicate fixed
  Tailwind utilities or design-token values in style objects. The shared
  `Loader` keeps its numeric `size` prop for dimensions and its runtime
  animation styles.
- Use the web Tailwind class-based styling model for all visual behavior in
  React, React Native Web, and React Native. Do not branch visual styles by
  platform or pass token colors through `color`, `backgroundColor`, or similar
  props. For SVG icons, apply the matching Tailwind text-color class with
  `className` so the icon uses the same color as its text; remove or avoid a
  conflicting `color` prop. Keep hover, focus, active, and disabled colors in
  Tailwind state classes, including when forwarding classes to child icons.
- Set the app's default font once in the shared global stylesheet: on `body`
  for `apps/web` and `apps/website`, and through the native global base rule
  for React Native text. Font family is global; do not repeat `font-sans` or
  `fontFamily` on individual components. Tailwind classes may still set font
  size and weight. Add a local family override only when the design
  intentionally requires a different typeface.
- Add or update Storybook stories when a shared component's visible behavior or
  public variants change.
- Keep Expo/React Native dependency versions compatible with the Expo SDK in
  `apps/mobile/package.json`. Use Expo's installer through pnpm for native
  packages; do not bypass the workspace package manager.
- Keep lint, TypeScript, and Prettier rules in their shared config packages.
  App configs should only compose a shared preset with unavoidable framework
  settings; do not copy common rules into individual apps. The Expo app should
  retain Expo's TypeScript base config and add only app-specific options.

## Common commands

Run commands from the repository root:

```sh
pnpm dev:web
pnpm dev:website
pnpm dev:backend
pnpm dev:ios
pnpm dev:android
pnpm dev:ui
pnpm --filter @condo-manager/web build
pnpm --filter @condo-manager/ui check-types
pnpm --filter @condo-manager/ui lint
pnpm --filter @condo-manager/ui storybook:build
pnpm --filter @condo-manager/mobile lint
pnpm --filter @condo-manager/mobile exec tsc --noEmit
```

Prefer the narrowest relevant check while iterating, then run all checks affected
by the change. A production build is not a substitute for focused tests.
There is no root `dev:mobile` script; use `dev:ios` or `dev:android` (or run the
mobile package's `start` script when you only need the Expo dev server).

## Implementation style

- Keep components and functions small, direct, and named after their purpose.
- Keep orchestration such as authentication and organization readiness in gates
  or hooks, leaving page components focused on rendering features.
- Reuse `@condo-manager/ui` before adding app-local primitives.
- Preserve strict TypeScript types. Avoid `any`, non-null assertions, and broad
  type casts unless there is a documented boundary that requires one.
- Handle loading, empty, error, and unauthorized states explicitly.
- Add tests for behavior with meaningful branching or regressions; do not test
  implementation details.

## Definition of done

- Relevant type, lint, build, Storybook, and test checks pass, or any check that
  could not be run is reported clearly.
- Public package exports and dependency declarations are complete.
- Security-sensitive paths validate identity, organization membership, and input
  at the server boundary.
- Documentation is updated when architecture, commands, or conventions change.
