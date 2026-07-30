import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/policies/$slug")({
  component: Policy
})

function Policy() {
  const params = Route.useParams()

  return (
    <main class="container mx-auto max-w-4xl px-4 py-8">
      <h1 class="font-bold text-3xl">Policy</h1>
      <p class="mt-2 text-muted-foreground">
        Policy content for <code>{params().slug}</code> is not available in this
        registry template.
      </p>
    </main>
  )
}
