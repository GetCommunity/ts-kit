import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/solid-start/plugin/vite"
import { defineConfig } from "vite"
import solid from "vite-plugin-solid"

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      "~": new URL("./", import.meta.url).pathname,
      "@": new URL("./src", import.meta.url).pathname
    }
  },
  server: {
    port: 3000
  },
  plugins: [tailwindcss(), tanstackStart(), solid({ ssr: true })]
})
