import { fireEvent, render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"
import { createSignal } from "solid-js"

import SelectInput from "@/registry/kobalte/form-inputs/select-input.ui"

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

describe("SelectInput", () => {
  it("renders a selected object and all option description forms", async () => {
    const [value, setValue] = createSignal<Option | null>(options[0]!)
    render(() => (
      <SelectInput
        name="single-select"
        value={value()}
        onChange={setValue}
        options={options}
        optionValue="value"
        optionTextValue="label"
        optionDescriptionValue="description"
        optionDisabled={(option) => !!option.disabled}
        placeholder="Choose one"
        label="Single select"
        description="Select an option."
        required
        error={["Selection is invalid"]}
        autofocus
        closeOnSelection={false}
      />
    ))

    expect(screen.getByText("Single select")).toBeInTheDocument()
    expect(screen.getByText("Select an option.")).toBeInTheDocument()
    expect(screen.getByText("Selection is invalid")).toBeInTheDocument()
    expect(screen.getByRole("button")).toHaveTextContent("Alpha")

    fireEvent.pointerDown(screen.getByRole("button"))
    expect(await screen.findByRole("option", { name: /Alpha/ })).toBeInTheDocument()
    expect(screen.getByText("First, choice")).toBeInTheDocument()
    expect(screen.getByText("Second choice")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
    await user.click(screen.getByRole("option", { name: /Beta/ }))
    expect(screen.getByRole("button")).toHaveTextContent("Beta")
  })
})
