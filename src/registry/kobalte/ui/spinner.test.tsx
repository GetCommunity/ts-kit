import { render, screen } from "@solidjs/testing-library"

import { Spinner } from "@/registry/kobalte/ui/spinner"

describe("Spinner", () => {
  it("renders an accessible, customizable loading indicator", () => {
    render(() => <Spinner class="size-8" data-testid="spinner" />)

    const spinner = screen.getByRole("status", { name: "Loading" })

    expect(spinner).toHaveAttribute("data-slot", "spinner")
    expect(spinner).toHaveClass("z-spinner", "animate-spin", "size-8")
  })
})
