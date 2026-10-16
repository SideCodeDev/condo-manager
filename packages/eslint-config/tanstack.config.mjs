import path from "node:path";
import { tanstackConfig } from "@tanstack/eslint-config";
import baseConfig from "./eslint.config.mjs";

export function createTanStackConfig({ tsconfigRootDir }) {
  return [
    ...baseConfig,
    ...tanstackConfig,
    {
      files: ["**/*.{js,ts,tsx}"],
      languageOptions: {
        parserOptions: {
          project: path.join(tsconfigRootDir, "tsconfig.json"),
          tsconfigRootDir,
        },
      },
    },
    {
      rules: {
        "import/no-cycle": "off",
        "import/order": "off",
        "sort-imports": "off",
        "@typescript-eslint/array-type": "off",
        "@typescript-eslint/require-await": "off",
        "pnpm/json-enforce-catalog": "off",
      },
    },
    {
      ignores: [
        "eslint.config.js",
        "prettier.config.js",
        "**/routeTree.gen.ts",
      ],
    },
  ];
}
