# @condo-manager/ui

Bootstrap da biblioteca universal React Native do Condo Manager. O package ainda
não contém componentes públicos; apenas inclui o tema, fontes e as stories de
design tokens.

## Alvos

- React Native em iOS e Android.
- React Native Web no browser.
- Storybook 10 através de `@storybook/react-native-web-vite`.
- Tailwind CSS v4 através de NativeWind v5.

O NativeWind v5 ainda é uma release candidate. É a versão usada aqui porque é a
linha que suporta Tailwind CSS v4 e a stack Expo 57/React Native 0.86 do
monorepo.

## Consumo

O ponto de entrada exporta os tokens nativos:

```ts
import { colors, shadows, typography } from "@condo-manager/ui";
```

Uma aplicação web ou NativeWind deve importar o CSS global uma vez:

```ts
import "@condo-manager/ui/styles.css";
```

Na aplicação Expo, o Metro também tem de ser configurado pelo consumidor:

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

module.exports = withNativewind(getDefaultConfig(__dirname));
```

## Fonte nativa

Os assets DM Sans são exportados em `@condo-manager/ui/fonts/*`. A aplicação
nativa deve carregar a fonte com o nome `DM Sans` antes de renderizar texto que
use `fontFamilies.sans`:

```ts
useFonts({
  "DM Sans": require("@condo-manager/ui/fonts/DMSans-VariableFont_opsz,wght.ttf"),
});
```

## Desenvolvimento

```sh
pnpm dev:ui
pnpm --filter @condo-manager/ui check-types
pnpm --filter @condo-manager/ui lint
pnpm --filter @condo-manager/ui storybook:build
```
