import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/solid-start/plugin/vite"
import velite from "@velite/plugin-vite"
import { defineConfig } from "vite"
import lucide from "vite-plugin-lucide-preprocess"
import solid from "vite-plugin-solid"
import mdx from "./src/lib/vite-plugins/mdx"

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
  plugins: [
    lucide(),
    mdx({
      jsx: true,
      jsxImportSource: "solid-js",
      providerImportSource: "solid-mdx",
      stylePropertyNameCase: "css"
    }),
    devtools(),
    tailwindcss(),
    tanstackStart(),
    solid({ ssr: true, hot: true, extensions: [".tsx", ".mdx"] }),
    velite()
  ]
})
