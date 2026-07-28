import eslint from "@eslint/js"
import solid from "eslint-plugin-solid"
import globals from "globals"
import tseslint from "typescript-eslint"

export default [
  {
    ignores: [".output/", ".vinxi/", "coverage/", "dist/", "node_modules/"]
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    files: ["**/*.{ts,tsx}"],
    ...solid.configs["flat/typescript"],
    languageOptions: {
      parser: tseslint.parser
    },
    rules: {
      ...solid.configs["flat/typescript"].rules,
      "@typescript-eslint/no-empty-object-type": "off"
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
