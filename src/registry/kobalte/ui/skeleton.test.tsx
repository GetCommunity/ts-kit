import { render, screen } from "@solidjs/testing-library"

import { Skeleton } from "@/registry/kobalte/ui/skeleton"

describe("Skeleton", () => {
  it("renders a customizable loading placeholder", () => {
    render(() => <Skeleton aria-label="Loading profile" class="h-8" />)

    expect(screen.getByLabelText("Loading profile")).toHaveAttribute(
      "data-slot",
      "skeleton"
    )
    expect(screen.getByLabelText("Loading profile")).toHaveClass(
      "z-skeleton",
      "animate-pulse",
      "h-8"
    )
  })
})
