# Condo Manager — Agent Guide

This guide applies to the entire repository. Read it before changing code or
configuration. `CLAUDE.md` includes this file; app-specific Copilot guidance is
in `.github/instructions/`.

## Working in this repository

- Preserve unrelated user changes. Inspect `git status` and the relevant diff
  before editing; do not reset, overwrite, or clean up work outside the request.
- Use `pnpm` exclusively from the repository root. The package manager is pinned
  to `pnpm@11.18.0` in the root `package.json`.
- Keep changes focused. Follow existing patterns and shared configs instead of
  introducing parallel abstractions or duplicated configuration.
- Do not add or run tests unless the user asks you to test or verify the change.
  When asked to verify, run the narrowest relevant checks and report what ran.
- Consult official documentation for framework/library APIs when changing their
  use. For Expo or React Native APIs, use documentation matching the Expo SDK
  version in `apps/mobile/package.json`.

## Repository map

- `apps/web`: authenticated React 19 + Vite application. Uses TanStack Router,
  Clerk, Convex, and `@condo-manager/ui`.
- `apps/website`: sales and marketing application built with TanStack Start and
  Clerk. It is separate from the authenticated product app.
- `apps/mobile`: native-only iOS and Android application built with Expo SDK 57,
  Expo Router, Clerk, Convex, and NativeWind. Mobile web is not a target.
- `packages/backend`: Convex schema, functions, HTTP routes, Clerk projections,
  and application data. Source is under `packages/backend/convex/`.
- `packages/ui`: cross-platform React Native UI components, styles, Tailwind
  tokens, fonts, hooks, utilities, and Storybook.
- `packages/eslint-config`, `packages/prettier-config`, and
  `packages/typescript-config`: shared repository tooling configuration.
- `pnpm-workspace.yaml`: workspace membership, third-party dependency catalog,
  and pnpm policy. Root `CLAUDE.md` and app/package READMEs provide setup
  context; keep them accurate when architecture or setup changes.

## Architecture and data flow

- Clerk is the source of truth for identities, organizations, memberships, and
  billing subscriptions. Convex stores application data and projections synced
  from Clerk.
- The Clerk webhook is `POST /clerk/webhook` in `packages/backend/convex/http.ts`.
  It verifies webhook signatures and synchronizes supported user, organization,
  membership, subscription, and subscription-item events. Keep synchronization
  idempotent because events can be repeated or arrive out of order.
- Authenticated clients pass Clerk auth to Convex using
  `ConvexProviderWithClerk`. Convex functions must derive identity from the
  authenticated context, typically through
  `packages/backend/convex/authProvider/users/currentUser.ts`.
- For client-side reactive queries in web and mobile, use `useQuery` from
  `convex-helpers/react` so screens handle pending, success, and error states
  explicitly. Use `makeUseQueryWithStatus(useQueries)` when a custom query-hook
  implementation is needed. Keep using hooks from `convex/react` for client/auth
  primitives and mutations when `convex-helpers` has no equivalent.
- The mobile and web condo-selection flow currently stores
  `userSettings.selectedCondoId`. The current code does not implement an
  `OrganizationGate` or `selectedClerkOrganizationId`; organization and condo
  selection are handled by the existing routes and queries. Inspect current
  code before changing this flow, and do not treat client-side selection or
  route guards as security boundaries.
- Keep app routing, authentication, billing, and Convex logic out of
  `packages/ui`. The shared UI package is consumed by apps, not the other way
  around.

## Security and backend rules

- Enforce identity, organization membership, condo membership, role checks, and
  authorization in Convex functions. Never trust a client-provided organization,
  condo, user, or asset ID without checking the caller's access to it.
- Validate public function inputs with Convex validators. Keep public functions
  focused on authenticated application operations and use internal functions for
  trusted synchronization or server-only work.
- Prefer indexed Convex queries to unbounded filtering. Add or use indexes in
  the relevant table schema for lookup paths that need them.
- Normalize nullable third-party values before passing them to Convex validators:
  represent absent `v.optional(...)` values as `undefined`, not `null`.
