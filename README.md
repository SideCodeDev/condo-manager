# Condo Manager

Monorepo for the Condo Manager product. It contains the authenticated web
application, a reusable UI library, and shared TypeScript, ESLint, and Prettier
configuration.

The project is under active migration. `_old/` is an archived implementation
and is not part of the current workspace or a source of truth.

## Stack

- pnpm workspaces with a centralized dependency catalog
- React 19 and Vite
- TypeScript
- Clerk Authentication, Organizations, and Billing
- Convex
- Tailwind CSS 4
- Storybook, Vitest, and Playwright for the UI package

## Workspace

```text
apps/
  app/                 React + Vite authenticated application
  website/             Reserved for the Next.js sales website
packages/
  ui/                  Shared, framework-agnostic React UI library
  eslint-config/       Shared ESLint and Prettier configuration
  typescript-config/   Shared TypeScript configurations
_old/                  Archived application; excluded from current work
```

Shared third-party versions are declared in `pnpm-workspace.yaml`. Internal
packages use the `@condo-manager/*` scope and the `workspace:*` protocol.

## Architecture

Clerk is the source of truth for users, organizations, memberships, and billing.
Convex stores application data and local projections synchronized from Clerk.

When a user is created:

1. Clerk sends a `user.created` webhook to Convex.
2. Convex stores the user and schedules organization provisioning.
3. A personal organization is created through the Clerk Backend API.
4. Organization and membership webhooks synchronize the resulting records.
5. Convex saves the selected organization in
   `userSettings.selectedClerkOrganizationId`.
6. The frontend `OrganizationGate` activates that organization in the Clerk
   session before rendering the application.

Billing subscriptions and items are projected into Convex. The application can
query each organization's billing state, current or upcoming plan, and plan
feature slugs without querying Clerk directly during normal rendering.

## Requirements

- Node.js compatible with pnpm 11
- pnpm `11.18.0` (pinned in `package.json`)
- Clerk development instance with Organizations and Billing configured
- Convex project connected to `apps/app`

Install dependencies from the repository root:

```sh
pnpm install
```

## Environment variables

The Vite application requires these client-side variables:

```dotenv
VITE_CONVEX_URL=
VITE_CLERK_PUBLISHABLE_KEY=
```

The Convex deployment requires these server-side variables:

```dotenv
CLERK_JWT_ISSUER_DOMAIN=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SIGNING_SECRET=
```

Configure server-side secrets in the appropriate Convex deployment. Never expose
`CLERK_SECRET_KEY` or `CLERK_WEBHOOK_SIGNING_SECRET` through a `VITE_*` variable
or commit their values.

The Clerk JWT template used by Convex must have the application ID `convex`, as
configured in `apps/app/convex/auth.config.ts`.

## Clerk webhook

The Convex HTTP endpoint is:

```text
POST /clerk/webhook
```

The Clerk webhook should subscribe to the lifecycle events used by the app:

- users: created, updated, and deleted
- organizations: created, updated, and deleted
- organization memberships: created, updated, and deleted
- subscriptions: created, updated, active, and past due
- subscription items: created, updated, active, canceled, upcoming, ended,
  abandoned, incomplete, past due, and free-trial ending

Webhook signatures are verified with `CLERK_WEBHOOK_SIGNING_SECRET`. Handlers are
designed to synchronize by Clerk identifiers so repeated deliveries update the
existing projection instead of creating duplicates.

## Development

Start the Vite application and Convex development process together:

```sh
pnpm dev:app
```

Start only the Vite frontend:

```sh
pnpm --filter @condo-manager/app dev:app
```

Start Storybook for the shared UI package:

```sh
pnpm dev:ui
```

## Validation

```sh
pnpm --filter @condo-manager/app build
pnpm --filter @condo-manager/ui check-types
pnpm --filter @condo-manager/ui lint
pnpm --filter @condo-manager/ui test-storybook
pnpm --filter @condo-manager/ui storybook:build
```

Generated files under `apps/app/convex/_generated/` must not be edited manually.

## Shared UI

`@condo-manager/ui` contains reusable components, fonts, hooks, helpers, and
styles. It intentionally has no dependency on Next.js, allowing it to be shared
by the Vite application and the future Next.js sales website.

Import components and global styles through the package's public exports:

```tsx
import { Button } from "@condo-manager/ui";
import "@condo-manager/ui/styles.css";
```

Visible changes to shared components should include corresponding Storybook
stories.

## Current status

Implemented:

- shared TypeScript, ESLint, and Prettier packages
- framework-agnostic UI package and Storybook
- Clerk authentication
- automatic personal organization provisioning
- organization and membership synchronization
- active organization reconciliation
- organization billing state, plans, and feature slugs

Still to be implemented:

- Next.js sales website
- condominium schema and CRUD functions
- active condominium selection
- organization-scoped condominium authorization
- plan entitlement enforcement, including condominium limits
- application routing, dashboard, and production screens
- unit and integration test suites for the app and Convex functions

## Agent guidance

Repository-specific rules for coding agents are documented in `AGENTS.md`.
`CLAUDE.md` imports those instructions so both use the same source of truth.
