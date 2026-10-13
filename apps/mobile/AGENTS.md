# Mobile app agent guide

This package is a native-only Expo / React Native application for iOS and
Android. Mobile web is not a supported target. Repository-wide rules in the
root `AGENTS.md` still apply; in particular, use pnpm exclusively and preserve
unrelated changes.

## Expo and React Native changes

Expo APIs and SDK-compatible package versions change between SDK releases.
Before changing Expo, EAS, or React Native APIs:

1. Check the Expo SDK version in this package's `package.json`.
2. Consult the matching versioned Expo docs at
   `https://docs.expo.dev/versions/v<major>.0.0/` and the relevant API page.
3. For APIs outside Expo, consult their current official documentation too.

Use Expo's installer through pnpm when adding or changing SDK/native
dependencies, from the repository root:

```sh
pnpm --filter @condo-manager/mobile exec expo install <package>
```

Check the resulting manifest and lockfile; keep shared dependency versions in
the workspace catalog when appropriate, while respecting Expo SDK compatibility.
Do not use npm, npx, yarn, or bun in this pnpm workspace.

## Commands

```sh
pnpm dev:ios
pnpm dev:android
pnpm --filter @condo-manager/mobile lint
pnpm --filter @condo-manager/mobile exec tsc --noEmit
```

Run lint and typecheck before declaring a mobile change done. Use the root
`dev:ios` / `dev:android` commands to start Expo for a target; the native
simulator/emulator and development build must support any native modules in use.

## Routing and app structure

- Use Expo Router. Route files live under `src/app/`; `_layout.tsx` defines the
  root layout and providers.
- Keep reusable components, hooks, and utilities outside `src/app/` so they are
  not interpreted as routes.
- Clerk and Convex providers are wired in `src/app/_layout.tsx`. Keep the
  Convex client connected through Clerk auth (`ConvexProviderWithClerk`).
- `OrganizationGate` handles organization readiness and selection. Keep server
  authorization in Convex; the client gate is not a security boundary.

## Shared UI and styling

Prefer `@condo-manager/ui` for shared controls. Its native stylesheet is loaded
by `src/global.css`, which is imported from the root layout; Metro's NativeWind
integration is in `metro.config.js`. DM Sans is loaded in the root layout.
Preserve these integration points when changing styling or fonts. Add or update
Storybook stories in `packages/ui` for visible shared-component changes.

## Native project files

- `ios/` and `android/` are generated through Expo prebuild when absent. Do not
  create or hand-edit generated native directories; configure native behavior
  through `app.json` or config plugins.
- Expo Go may not contain all native modules used by this app. When a native
  dependency requires a development build, document and use the project's
  development-build workflow rather than silently removing the dependency.
- Do not run EAS builds/submissions, change signing credentials, or publish
  updates unless the user explicitly requests that external action.
