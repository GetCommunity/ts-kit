import { render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"
import { createSignal } from "solid-js"

import CheckboxInput from "@/registry/kobalte/form-inputs/checkbox-input"

const user = userEvent.setup()

describe("CheckboxInput", () => {
  it("renders a decorated horizontal checkbox and toggles from its row", async () => {
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

    await user.click(screen.getByText("Accept terms"))
    expect(screen.getByRole("checkbox")).toBeChecked()
    await user.click(screen.getByText("Accept terms"))
    expect(screen.getByRole("checkbox")).not.toBeChecked()
  })

  it("does not toggle when disabled and supports the vertical checked state", async () => {
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
    await user.click(screen.getByText("Receive updates"))
    expect(onChange).not.toHaveBeenCalled()
  })

  it("renders a plain vertical checkbox without error styling", async () => {
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
