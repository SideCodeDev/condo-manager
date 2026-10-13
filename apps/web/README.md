# Condo Manager Web App

Authenticated React 19 + Vite application using Clerk for identity and Convex
for application data. Shared components and design tokens come from
`@condo-manager/ui`.

## Setup and run

From the monorepo root, install dependencies and create `apps/web/.env` from
`.env.example`:

```dotenv
VITE_CLERK_PUBLISHABLE_KEY=
VITE_CONVEX_URL=
```

Then start the app:

```sh
pnpm dev:web
```

The Clerk key and Convex URL are client-visible configuration. Never put
`CLERK_SECRET_KEY` or webhook secrets in a `VITE_*` variable.

## Integration notes

- `src/main.tsx` composes `ClerkProvider` with `ConvexProviderWithClerk`.
- `src/components/organization-gate.tsx` waits for Convex organization
  provisioning and reconciles the selected Clerk organization.
- Authorization must still be enforced in Convex functions; a client-side gate
  is only a rendering/readiness concern.
- `@condo-manager/ui/styles.css` is imported once by `src/main.tsx`.

## Checks

```sh
pnpm --filter @condo-manager/web build
```
