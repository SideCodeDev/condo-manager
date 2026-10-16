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

Prefer Tailwind/NativeWind `className` for fixed visual styling on mobile,
matching the web app. Consume shared colors, typography, spacing,
shadows, and other visual tokens through class names defined by the Tailwind
theme. Do not read colors from `Colors` or a TypeScript theme module, or hardcode
design color values in style objects; do not create a second token system. Keep
`style` props or `StyleSheet.create` for genuinely dynamic values or native API
integration, and keep them limited to those values. The
shared `Loader` keeps runtime animation styles and its numeric `size` prop.

Apply visual styles with the same web Tailwind class logic used by React and
React Native Web; do not create platform-specific color branches. For SVG
icons, pass the matching `text-*` class through `className` so icons share text
color and Tailwind interaction states (`hover:`, `focus-visible:`, `active:`,
`disabled:`). Do not set token colors with an icon's `color` prop or calculate
state colors in JavaScript; clear any conflicting `color` prop when forwarding
the class to child icons.

DM Sans is loaded once by the root layout and applied to native text by the
shared global stylesheet. Font family is global: do not add `font-sans` or
`fontFamily` to individual mobile components. Tailwind font-size and
font-weight utilities remain appropriate. Use a local family override only
for an intentional alternate typeface.

## Native project files

- `ios/` and `android/` are generated through Expo prebuild when absent. Do not
  create or hand-edit generated native directories; configure native behavior
  through `app.json` or config plugins.
- Expo Go may not contain all native modules used by this app. When a native
  dependency requires a development build, document and use the project's
  development-build workflow rather than silently removing the dependency.
- Do not run EAS builds/submissions, change signing credentials, or publish
  updates unless the user explicitly requests that external action.
