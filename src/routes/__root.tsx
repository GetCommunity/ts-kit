/// <reference types="vite/client" />
import { NotFoundPage } from "@/components/not-found-page"
import { cn } from "@/lib/utils/tailwind"
import {
  colorModeKey,
  colorModeStorageManager
} from "@/registry/kobalte/hooks/use-color-mode"
import { ColorModeProvider, ColorModeScript } from "@kobalte/core/color-mode"
import type { QueryClient } from "@tanstack/solid-query"
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts
} from "@tanstack/solid-router"
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools"
import { Suspense } from "solid-js"
import { HydrationScript } from "solid-js/web"
import appCss from "../styles/app.css?url"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: "Get Community TS Kit Registry" },
      {
        name: "robots",
        content:
          "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" }
    ]
  }),
  shellComponent: RootComponent,
  notFoundComponent: () => <NotFoundPage />
})

function RootComponent() {
  return (
    <html lang="en" class={cn("no-scrollbar")}>
      <head>
        <HydrationScript />
      </head>
      <body class="overflow-y-auto">
        <HeadContent />
        <ColorModeProvider
          initialColorMode={colorModeStorageManager.get()}
          storageManager={colorModeStorageManager}
        >
          <Suspense>
            <Outlet />
            <TanStackRouterDevtools />
          </Suspense>
        </ColorModeProvider>
        <Scripts />
        <ColorModeScript
          initialColorMode={colorModeStorageManager.get()}
          storageType={colorModeStorageManager.type}
          storageKey={colorModeKey}
        />
      </body>
    </html>
  )
}
