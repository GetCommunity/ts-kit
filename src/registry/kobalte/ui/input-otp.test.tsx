import { render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from "@/registry/kobalte/ui/input-otp"

const user = userEvent.setup()

describe("InputOTP", () => {
  it("renders slots and reports value changes from the underlying input", async () => {
    const handleValueChange = vi.fn()

    render(() => (
      <>
        <label for="verification-code">Verification code</label>
        <InputOTP
          id="verification-code"
          maxLength={4}
          onValueChange={handleValueChange}
          containerClass="custom-container"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSeparator />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </>
    ))

    const input = screen.getByRole("textbox", { name: "Verification code" })

    expect(input).toHaveAttribute("id", "verification-code")
    expect(input.parentElement).toHaveClass("custom-container")
    expect(document.querySelectorAll("[data-slot='input-otp-slot']")).toHaveLength(4)
    expect(document.querySelector("[data-slot='input-otp-separator']")).toHaveAttribute(
      "aria-hidden",
      "true"
    )

    await user.type(input, "1234")
    await user.tab()

    expect(handleValueChange).toHaveBeenLastCalledWith("1234")
    expect(
      document.querySelectorAll("[data-slot='input-otp-slot']")[0]
    ).toHaveTextContent("1")
  })
})
