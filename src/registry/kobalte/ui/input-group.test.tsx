import { render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea
} from "@/registry/kobalte/ui/input-group"

const user = userEvent.setup()

describe("InputGroup", () => {
  it("focuses the input when a non-button addon is clicked", async () => {
    const handleAddonClick = vi.fn()

    render(() => (
      <InputGroup class="custom-group">
        <InputGroupAddon align="inline-start" onClick={handleAddonClick}>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label="Amount" />
        <InputGroupButton size="icon-xs" aria-label="Clear">
          ×
        </InputGroupButton>
      </InputGroup>
    ))

    await user.click(screen.getByText("$"))

    expect(screen.getByRole("textbox", { name: "Amount" })).toHaveFocus()
    expect(handleAddonClick).toHaveBeenCalledOnce()
    expect(screen.getByRole("button", { name: "Clear" })).toHaveAttribute(
      "type",
      "button"
    )
    expect(screen.getByRole("button", { name: "Clear" })).toHaveAttribute(
      "data-size",
      "icon-xs"
    )
  })

  it("renders its textarea control", () => {
    render(() => (
      <InputGroup>
        <InputGroupTextarea aria-label="Message" class="custom-textarea" />
      </InputGroup>
    ))

    expect(screen.getByRole("textbox", { name: "Message" })).toHaveAttribute(
      "data-slot",
      "input-group-control"
    )
    expect(screen.getByRole("textbox", { name: "Message" })).toHaveClass(
      "custom-textarea"
    )
  })

  it("does not focus or call the addon when its button is clicked", async () => {
    const handleAddonClick = vi.fn()

    render(() => (
      <InputGroup>
        <InputGroupAddon onClick={handleAddonClick}>
          <InputGroupButton>Action</InputGroupButton>
        </InputGroupAddon>
        <InputGroupInput aria-label="Query" />
      </InputGroup>
    ))

    await user.click(screen.getByRole("button", { name: "Action" }))

    expect(screen.getByRole("textbox", { name: "Query" })).not.toHaveFocus()
    expect(handleAddonClick).not.toHaveBeenCalled()
    expect(screen.getByRole("button", { name: "Action" })).toHaveAttribute(
      "data-size",
      "xs"
    )
  })
})
