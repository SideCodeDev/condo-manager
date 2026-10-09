# Condo Manager — Agent Guide

This file is the canonical repository guide for coding agents. It applies to the
whole repository unless a more specific `AGENTS.md` exists in a subdirectory.

## Scope

- Work only in the current monorepo. Ignore `_old/` completely: it is an archive,
  not a source of truth, and must not be searched, edited, imported, or copied
  unless the user explicitly requests it.
- Preserve unrelated user changes. Do not rewrite or remove existing work merely
  to make a task easier.
- Use `pnpm` exclusively. The pinned package manager is declared in the root
  `package.json`.

## Repository map

- `apps/app`: the main React 19 + Vite application. Authentication,
  organizations, and billing come from Clerk; application data and synchronized
  projections live in Convex.
- `apps/website`: reserved for the sales/marketing application.
- `packages/ui`: framework-agnostic shared React UI, fonts, helpers, styles, and
  Storybook. It must remain usable by both Vite and Next.js consumers and must not
  take a dependency on Next.js.
- `packages/eslint-config`: shared ESLint configuration.
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
  `userSettings.selectedClerkOrganizationId`. The frontend `OrganizationGate`
  reconciles that preference with the active Clerk session.
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

- Do not manually edit files in `apps/app/convex/_generated/`.
- Do not run `convex dev`, `convex deploy`, Convex code generation, migrations,
  webhook replays, or database cleanup unless the user explicitly asks for that
  exact action.
- Never delete or reset Clerk or Convex data without explicit approval.
- Never commit secrets. Refer only to environment variable names such as
  `CLERK_SECRET_KEY` and `CLERK_WEBHOOK_SIGNING_SECRET`.

## Dependency and package conventions

- Add a dependency to the package that imports it. Hoisting is not a substitute
  for declaring direct dependencies.
- Use `workspace:*` for internal `@condo-manager/*` packages.
- Use `catalog:` for centrally managed third-party versions.
- Keep reusable UI free of app-specific routing, authentication, billing, and
  Convex concerns. Export public UI APIs through `packages/ui` entry points.
- Add or update Storybook stories when a shared component's visible behavior or
  public variants change.

## Common commands

Run commands from the repository root:

```sh
pnpm dev:app
pnpm dev:ui
pnpm --filter @condo-manager/app build
pnpm --filter @condo-manager/ui check-types
pnpm --filter @condo-manager/ui lint
pnpm --filter @condo-manager/ui storybook:build
```

Prefer the narrowest relevant check while iterating, then run all checks affected
by the change. A production build is not a substitute for focused tests.

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

- The requested behavior is implemented without touching `_old/` or unrelated
  changes.
- Relevant type, lint, build, Storybook, and test checks pass, or any check that
  could not be run is reported clearly.
- Public package exports and dependency declarations are complete.
- Security-sensitive paths validate identity, organization membership, and input
  at the server boundary.
- Documentation is updated when architecture, commands, or conventions change.
