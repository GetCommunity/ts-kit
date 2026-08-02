/// <reference types="vite/client" />

import type { QueryClient } from "@tanstack/solid-query"
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts
} from "@tanstack/solid-router"
import type { JSX } from "solid-js"
import { HydrationScript } from "solid-js/web"
import appCss from "../styles/app.css?url"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      { title: "Get Community TS Kit Registry" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" }
    ]
  }),
  component: RootComponent
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument(props: { children: JSX.Element }) {
  return (
    <html lang="en">
      <head>
        <HydrationScript />
      </head>
      <body>
        <HeadContent />
        {props.children}
        <Scripts />
      </body>
    </html>
  )
}
