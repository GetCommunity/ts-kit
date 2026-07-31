import { fireEvent, render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"
import { createSignal } from "solid-js"

import SelectMultipleInput from "@/registry/kobalte/form-inputs/select-multi-input.ui"

type Option = {
  description?: Array<string> | string | number
  disabled?: boolean
  label: string
  value: string
}

const options: Array<Option> = [
  { description: ["First", "choice"], label: "Alpha", value: "alpha" },
  { description: "Second choice", label: "Beta", value: "beta" },
  { description: 3, disabled: true, label: "Gamma", value: "gamma" },
  { label: "Delta", value: "delta" }
]

const user = userEvent.setup()

describe("SelectMultipleInput", () => {
  it("removes selected values, clears all, and renders option descriptions", async () => {
    const [value, setValue] = createSignal<Array<Option>>([options[0]!, options[1]!])
    const { container } = render(() => (
      <>
        <SelectMultipleInput
          name="multi-select"
          value={value()}
          onChange={setValue}
          options={options}
          optionValue="value"
          optionTextValue="label"
          optionDescriptionValue="description"
          optionDisabled={(option) => !!option.disabled}
          placeholder="Choose several"
          label="Multi select"
          description="Select several options."
          required
          error={["Too many selections"]}
          autofocus
        />
        <output aria-label="multi-select value">
          {value()
            .map((option) => option.label)
            .join(",")}
        </output>
      </>
    ))

    expect(screen.getByText("Multi select")).toBeInTheDocument()
    expect(screen.getByText("Too many selections")).toBeInTheDocument()
    const closeButtons = container.querySelectorAll('button[type="button"]')
    fireEvent.pointerDown(closeButtons[1]!)
    await user.click(closeButtons[1]!)
    expect(screen.getByLabelText("multi-select value")).toHaveTextContent("Beta")

    const updatedButtons = container.querySelectorAll('button[type="button"]')
    fireEvent.pointerDown(updatedButtons[updatedButtons.length - 1]!)
    await user.click(updatedButtons[updatedButtons.length - 1]!)
    expect(screen.getByLabelText("multi-select value").textContent).toBe("")

    const trigger = container.querySelector('button[aria-haspopup="listbox"]')!
    fireEvent.pointerDown(trigger)
    expect(await screen.findByRole("option", { name: /Alpha/ })).toBeInTheDocument()
    expect(screen.getByText("First, choice")).toBeInTheDocument()
  })
})
