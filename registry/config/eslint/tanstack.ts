import { tanstackConfig } from "@tanstack/eslint-config"
import tseslint from "typescript-eslint"

// Residual ESLint layer for TanStack-specific rules Biome cannot express.
// Biome is the sole formatter and general-purpose linter (see the config-biome-*
// presets) — this file intentionally does not repeat eslint/typescript-eslint's
// own recommended rule sets, only the plumbing TanStack's rules need to run.
export default [
  {
    ignores: [
      ".output/",
      ".vinxi/",
      ".wrangler/",
      "coverage/",
      "dist/",
      "node_modules/",
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
    },
  },
  ...tanstackConfig,
]
