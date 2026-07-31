import { render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"

import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption
} from "@/registry/kobalte/ui/native-select"

const user = userEvent.setup()

describe("NativeSelect", () => {
  it("renders native options and supports selection", async () => {
    const handleChange = vi.fn()

    render(() => (
      <NativeSelect
        aria-label="Timezone"
        size="sm"
        class="custom-select"
        onChange={handleChange}
      >
        <NativeSelectOptGroup label="Americas">
          <NativeSelectOption value="la">Los Angeles</NativeSelectOption>
          <NativeSelectOption value="ny">New York</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    ))

    const select = screen.getByRole("combobox", { name: "Timezone" })

    expect(select.parentElement).toHaveAttribute("data-size", "sm")
    expect(select.parentElement).toHaveClass("custom-select")
    expect(screen.getByRole("group", { name: "Americas" })).toHaveAttribute(
      "data-slot",
      "native-select-optgroup"
    )

    await user.selectOptions(select, "ny")

    expect(select).toHaveValue("ny")
    expect(handleChange).toHaveBeenCalledOnce()
  })
})