- Use structured logging through the backend logging helper. Do not persist
  webhook events solely for logging or deduplication unless product requirements
  explicitly change.
- Never manually edit `packages/backend/convex/_generated/`. Do not run Convex
  code generation, `convex dev`, `convex deploy`, migrations, webhook replays,
  or database cleanup unless the user explicitly requests that exact action.
- Never delete or reset Clerk or Convex data without explicit approval.

## Shared UI, styling, and components

- Use base UI components from `@condo-manager/ui` and inspect its public exports
  in `packages/ui/src/index.ts` before introducing another component. If no
  existing base component fits, ask the user before creating a new reusable UI
  primitive. Build app-specific interfaces by composing existing primitives.
- Keep `packages/ui` platform-independent from app routing, authentication,
  billing, and backend concerns. Export public APIs through the package entry
  points. Use `.web` modules only when a platform-specific implementation is
  required by the underlying platform.
- Tailwind CSS v4 tokens in `packages/ui/src/styles.base.css` are the shared
  source of truth for visual design across web and native. Do not create a
  parallel TypeScript theme or duplicate token values in component styles.
- Prefer `className` with Tailwind/NativeWind utilities for fixed visual styles.
  Use `style` or `StyleSheet.create` only for computed runtime values or native
  API integration, and keep those styles limited to those values. The shared
  `Loader` retains its numeric `size` prop and runtime animation styles.
- Use the same Tailwind class-based visual behavior on web, React Native Web, and
  native React Native. Do not branch fixed visual styles by platform or pass
  token colors through `color`, `backgroundColor`, or similar style props. For
  SVG icons, including Lucide, use Tailwind text-color classes and state classes
  through `className`; avoid conflicting icon `color` props.
- Define the default DM Sans family once in the shared global styles: on `body`
  for web and through the native text base rule for React Native. Do not repeat
  font-family classes or styles on components unless a design intentionally
  uses another typeface.
- Add or update Storybook stories when a shared component's visible behavior,
  public API, or variants change. Keep stories with the component under
  `packages/ui/src/components/` and design-token stories under
  `packages/ui/src/stories/`.
- Preserve the platform file-upload behavior: native uses Expo Document Picker;
  web uses the `.web` implementation. Keep the public file shape consistent.

## App-specific guidance

### `apps/web`

- `src/main.tsx` composes Clerk, Convex, and TanStack Router providers. Keep
  application-level provider setup there.
- Define routes under `src/routes/`. `src/routeTree.gen.ts` is generated by the
  TanStack Router plugin; do not edit it by hand.
- The shared web stylesheet is imported once from `@condo-manager/ui/styles.css`.
- Only expose client-safe settings through `VITE_*` variables. Never put Clerk
  secret keys or webhook secrets in client configuration.

### `apps/website`

- Define TanStack Start routes under `src/routes/`. Treat
  `src/routeTree.gen.ts` as generated and do not edit it by hand.
- `src/routes/__root.tsx` owns the document shell, Clerk provider, and shared
  stylesheet reference. `src/start.ts` configures Clerk request middleware and
  CSRF protection for server functions; preserve these protections.
- Enforce authorization in server functions and protected server routes. Signed-
  in presentation state alone is not authorization.
- `CLERK_SECRET_KEY` is server-only. Never expose it through a `VITE_*` variable
  or commit it.

### `apps/mobile`

- Define screens and navigation in `src/app/` with Expo Router. Keep providers,
  root navigation, font loading, and splash-screen lifecycle in
  `src/app/_layout.tsx`.
- Preserve NativeWind integration: Metro config enables NativeWind, and
  `src/global.css` imports the shared native stylesheet. The root layout loads
  the shared DM Sans font before rendering the app.
- Do not assume an `OrganizationGate` exists. Check current route/component code
  when changing organization or condo readiness and selection behavior.
- Expo generates native `ios/` and `android/` directories as needed. Do not
  create or hand-edit generated native projects; use `app.json` or config
  plugins. Expo Go may not include all modules used by this app.
