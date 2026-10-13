# @condo-manager/ui

Cross-platform component library for the Condo Manager web apps and native
mobile app. Components use React Native primitives so the same public
components can render on iOS, Android, and web through React Native Web. Platform
specific modules use the `.web` suffix only when the underlying platform
requires different behavior.

## What's included

- Shared controls such as buttons, inputs, selectors, tabs, and file upload.
- Design tokens for colors, shadows, and typography, plus DM Sans assets.
- Hooks and small utilities used by shared components.
- Storybook stories for components and design tokens.

The public API is exported through `src/index.ts` and package `exports` in
`package.json`. Keep app routing, authentication, billing, and Convex logic out
of this package. Add or update stories whenever a component's visible behavior,
variants, or public API changes.

## Styling and fonts

Tailwind CSS v4 / NativeWind v5 provide the shared design tokens and utilities.
The web stylesheet is:

```tsx
import { Button } from "@condo-manager/ui";
import "@condo-manager/ui/styles.css";
```

Import the web stylesheet once in each web app. In Expo, the consumer must use
the NativeWind Metro integration and import `@condo-manager/ui/styles.native.css`
through its global stylesheet. Follow the working setup in
`apps/mobile/metro.config.js`, `apps/mobile/src/global.css`, and
`apps/mobile/src/app/_layout.tsx`; the mobile app loads the packaged DM Sans
font before rendering the app.

`styles.css` and `styles.native.css` share the common base CSS, with platform
entry points kept separate where bundler behavior differs. When changing CSS
imports, verify both web and native bundling; Metro's CSS parser is stricter
than a browser's.

## File selection

`FileUpload` uses Expo Document Picker on iOS and Android. Its web implementation
is selected by the `.web` platform module. Preserve the platform-specific
selection behavior and keep returned file data consistent across platforms.

## Development and checks

Run from the monorepo root:

```sh
pnpm dev:ui
pnpm --filter @condo-manager/ui check-types
pnpm --filter @condo-manager/ui lint
pnpm --filter @condo-manager/ui test-storybook
pnpm --filter @condo-manager/ui storybook:build
```

Storybook uses `@storybook/react-native-web-vite`. Its browser rendering is for
component development and visual verification; native behavior still needs to
be checked in the Expo app or on a device/simulator when platform-specific code
is involved.
