import valibotPlugin from "@ospm/eslint-plugin-valibot"
import tseslint from "typescript-eslint"

// Residual ESLint layer for the @ospm/eslint-plugin-valibot rules Biome cannot
// express. Biome is the sole formatter and general-purpose linter (see the
// config-biome-* presets) — this file intentionally does not repeat
// eslint/typescript-eslint's own recommended rule sets, only the plumbing the
// valibot plugin needs to run.
export default [
  {
    ignores: ["coverage/", "dist/", "node_modules/"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
    },
  },
  {
    plugins: {
      valibot: valibotPlugin,
    },
  },
]
