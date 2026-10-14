# @condo-manager/ui

Cross-platform component library for the Condo Manager web apps and native
mobile app. Components use React Native primitives so the same public
components can render on iOS, Android, and web through React Native Web. Platform
specific modules use the `.web` suffix only when the underlying platform
requires different behavior.

## What's included

- Shared controls such as buttons, inputs, selectors, tabs, and file upload.
- Shared Tailwind CSS v4 tokens and DM Sans assets.
- Hooks and small utilities used by shared components.
- Storybook stories for components and design tokens.

The public API is exported through `src/index.ts` and package `exports` in
`package.json`. Keep app routing, authentication, billing, and Convex logic out
of this package. Add or update stories whenever a component's visible behavior,
variants, or public API changes.

## Styling and fonts

Tailwind CSS v4 / NativeWind v5 are the single source of truth for visual
tokens and utilities on web and native mobile. Define tokens in the Tailwind
theme in `src/styles.base.css` and consume them with Tailwind/NativeWind classes
(for example, `text-neutral-600`, `bg-primary`, or `shadow-card`). Do not add a
TypeScript `theme` folder, duplicate token values in TypeScript, or pass token
colors through inline styles or component color props. This applies equally to
shared components and app-specific UI in `apps/web` and `apps/mobile`.

The default DM Sans family is applied globally in `src/styles.base.css` on the
web document body and through the native base rule for React Native text. The
mobile root layout loads the font asset. Font family is global: do not add
`font-sans` or `fontFamily` to individual components. Font-size and
font-weight utilities remain valid. Add a local family override only when a
design intentionally uses a different typeface.

Prefer class names on icons and native components as well. If a platform API
only accepts a style prop and cannot be styled with a class, keep that prop
limited to the platform integration and do not create a parallel token source.

Use the same web-style class logic in React Native and React Native Web; do not
add platform-specific branches for visual colors. For SVG icons (including
Lucide icons), pass the component's Tailwind text-color class through
`className` so it matches the surrounding text and responds to the same
`hover:`, `focus-visible:`, `active:`, and `disabled:` states. Do not set an
icon's `color` prop when its color comes from the design; remove a conflicting
`color` prop when forwarding the class to a child icon. Keep visual state in
Tailwind classes on the component and its child SVGs, not in JavaScript color
calculations or inline styles.

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
