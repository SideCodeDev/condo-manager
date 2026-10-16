import { defineConfig } from "vite";
import { createRequire } from "node:module";
import path from "node:path";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

const require = createRequire(import.meta.url);

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      { find: /^react-native$/, replacement: require.resolve("react-native-web") },
      { find: /^lucide-react-native$/, replacement: require.resolve("lucide-react") },
      {
        find: /^react-native-reanimated$/,
        replacement: path.resolve(
          import.meta.dirname,
          "../../packages/ui/src/lib/reanimated-web.ts",
        ),
      },
      {
        find: /^expo-document-picker$/,
        replacement: path.resolve(
          import.meta.dirname,
          "../../packages/ui/src/lib/expo-document-picker.web.ts",
        ),
      },
    ],
  },
  plugins: [
    tailwindcss(),
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
});
