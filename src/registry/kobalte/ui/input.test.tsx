import { render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"

import { Input } from "@/registry/kobalte/ui/input"

const user = userEvent.setup()

describe("Input", () => {
  it("renders an accessible input and forwards native props", async () => {
    render(() => (
      <Input
        aria-label="Email"
        class="custom-input"
        placeholder="you@example.com"
        type="email"
      />
    ))

    const input = screen.getByRole("textbox", { name: "Email" })

    expect(input).toHaveAttribute("data-slot", "input")
    expect(input).toHaveClass("z-input", "custom-input")
    expect(input).toHaveAttribute("placeholder", "you@example.com")

    await user.type(input, "person@example.com")
    expect(input).toHaveValue("person@example.com")
  })
})
