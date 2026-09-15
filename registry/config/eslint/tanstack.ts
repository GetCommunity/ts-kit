import { tanstackConfig } from "@tanstack/eslint-config"
import solid from "eslint-plugin-solid"
import tseslint from "typescript-eslint"

// Residual ESLint layer for TanStack-specific rules Biome cannot express.
// Biome is the sole formatter and general-purpose linter (see the config-biome-*
// presets) — this file intentionally does not repeat eslint/typescript-eslint's
// own recommended rule sets, only the plumbing TanStack's rules need to run.
export default [
  {
    ignores: [
      ".idea/",
      ".output/",
      ".vinxi/",
      ".wrangler/",
      "coverage/",
      "dist/",
      "node_modules/",
      "**/*.d.ts",
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
    },
    // tanstackConfig references solid-specific rule IDs (e.g. solid/no-innerhtml)
    // without registering the plugin itself — Biome's solid domain covers
    // general Solid linting, but this plugin still needs to be present for
    // tanstackConfig's own targeted rule references to resolve.
    plugins: {
      solid,
    },
  },
  ...tanstackConfig,
  {
    // Biome's organizeImports assist is the single source of truth for import
    // order/sorting — tanstackConfig's own import/sort-imports rules disagree
    // with Biome's sort order and would fight it on every save.
    rules: {
      "import/order": "off",
      "sort-imports": "off",
    },
  },
]
