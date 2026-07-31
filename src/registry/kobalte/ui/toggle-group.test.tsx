import { render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"

import { ToggleGroup, ToggleGroupItem } from "@/registry/kobalte/ui/toggle-group"

const user = userEvent.setup()

describe("ToggleGroup", () => {
  it("shares variant settings and supports single selection", async () => {
    const handleChange = vi.fn()

    render(() => (
      <ToggleGroup
        value=""
        onChange={handleChange}
        variant="outline"
        size="sm"
        spacing={2}
        orientation="vertical"
      >
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>
    ))

    const group = screen.getByRole("group")
    const bold = screen.getByRole("button", { name: "Bold" })

    expect(group).toHaveAttribute("data-spacing", "2")
    expect(group).toHaveAttribute("data-orientation", "vertical")
    expect(group.style.getPropertyValue("--gap")).toBe("2")
    expect(bold).toHaveAttribute("data-variant", "outline")
    expect(bold).toHaveAttribute("data-size", "sm")

    await user.click(bold)
    expect(handleChange).toHaveBeenCalled()
  })

  it("falls back to item variants when the group omits them", () => {
    render(() => (
      <ToggleGroup>
        <ToggleGroupItem value="underline" variant="outline" size="lg">
          Underline
        </ToggleGroupItem>
      </ToggleGroup>
    ))

    expect(screen.getByRole("button", { name: "Underline" })).toHaveAttribute(
      "data-variant",
      "outline"
    )
    expect(screen.getByRole("button", { name: "Underline" })).toHaveAttribute(
      "data-size",
      "lg"
    )
  })
})