- Install or change native dependencies with Expo's installer via pnpm from the
  repository root: `pnpm --filter @condo-manager/mobile exec expo install
<package>`. Check Expo SDK compatibility and the resulting manifest/lockfile.
- Do not run EAS builds or submissions, change signing credentials, or publish
  updates unless explicitly requested.

### `packages/backend`

- Define the Convex schema in `convex/schema.ts`; keep domain tables and
  functions organized in `convex/modules/` and Clerk synchronization in
  `convex/authProvider/`.
- HTTP endpoints are registered in `convex/http.ts`. Verify third-party webhook
  signatures before processing payloads and normalize optional fields at the
  integration boundary.
- Keep trusted Clerk API calls and synchronization in internal functions/actions.
  Public functions should validate caller identity and access before reading or
  mutating organization-scoped data.

### `packages/ui`

- Keep public component exports in `src/index.ts` and package exports in
  `package.json`. Keep shared CSS entry points `styles.css` and
  `styles.native.css` aligned with their consumers.
- Define shared Tailwind tokens in `src/styles.base.css`. Preserve the web and
  native stylesheet entry points and test both bundling paths when CSS imports or
  platform-specific modules change.
- The Expo app imports the native stylesheet via `apps/mobile/src/global.css`
  and configures Metro in `apps/mobile/metro.config.js`; web apps import the web
  stylesheet once at their entry/root route.

## Dependencies and shared configuration

- Declare every dependency in the package that imports it; workspace hoisting is
  not a substitute for a direct dependency.
- Use `workspace:*` for internal `@condo-manager/*` dependencies. Use
  `catalog:` for third-party versions shared across packages, and keep
  app-specific or SDK-constrained versions in the consuming package.
- Keep the root pnpm lockfile authoritative. Do not use npm or yarn.
- Keep common lint, TypeScript, and formatting rules in the shared config
  packages. App configs should compose shared presets and contain only necessary
  framework-specific settings. Preserve Expo's TypeScript base configuration.

## Environment and external state

- Use each `.env.example` as the source for variable names. Never commit secrets
  or paste secret values into code, logs, or documentation. Document variable
  names only.
- Web and mobile client variables are public configuration. Keep Clerk secret
  keys and webhook signing secrets server-side in the relevant Clerk/Convex
  environment.
- For Expo or React Native APIs, check the installed Expo SDK version and its
  matching official documentation. Use current official documentation for
  other changing external APIs.
- Do not run deployment, publishing, credential, external data mutation, or
  cleanup actions unless the user explicitly authorizes that exact action.

## Common commands

Run these from the repository root. Use the narrowest relevant command.

```sh
pnpm dev:web
pnpm dev:website
pnpm dev:backend
pnpm dev:ui
pnpm dev:ios
pnpm dev:android

pnpm --filter @condo-manager/web build
pnpm --filter @condo-manager/website build
pnpm --filter @condo-manager/backend check-types
pnpm --filter @condo-manager/ui check-types
pnpm --filter @condo-manager/ui lint
pnpm --filter @condo-manager/ui test-storybook
pnpm --filter @condo-manager/ui storybook:build
pnpm --filter @condo-manager/mobile lint
pnpm --filter @condo-manager/mobile exec tsc --noEmit
```

There is no root `dev:mobile` command; use `dev:ios`, `dev:android`, or the
mobile package's `start` script. The website has a build script but no package-
local lint/type-check script. The web app has a build script but no package-local
lint script. Check package manifests before assuming other scripts exist.

## Implementation quality

- Keep components and functions small, direct, and named for their purpose.
- Keep orchestration such as authentication and data readiness in providers,
  hooks, or route-level boundaries; keep page components focused on rendering
  and feature behavior.
- Preserve strict TypeScript types. Avoid `any`, non-null assertions, and broad
  casts unless a documented integration boundary requires them.
- Handle loading, empty, error, and unauthorized states explicitly.
- Add tests for meaningful behavior and regressions when requested; test behavior
  rather than implementation details.
- Update the relevant README when setup, architecture, commands, or external
  configuration changes.
