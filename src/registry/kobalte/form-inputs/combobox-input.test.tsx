import { render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"
import { createSignal } from "solid-js"

import ComboboxInput from "@/registry/kobalte/form-inputs/combobox-input"

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

describe("ComboboxInput", () => {
  it("renders open options and emits a selected value", async () => {
    const [value, setValue] = createSignal<Option>()
    render(() => (
      <ComboboxInput
        name="single-combobox"
        value={value()}
        onChange={setValue}
        options={options}
        optionValue="value"
        optionTextValue="label"
        optionLabel="label"
        optionDescriptionValue="description"
        optionDisabled={(option) => !!option.disabled}
        placeholder="Search options"
        label="Single combobox"
        description="Search for one."
        orientation="horizontal"
        required
        error={["Invalid choice"]}
        open
      />
    ))

    expect(screen.getByRole("combobox")).toHaveValue("")
    expect(screen.getByText("Single combobox")).toBeInTheDocument()
    expect(screen.getByText("First, choice")).toBeInTheDocument()
    expect(screen.getByText("Second choice")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
    expect(screen.getByText("Invalid choice").parentElement).toHaveClass("col-span-2")

    await user.click(screen.getByRole("option", { name: /Beta/ }))
    expect(screen.getByRole("combobox")).toHaveValue("Beta")
  })

  it("uses the vertical layout and optional defaults", () => {
    render(() => (
      <ComboboxInput
        name="vertical-combobox"
        value={undefined}
        onChange={vi.fn()}
        options={options}
        optionValue="value"
        optionTextValue="label"
        optionLabel="label"
        optionDisabled={() => false}
        placeholder="Choose an option"
        error={["Choose a valid option"]}
      />
    ))

    const root = screen.getByRole("combobox").closest(".grid")

    expect(root).toHaveClass("gap-1.5")
    expect(root).not.toHaveClass("grid-cols-2")
    expect(screen.getByText("Choose a valid option").parentElement).not.toHaveClass(
      "col-span-2"
    )
  })
})
