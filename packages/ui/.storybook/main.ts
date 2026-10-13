import path from "node:path";

import type { StorybookConfig } from "@storybook/react-native-web-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
  ],
  framework: "@storybook/react-native-web-vite",
  viteFinal: async (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        "expo-document-picker": path.resolve(
          import.meta.dirname,
          "../src/lib/expo-document-picker.web.ts",
        ),
      },
    },
  }),
};

export default config;
