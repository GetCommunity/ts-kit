import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import { tanstackConfig } from "@tanstack/eslint-config"
import tseslint from "typescript-eslint"

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
})

export default [
  {
    ignores: ["**/*.config.*", "**/*.json", "**/lib/ui/*.tsx"]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tanstackConfig,
  ...compat.extends("plugin:solid/recommended"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser
    }
  },
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports"
        }
      ]
    }
  }
]
