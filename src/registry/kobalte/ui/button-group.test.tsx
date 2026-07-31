import { render, screen } from "@solidjs/testing-library"

import { Button } from "@/registry/kobalte/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants
} from "@/registry/kobalte/ui/button-group"

describe("ButtonGroup", () => {
  it("renders an oriented group with text and a separator", () => {
    render(() => (
      <ButtonGroup orientation="vertical" class="custom-group">
        <Button>First</Button>
        <ButtonGroupSeparator class="custom-separator" />
        <ButtonGroupText>or</ButtonGroupText>
        <Button>Second</Button>
      </ButtonGroup>
    ))

    const group = screen.getByRole("group")

    expect(group).toHaveAttribute("data-orientation", "vertical")
    expect(group).toHaveClass("flex-col", "custom-group")
    expect(screen.getByText("or")).toHaveAttribute("data-slot", "button-group-text")
    expect(document.querySelector(".custom-separator")).toHaveAttribute(
      "data-orientation",
      "vertical"
    )
    expect(buttonGroupVariants({ orientation: "horizontal" })).toContain(
      "z-button-group-orientation-horizontal"
    )
  })
})
