import { render, screen } from "@solidjs/testing-library"

import { Toaster, showToast, showToastPromise } from "@/registry/base/ui/toast"

describe("Toast", () => {
  it("renders toast content through the toaster", async () => {
    render(() => <Toaster />)

    showToast({
      title: "Saved",
      description: "Your changes were saved.",
      variant: "success",
      duration: 10_000
    })

    expect(await screen.findByText("Saved")).toHaveClass("font-semibold")
    expect(screen.getByText("Your changes were saved.")).toHaveClass("opacity-90")
    expect(screen.getByRole("status")).toHaveClass("bg-success")
  })

  it("renders a toaster list in a portal", () => {
    render(() => <Toaster class="custom-toaster" />)

    expect(document.body.querySelector("ol")).toHaveClass("custom-toaster")
  })

  it("tracks pending and fulfilled promise states", async () => {
    let resolvePromise: ((value: string) => void) | undefined
    const promise = new Promise<string>((resolve) => {
      resolvePromise = resolve
    })
    render(() => <Toaster />)

    showToastPromise(promise, {
      loading: "Saving",
      success: (value) => `Saved ${value}`,
      error: (error: Error) => error.message,
      duration: 10_000
    })

    expect(await screen.findByText("Saving")).toBeInTheDocument()
    resolvePromise?.("settings")
    expect(await screen.findByText("Saved settings")).toBeInTheDocument()
  })

  it("renders rejected promise states", async () => {
    render(() => <Toaster />)

    showToastPromise(Promise.reject(new Error("Could not save")), {
      loading: "Saving",
      success: (value) => String(value),
      error: (error: Error) => error.message
    })

    expect(await screen.findByText("Could not save")).toBeInTheDocument()
    expect(screen.getByText("Could not save").closest('[role="status"]')).toHaveClass(
      "bg-error"
    )
  })
})
