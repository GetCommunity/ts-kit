import { fireEvent, render, screen } from "@solidjs/testing-library"
import { createSignal } from "solid-js"

import CheckboxInput from "@/registry/new-york/form-inputs/checkbox-input"
import CheckboxSwitchInput from "@/registry/new-york/form-inputs/checkbox-switch-input"
import ComboboxInput from "@/registry/new-york/form-inputs/combobox-input"
import ComboboxMultiInput from "@/registry/new-york/form-inputs/combobox-multi-input"
import RadioGroupInput from "@/registry/new-york/form-inputs/radio-group-input"
import SelectInput from "@/registry/new-york/form-inputs/select-input.ui"
import SelectMultipleInput from "@/registry/new-york/form-inputs/select-multi-input.ui"

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

describe("CheckboxInput", () => {
  it("renders a decorated horizontal checkbox and toggles from its row", () => {
    const [checked, setChecked] = createSignal(false)
    const { container } = render(() => (
      <CheckboxInput
        name="terms"
        value="accepted"
        checked={checked()}
        onChange={setChecked}
        label="Terms"
        description="Review the agreement."
        itemLabel="Accept terms"
        itemDescription="Required to continue."
        orientation="horizontal"
        required
        error={["Acceptance is required"]}
        hidden
        class="checkbox-class"
      />
    ))

    expect(screen.getByText("Terms")).toBeInTheDocument()
    expect(screen.getByText("Review the agreement.")).toBeInTheDocument()
    expect(screen.getByText("Required to continue.")).toBeInTheDocument()
    expect(screen.getByText("Acceptance is required")).toBeInTheDocument()
    expect(container.firstElementChild).toHaveClass(
      "grid-cols-2",
      "hidden",
      "checkbox-class"
    )

    fireEvent.click(screen.getByText("Accept terms"))
    expect(screen.getByRole("checkbox")).toBeChecked()
    fireEvent.click(screen.getByText("Accept terms"))
    expect(screen.getByRole("checkbox")).not.toBeChecked()
  })

  it("does not toggle when disabled and supports the vertical checked state", () => {
    const onChange = vi.fn()
    const { container } = render(() => (
      <CheckboxInput
        name="updates"
        value="yes"
        checked
        onChange={onChange}
        label="Updates"
        itemLabel="Receive updates"
        itemDescription="Occasional messages."
        error={["Updates unavailable"]}
        disabled
      />
    ))

    expect(screen.getByRole("checkbox")).toBeChecked()
    expect(container.firstElementChild).toHaveClass("cursor-not-allowed")
    fireEvent.click(screen.getByText("Receive updates"))
    expect(onChange).not.toHaveBeenCalled()
  })

  it("renders a plain vertical checkbox without error styling", () => {
    render(() => (
      <CheckboxInput
        name="plain-checkbox"
        value="yes"
        checked={false}
        onChange={vi.fn()}
        label="Plain checkbox"
        itemLabel="Plain item"
        itemDescription="Plain checkbox description"
      />
    ))
    expect(screen.getByText("Plain checkbox description")).toBeInTheDocument()
  })
})

