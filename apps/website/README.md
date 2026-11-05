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

## Vercel deployment

The root `vercel.json` deploys this app as the `website` Vercel Service and
routes `condo.sidecode.pt` to it. In the Vercel project settings, select the
**Services** framework so Vercel builds the services declared in that file.
Connect the repository with its root directory set to the repository root;
the service root is already set to `apps/website`.

Add `VITE_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` to the Vercel project
for Production, Preview, and Development as needed. Configure the custom domain
`condo.sidecode.pt` on the Vercel project and point its DNS records to Vercel.
For Clerk development-instance session syncing with the app, set
`VITE_CLERK_ALLOWED_REDIRECT_ORIGINS=https://app.condo.sidecode.pt` and add
`app.condo.sidecode.pt` as a satellite domain in the Clerk development
instance.
TanStack Start's server routes and functions run as Vercel Functions through
Nitro. Convex remains a separate backend deployment and must be configured in
its own Convex deployment; it is not hosted by this Vercel service.

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
