import { Time } from "@internationalized/date"
import { fireEvent, render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"
import { createSignal } from "solid-js"

import TimeInput from "@/registry/kobalte/form-inputs/time-input.ui"

const user = userEvent.setup()

describe("TimeInput", () => {
  it("uses a default value and reports valid, empty, and invalid input", async () => {
    const [value, setValue] = createSignal<Time | null | undefined>(undefined)
    render(() => (
      <>
        <TimeInput
          name="start-time"
          value={value()}
          defaultValue={new Time(9, 5)}
          onChange={setValue}
          label="Start"
          description="Local time."
          required
          error={["Time is required"]}
          timeStep={30}
          inputClass="time-class"
        />
        <output aria-label="time value">{value()?.toString() ?? "null"}</output>
      </>
    ))

    const input = screen.getByLabelText(/Start/) as HTMLInputElement
    expect(input).toHaveValue("09:05")
    expect(input).toHaveAttribute("step", "30")
    expect(screen.getByText("Local time.")).toBeInTheDocument()
    expect(screen.getByText("Time is required")).toBeInTheDocument()

    fireEvent.input(input, { target: { value: "14:30" } })
    expect(input).toHaveValue("14:30")
    expect(screen.getByLabelText("time value")).toHaveTextContent("14:30:00")
    fireEvent.input(input, { target: { value: "" } })
    expect(input).toHaveValue("")
    expect(screen.getByLabelText("time value")).toHaveTextContent("null")

    Object.defineProperty(input, "value", {
      configurable: true,
      value: "invalid",
      writable: true
    })
    fireEvent.input(input)
    expect(screen.getByLabelText("time value")).toHaveTextContent("null")
  })

  it("clears a value with either clear-button presentation", async () => {
    const [plainValue, setPlainValue] = createSignal<Time | null>(new Time(10))
    const plain = render(() => (
      <TimeInput name="plain-time" value={plainValue()} onChange={setPlainValue} />
    ))
    await user.click(screen.getByRole("button"))
    expect(screen.getByRole("button")).toBeDisabled()
    plain.unmount()

    const [tooltipValue, setTooltipValue] = createSignal<Time | null>(new Time(11))
    render(() => (
      <TimeInput
        name="tooltip-time"
        value={tooltipValue()}
        onChange={setTooltipValue}
        showTooltip
      />
    ))
    await user.click(screen.getByRole("button"))
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("disables clearing when disabled or empty", async () => {
    const first = render(() => (
      <TimeInput
        name="disabled-time"
        value={new Time(10)}
        onChange={vi.fn()}
        disabled
      />
    ))
    expect(screen.getByRole("button")).toBeDisabled()
    first.unmount()
    render(() => <TimeInput name="empty-time" value={null} onChange={vi.fn()} />)
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("renders a plain label and an errored tooltip clear action", async () => {
    const first = render(() => (
      <TimeInput
        name="labeled-time"
        value={new Time(8)}
        onChange={vi.fn()}
        label="Labeled time"
      />
    ))
    expect(screen.getByText("Labeled time")).toBeInTheDocument()
    first.unmount()

    render(() => (
      <TimeInput
        name="errored-tooltip-time"
        value={new Time(8)}
        onChange={vi.fn()}
        showTooltip
        error={["Invalid time"]}
      />
    ))
    expect(screen.getByText("Invalid time")).toBeInTheDocument()
  })
})
