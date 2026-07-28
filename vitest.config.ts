import { resolve } from "node:path"
import solidPlugin from "vite-plugin-solid"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
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
    environment: "jsdom",
    globals: true,
    passWithNoTests: true,
    typecheck: {
      enabled: true,
      checker: "tsc",
      tsconfig: "./tsconfig.json"
    },
    watch: false,
    setupFiles: ["./tests/mocks/setup.tsx", "./tests/mocks/window.tsx"],
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
        "tests/**",
        "src/routes/**",
        "src/app.tsx",
        "src/entry-client.tsx",
        "src/entry-server.tsx",
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
        "src/**/*.d.ts"
      ]
    }
  }
})
