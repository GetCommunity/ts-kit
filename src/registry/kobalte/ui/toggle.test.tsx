import { render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"

import { Toggle, toggleVariants } from "@/registry/kobalte/ui/toggle"

const user = userEvent.setup()

describe("Toggle", () => {
  it("renders variant styles and changes pressed state", async () => {
    const handleChange = vi.fn()

    render(() => (
      <Toggle variant="outline" size="lg" class="custom-toggle" onChange={handleChange}>
        Bold
      </Toggle>
    ))

    const toggle = screen.getByRole("button", { name: "Bold" })

    expect(toggle).toHaveAttribute("aria-pressed", "false")
    expect(toggle).toHaveClass(
      "z-toggle-variant-outline",
      "z-toggle-size-lg",
      "custom-toggle"
    )

    await user.click(toggle)

    expect(toggle).toHaveAttribute("aria-pressed", "true")
    expect(handleChange).toHaveBeenCalledWith(true)
    expect(toggleVariants({ variant: "default", size: "sm" })).toContain(
      "z-toggle-size-sm"
    )
  })
})
