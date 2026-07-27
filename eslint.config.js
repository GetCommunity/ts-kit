import eslint from "@eslint/js";
import solid from "eslint-plugin-solid";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [".output/", ".vinxi/", "dist/", "node_modules/", "public/r/"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    ...solid.configs["flat/typescript"],
    rules: {
      ...solid.configs["flat/typescript"].rules,
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
);
