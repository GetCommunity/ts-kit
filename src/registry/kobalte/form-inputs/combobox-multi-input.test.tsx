import { fireEvent, render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"
import { createSignal } from "solid-js"

import ComboboxMultiInput from "@/registry/kobalte/form-inputs/combobox-multi-input"

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

describe("ComboboxMultiInput", () => {
  it("renders selected items, removes one, and clears all", async () => {
    const [value, setValue] = createSignal<Array<Option>>([options[0]!, options[1]!])
    const { container } = render(() => (
      <>
        <ComboboxMultiInput
          name="multi-combobox"
          value={value()}
          onChange={setValue}
          options={options}
          optionValue="value"
          optionTextValue="label"
          optionLabel="label"
          optionDescriptionValue="description"
          optionDisabled={(option) => !!option.disabled}
          placeholder="Search several"
          triggerLabel="Several choices"
          label="Multi combobox"
          description="Search for several."
          orientation="horizontal"
          required
          error={["Invalid choices"]}
          open
        />
        <output aria-label="multi-combobox value">
          {value()
            .map((option) => option.label)
            .join(",")}
        </output>
      </>
    ))

    expect(screen.getByText("Multi combobox")).toBeInTheDocument()
    expect(screen.getByText("Invalid choices").parentElement).toHaveClass("col-span-2")
    expect(screen.getAllByText("Alpha").length).toBeGreaterThan(1)
    expect(screen.getByText("First, choice")).toBeInTheDocument()

    const buttons = container.querySelectorAll('button[type="button"]')
    fireEvent.pointerDown(buttons[0]!)
    await user.click(buttons[0]!)
    expect(screen.getByLabelText("multi-combobox value")).toHaveTextContent("Beta")

    const clearButton = container.querySelector("button.self-center")
    fireEvent.pointerDown(clearButton!)
    await user.click(clearButton!)
    expect(screen.getByLabelText("multi-combobox value").textContent).toBe("")
  })

  it("renders without selected tags in the vertical orientation", async () => {
    render(() => (
      <ComboboxMultiInput
        name="empty-combobox"
        value={[]}
        onChange={vi.fn()}
        options={options}
        optionValue="value"
        optionTextValue="label"
        optionLabel="label"
        optionDisabled={() => false}
        placeholder="Empty"
        label="Empty combobox"
        error={["Empty choices are invalid"]}
        open={false}
      />
    ))

    expect(screen.getByRole("combobox")).toHaveValue("")
  })
})
