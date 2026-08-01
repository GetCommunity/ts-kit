import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/test")({
  component: Home
})

function Home() {
  return (
    <main class="container mx-auto max-w-4xl px-4 py-8">
      <header class="mb-8">
        <h1 class="font-bold text-3xl">Custom Registry</h1>
        <p class="mt-2 text-muted-foreground">
          A custom registry for distributing code using shadcn - ported to SolidJS.
        </p>
      </header>

      <div class="flex flex-col gap-8">
        <section class="rounded-lg border p-6">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h2 class="font-semibold text-lg">HelloWorld</h2>
              <p class="text-muted-foreground text-sm">
                A simple hello world component
              </p>
            </div>
          </div>
          <div class="flex min-h-50 items-center justify-center rounded-md border bg-muted/50">
            Hello World
          </div>
        </section>
      </div>
    </main>
  )
}
