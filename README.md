# Condo Manager

Condo Manager is a pnpm monorepo containing web and native applications, a
shared cross-platform UI library, and a Convex backend. `_old/` is an archive
and is not part of the current workspace or a source of truth.

## Workspace

```text
apps/
  web/                 React + Vite authenticated web application
  website/             TanStack Start sales/marketing application
  mobile/              Expo / React Native app for iOS and Android
packages/
  backend/             Convex schema, functions, and HTTP routes
  ui/                  Cross-platform components, tokens, fonts, and Storybook
  eslint-config/       Shared ESLint and Prettier configuration
  typescript-config/   Shared TypeScript configurations
```

Internal packages use the `@condo-manager/*` scope and `workspace:*`. Shared
third-party versions belong in `pnpm-workspace.yaml`'s catalog; keep
single-project or SDK-specific versions in the package that uses them.

## Stack and architecture

- pnpm `11.18.0` workspaces, React 19, and TypeScript
- React Native + Expo for iOS and Android (mobile web is not a target)
- Vite for the authenticated web app; TanStack Start for the marketing website
- Clerk for authentication, organizations, memberships, and billing
- Convex for application data and Clerk-synchronized projections
- Tailwind CSS 4 / NativeWind 5 for shared styling
- Storybook, Vitest, and Playwright for the shared UI package

Clerk is the source of truth for identities, organizations, memberships, and
billing subscriptions. Convex stores application data and local projections.
Enforce organization membership and authorization in Convex functions; never
trust a client-provided organization ID by itself. The frontend organization
gate reconciles the selected organization preference in
`userSettings.selectedClerkOrganizationId` with the active Clerk session.

The Convex source is in `packages/backend/convex/`. Clerk webhooks synchronize
users, organizations, memberships, and billing data. Handlers should remain
idempotent because webhook delivery can be repeated or arrive out of order.

## Requirements and setup

- Node.js compatible with pnpm 11
- pnpm `11.18.0` (pinned in the root `package.json`)
- Clerk development instance; configure Organizations and Billing as needed
- Convex project/deployment configured for `packages/backend`

Install from the repository root:

```sh
pnpm install
```

Copy the relevant `.env.example` to `.env` in each app and set its values:

- `apps/web`: `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_CONVEX_URL`
- `apps/website`: `VITE_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- `apps/mobile`: `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`, `EXPO_PUBLIC_CONVEX_URL`
- Convex deployment: `CLERK_JWT_ISSUER_DOMAIN`, `CLERK_SECRET_KEY`, and
  `CLERK_WEBHOOK_SIGNING_SECRET`

Only publishable keys and public Convex URLs belong in client app environment
files. Never expose or commit `CLERK_SECRET_KEY` or
`CLERK_WEBHOOK_SIGNING_SECRET`. The Clerk JWT template used by Convex must have
the application ID `convex`, as configured in
`packages/backend/convex/auth.config.ts`.

The Convex HTTP webhook endpoint is `POST /clerk/webhook`. Configure Clerk to
send the user, organization, membership, subscription, and subscription-item
lifecycle events handled in `packages/backend/convex/http.ts`.

## Development commands

Run commands from the repository root:

```sh
pnpm dev:web       # authenticated Vite app
pnpm dev:website   # TanStack Start website
pnpm dev:backend   # Convex development process
pnpm dev:ui        # Storybook for @condo-manager/ui
pnpm dev:ios       # Expo dev server targeting iOS
pnpm dev:android   # Expo dev server targeting Android
```

For mobile native modules, use an iOS simulator or Android emulator/device with
the matching native development environment. The Expo Go app may not include
all native modules used by this project.

## Validation

Run the narrowest relevant checks while iterating. Common checks are:

```sh
pnpm --filter @condo-manager/web build
pnpm --filter @condo-manager/website build
pnpm --filter @condo-manager/mobile lint
pnpm --filter @condo-manager/mobile exec tsc --noEmit
pnpm --filter @condo-manager/backend check-types
pnpm --filter @condo-manager/ui check-types
pnpm --filter @condo-manager/ui lint
pnpm --filter @condo-manager/ui test-storybook
pnpm --filter @condo-manager/ui storybook:build
```

Do not manually edit generated files under
`packages/backend/convex/_generated/`. See [AGENTS.md](AGENTS.md) for repository
rules and agent-specific safety constraints.

## Shared UI

`@condo-manager/ui` provides cross-platform React Native components, design
tokens, DM Sans fonts, hooks, and helpers for the web apps and the native app.
Its public API is exported from `packages/ui/src/index.ts`; add/update stories
when changing visible behavior or public variants.

Web apps import the web stylesheet once at their entry point:

```tsx
import { Button } from "@condo-manager/ui";
import "@condo-manager/ui/styles.css";
```

The Expo app configures NativeWind through `apps/mobile/metro.config.js`, imports
`styles.native.css` from `apps/mobile/src/global.css`, and loads the shared DM
Sans font in its root layout. Follow those existing integration points when
adding another consumer.