describe("CheckboxSwitchInput", () => {
  it("renders, toggles, and forwards key presses", () => {
    const [checked, setChecked] = createSignal(false)
    const onKeyPress = vi.fn()
    const { container } = render(() => (
      <CheckboxSwitchInput
        name="notifications"
        value={1}
        checked={checked()}
        onChange={setChecked}
        onKeyPress={onKeyPress}
        label="Notifications"
        description="Control alerts."
        itemLabel="Toggle notifications"
        itemDescription="Email and push."
        switchClass="switch-class"
        orientation="horizontal"
        required
        error={["Choose a setting"]}
      />
    ))

    expect(screen.getByText("Notifications")).toBeInTheDocument()
    expect(screen.getByText("Control alerts.")).toBeInTheDocument()
    expect(screen.getByText("Email and push.")).toBeInTheDocument()
    expect(screen.getByText("Choose a setting")).toBeInTheDocument()
    expect(container.firstElementChild).toHaveClass("grid-cols-2")

    const switchRow = container.querySelector(".switch-class") as HTMLElement
    fireEvent.click(switchRow)
    expect(screen.getByRole("switch")).toBeChecked()
    fireEvent.keyPress(switchRow, { key: "Enter" })
    expect(onKeyPress).toHaveBeenCalledOnce()
  })

  it("handles its item label and ignores row events when disabled", () => {
    const labelChange = vi.fn()
    const first = render(() => (
      <CheckboxSwitchInput
        name="label-switch"
        value="enabled"
        checked
        onChange={labelChange}
        label="Label"
        itemLabel="Label switch"
        itemDescription="Plain description"
      />
    ))
    fireEvent.click(screen.getByText("Label switch"))
    expect(labelChange).toHaveBeenCalledWith(false)
    first.unmount()

    const disabledChange = vi.fn()
    const onKeyPress = vi.fn()
    const second = render(() => (
      <CheckboxSwitchInput
        name="disabled-switch"
        value="disabled"
        checked={false}
        onChange={disabledChange}
        onKeyPress={onKeyPress}
        error={["Disabled error"]}
        orientation="vertical"
        itemDescription="Disabled setting"
        switchClass="disabled-row"
        disabled
      />
    ))
    const row = second.container.querySelector(".disabled-row") as HTMLElement
    fireEvent.click(row)
    fireEvent.keyPress(row, { key: "Enter" })
    expect(disabledChange).not.toHaveBeenCalled()
    expect(onKeyPress).not.toHaveBeenCalled()
  })
})

describe("RadioGroupInput", () => {
  it("supports primitive options and reports selection", () => {
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
    fireEvent.click(screen.getByText("Blue"))
    expect(screen.getByRole("radio", { name: "Blue" })).toBeChecked()
    fireEvent.click(screen.getByText("Red"))
    expect(screen.getByRole("radio", { name: "Red" })).toBeChecked()
  })

  it("supports object options, descriptions, horizontal errors, and disabled state", () => {
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
    fireEvent.click(screen.getByRole("option", { name: /Beta/ }))
    expect(screen.getByRole("button")).toHaveTextContent("Beta")
  })
})

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
    fireEvent.click(closeButtons[1]!)
    expect(screen.getByLabelText("multi-select value")).toHaveTextContent("Beta")

    const updatedButtons = container.querySelectorAll('button[type="button"]')
    fireEvent.pointerDown(updatedButtons[updatedButtons.length - 1]!)
    fireEvent.click(updatedButtons[updatedButtons.length - 1]!)
    expect(screen.getByLabelText("multi-select value").textContent).toBe("")

    const trigger = container.querySelector('button[aria-haspopup="listbox"]')!
    fireEvent.pointerDown(trigger)
    expect(await screen.findByRole("option", { name: /Alpha/ })).toBeInTheDocument()
    expect(screen.getByText("First, choice")).toBeInTheDocument()
  })
})

describe("ComboboxInput", () => {
  it("renders open options and emits a selected value", () => {
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

    fireEvent.click(screen.getByRole("option", { name: /Beta/ }))
    expect(screen.getByRole("combobox")).toHaveValue("Beta")
  })
})

describe("ComboboxMultiInput", () => {
  it("renders selected items, removes one, and clears all", () => {
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
    fireEvent.click(buttons[0]!)
    expect(screen.getByLabelText("multi-combobox value")).toHaveTextContent("Beta")

    const clearButton = container.querySelector("button.self-center")
    fireEvent.pointerDown(clearButton!)
    fireEvent.click(clearButton!)
    expect(screen.getByLabelText("multi-combobox value").textContent).toBe("")
  })

  it("renders without selected tags in the vertical orientation", () => {
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

  it("renders a plain vertical single combobox", () => {
    render(() => (
      <ComboboxInput
        name="plain-combobox"
        value={undefined}
        onChange={vi.fn()}
        options={options}
        optionValue="value"
        optionTextValue="label"
        optionLabel="label"
        optionDisabled={() => false}
        placeholder="Plain"
        label="Plain combobox"
        error={["Plain choice is invalid"]}
        open={false}
      />
    ))
    expect(screen.getByText("Plain combobox")).toBeInTheDocument()
  })
})
