import { fireEvent, render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"
import { createSignal } from "solid-js"

import CheckboxSwitchInput from "@/registry/kobalte/form-inputs/checkbox-switch-input"

const user = userEvent.setup()

describe("CheckboxSwitchInput", () => {
  it("renders, toggles, and forwards key presses", async () => {
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
    await user.click(switchRow)
    expect(screen.getByRole("switch")).toBeChecked()
    fireEvent.keyPress(switchRow, { key: "Enter" })
    expect(onKeyPress).toHaveBeenCalledOnce()
  })

  it("handles its item label and ignores row events when disabled", async () => {
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
    await user.click(screen.getByText("Label switch"))
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
    await user.click(row)
    fireEvent.keyPress(row, { key: "Enter" })
    expect(disabledChange).not.toHaveBeenCalled()
    expect(onKeyPress).not.toHaveBeenCalled()
  })
})
