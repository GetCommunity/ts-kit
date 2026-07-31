import { render, screen } from "@solidjs/testing-library"

import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemLabel
} from "@/registry/kobalte/ui/radio-group"

describe("RadioGroup", () => {
  it("renders radio options with labels", () => {
    render(() => (
      <RadioGroup value="email" aria-label="Contact preference" class="custom-radio">
        <RadioGroupItem value="email">
          <RadioGroupItemLabel>Email</RadioGroupItemLabel>
        </RadioGroupItem>
        <RadioGroupItem value="phone">
          <RadioGroupItemLabel>Phone</RadioGroupItemLabel>
        </RadioGroupItem>
      </RadioGroup>
    ))

    expect(screen.getByRole("radiogroup")).toHaveClass("custom-radio")
    expect(screen.getByRole("radio", { name: "Email" })).toBeChecked()
    expect(screen.getByText("Phone")).toHaveClass("text-sm")
  })
})
