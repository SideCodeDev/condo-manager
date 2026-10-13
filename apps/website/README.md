# Condo Manager Website

Sales/marketing application built with TanStack Start and Clerk. It is a
separate app from `apps/web` and currently serves as the website scaffold.
Shared UI comes from `@condo-manager/ui`.

## Setup and run

From the monorepo root, install dependencies and create `apps/website/.env`
from `.env.example`:

```dotenv
VITE_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

Start the dev server and build with:

```sh
pnpm dev:website
pnpm --filter @condo-manager/website build
```

`CLERK_SECRET_KEY` is server-only and must never be exposed through a
`VITE_*` variable or committed.

## App structure

- Routes live in `src/routes/`; `src/routes/__root.tsx` provides the document
  shell, Clerk provider, and shared stylesheet.
- `src/start.ts` configures Clerk request middleware and CSRF protection.
- Use server-side auth checks for protected server functions and routes;
  presentation-only signed-in checks are not an authorization boundary.
- The shared UI web stylesheet is imported as a URL by the root route.

## Checks

The package currently exposes `build` as its validation script. There are no
package-local `lint`, `check`, or `format` scripts at this time.
