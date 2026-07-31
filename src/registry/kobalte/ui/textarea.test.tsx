import { render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"

import { Textarea } from "@/registry/kobalte/ui/textarea"

const user = userEvent.setup()

describe("Textarea", () => {
  it("renders a native textarea and forwards props", async () => {
    render(() => (
      <Textarea
        aria-label="Biography"
        class="custom-textarea"
        placeholder="Tell us about yourself"
      />
    ))

    const textarea = screen.getByRole("textbox", { name: "Biography" })

    expect(textarea.tagName).toBe("TEXTAREA")
    expect(textarea).toHaveAttribute("data-slot", "textarea")
    expect(textarea).toHaveClass("z-textarea", "custom-textarea")

    await user.type(textarea, "Solid developer")
    expect(textarea).toHaveValue("Solid developer")
  })
})
