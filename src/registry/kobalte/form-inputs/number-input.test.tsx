import { fireEvent, render, screen } from "@solidjs/testing-library"
import { createSignal } from "solid-js"

import NumberInput from "@/registry/kobalte/form-inputs/number-input"

describe("NumberInput", () => {
  it("renders decorations and reports numeric, grouped, and empty input", async () => {
    const [value, setValue] = createSignal<number | null>(12)
    render(() => (
      <NumberInput
        name="quantity"
        value={value()}
        onChange={setValue}
        label="Quantity"
        description="Enter an amount."
        placeholder="0"
        required
        error={["Invalid amount"]}
        class="number-class"
      />
    ))

    const input = screen.getByRole("spinbutton")
    expect(screen.getByText("Quantity")).toBeInTheDocument()
    expect(screen.getByText("Enter an amount.")).toBeInTheDocument()
    expect(screen.getByText("Invalid amount")).toBeInTheDocument()

    fireEvent.input(input, { target: { value: "1234.5" } })
    expect(input).toHaveValue("1234.5")
    fireEvent.input(input, { target: { value: "" } })
    expect(input).toHaveValue("")
  })
})
