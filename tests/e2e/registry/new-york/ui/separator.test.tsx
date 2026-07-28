import { render, screen } from "@solidjs/testing-library"

import { Separator } from "@/registry/new-york/ui/separator"

describe("Separator", () => {
  it("renders horizontal and vertical separators", () => {
    render(() => (
      <>
        <Separator data-testid="horizontal" />
        <Separator
          data-testid="vertical"
          orientation="vertical"
          class="custom-separator"
        />
      </>
    ))

    expect(screen.getByTestId("horizontal")).toHaveClass("h-px", "w-full")
    expect(screen.getByTestId("vertical")).toHaveClass(
      "h-full",
      "w-px",
      "custom-separator"
    )
  })
})
