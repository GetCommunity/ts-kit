import { resolve } from "node:path"
import solidPlugin from "vite-plugin-solid"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      "~": resolve(import.meta.dirname),
      "@": resolve(import.meta.dirname, "src")
    }
  },
  plugins: [
    solidPlugin({
      hot: false,
      exclude: /entry-server\.tsx$/
    }),
    solidPlugin({
      hot: false,
      include: /entry-server\.tsx$/,
      solid: {
        generate: "ssr",
        hydratable: true
      },
      ssr: true
    })
  ],
  test: {
    include: ["**/*.test.{ts,tsx}"],
    environment: "jsdom",
    globals: true,
    passWithNoTests: true,
    typecheck: {
      enabled: true,
      checker: "tsc",
      tsconfig: "./tsconfig.json"
    },
    watch: false,
    setupFiles: ["./test/mocks/setup.tsx", "./test/mocks/window.tsx"],
    coverage: {
      provider: "v8",
      clean: true,
      reportsDirectory: "./coverage",
      reporter: ["text", "json", "html", "lcov"],
      thresholds: {
        branches: 95,
        functions: 95,
        lines: 95,
        statements: 95
      },
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/router.tsx",
        "src/routeTree.gen.ts",
        "src/routes/**",
        "test/**",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "**/*.d.ts"
      ]
    }
  }
})
