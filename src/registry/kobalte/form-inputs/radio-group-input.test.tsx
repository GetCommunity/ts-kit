import { render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"
import { createSignal } from "solid-js"

import RadioGroupInput from "@/registry/kobalte/form-inputs/radio-group-input"

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

describe("RadioGroupInput", () => {
  it("supports primitive options and reports selection", async () => {
    const [value, setValue] = createSignal<string | null>(null)
    render(() => (
      <RadioGroupInput
        name="color"
        value={value()}
        options={["Red", "Blue"]}
        onChange={setValue}
        label="Color"
        description="Pick one."
        required
      />
    ))

    expect(screen.getByText("Color")).toBeInTheDocument()
    expect(screen.getByText("Pick one.")).toBeInTheDocument()
    await user.click(screen.getByText("Blue"))
    expect(screen.getByRole("radio", { name: "Blue" })).toBeChecked()
    await user.click(screen.getByText("Red"))
    expect(screen.getByRole("radio", { name: "Red" })).toBeChecked()
  })

  it("supports object options, descriptions, horizontal errors, and disabled state", async () => {
    const onChange = vi.fn()
    const { container } = render(() => (
      <RadioGroupInput
        name="plan"
        value="alpha"
        options={options}
        optionValue="value"
        optionTextValue="label"
        optionDescriptionValue="description"
        onChange={onChange}
        orientation="horizontal"
        disabled
        error={["Plan is unavailable"]}
        label="Plan"
      />
    ))

    expect(screen.getByText("Alpha")).toBeInTheDocument()
    expect(screen.getByText("Firstchoice")).toBeInTheDocument()
    expect(screen.getByText("Plan is unavailable")).toBeInTheDocument()
    expect(container.querySelector(".flex-row")).toBeInTheDocument()
  })
})
