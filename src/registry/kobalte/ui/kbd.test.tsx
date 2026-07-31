import { render, screen } from "@solidjs/testing-library"

import { Kbd, KbdGroup } from "@/registry/kobalte/ui/kbd"

describe("Kbd", () => {
  it("renders keyboard shortcuts with semantic markup", () => {
    render(() => (
      <KbdGroup class="custom-group">
        <Kbd class="custom-key">⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    ))

    expect(screen.getByText("⌘").tagName).toBe("KBD")
    expect(screen.getByText("⌘")).toHaveClass("z-kbd", "custom-key")
    expect(screen.getByText("K").parentElement).toHaveAttribute(
      "data-slot",
      "kbd-group"
    )
    expect(screen.getByText("K").parentElement).toHaveClass("custom-group")
  })
})
