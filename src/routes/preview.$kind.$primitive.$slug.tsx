import { NotFoundPage } from "@/components/not-found-page"
import type { IframeMessage, Kind } from "@/lib/types"
import { createFileRoute, notFound } from "@tanstack/solid-router"
import { ui } from "@velite"
import { createSignal, lazy, onCleanup, onMount, Show } from "solid-js"

export const Route = createFileRoute("/preview/$kind/$primitive/$slug")({
  loader: (r) => {
    const collection = r.params.kind === "ui" ? ui : ui // or blocks when added
    const component = collection.find((u) => u.slug === r.params.slug)
    if (!component) {
      throw notFound({ data: { slug: r.params.slug } })
    }

    return {
      slug: r.params.slug,
      primitive: r.params.primitive,
      kind: r.params.kind as Kind
    }
  },
  component: PreviewComponent,
  notFoundComponent: () => <NotFoundPage />
})

function PreviewComponent() {
  const params = Route.useParams()
  const [isReady, setIsReady] = createSignal(false)

  const ExampleComponent = lazy(
    () =>
      import(
        `@/registry/${params().primitive}/examples/${params().kind}/${params().slug}-example.tsx`
      )
  )
  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({
            type: "cmd-k-forward",
            key: e.key
          } satisfies IframeMessage)
        }
      }

      if ((e.key === "d" || e.key === "D") && !e.metaKey && !e.ctrlKey) {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }
        e.preventDefault()
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({
            type: "dark-mode-forward",
            key: e.key
          } satisfies IframeMessage)
        }
      }

      if ((e.key === "r" || e.key === "R") && !e.metaKey && !e.ctrlKey) {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }
        e.preventDefault()
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({
            type: "randomize-forward",
            key: e.key
          } satisfies IframeMessage)
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    onCleanup(() => {
      document.removeEventListener("keydown", handleKeyDown)
      document.getElementById("design-system-theme-vars")?.remove()
    })
  })

  onMount(() => {
    setIsReady(true)
  })

  return (
    <Show when={isReady()}>
      <ExampleComponent />
    </Show>
  )
}
