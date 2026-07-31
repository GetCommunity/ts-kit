import { CalendarDateTime } from "@internationalized/date"
import { fireEvent, render, screen, waitFor } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"
import { createSignal } from "solid-js"

import DateTimeInput from "@/registry/kobalte/form-inputs/datetime-input"

function getCalendarDayButtons() {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-scope="date-picker"][data-part="table-cell-trigger"]'
    )
  )
}

const user = userEvent.setup()

describe("DateTimeInput", () => {
  const dateTime = new CalendarDateTime(2026, 7, 27, 9, 5)

  it("renders date/time state and reports valid and invalid time edits", async () => {
    const [value, setValue] = createSignal([dateTime])
    const { container } = render(() => (
      <>
        <DateTimeInput
          name="appointment"
          value={value()}
          onChange={setValue}
          label="Appointment"
          description="Choose date and time."
          placeholder="When?"
          required
          error={["Appointment is invalid"]}
          timeZone="UTC"
          timeStep={30}
          defaultOpen
          closeOnSelect={false}
          class="datetime-class"
          inputClass="date-part-class"
          timeInputClass="time-part-class"
        />
        <output aria-label="appointment value">
          {value()
            .map((entry) => entry.toString())
            .join(",")}
        </output>
      </>
    ))

    expect(screen.getByText("Appointment")).toBeInTheDocument()
    expect(screen.getByText("Choose date and time.")).toBeInTheDocument()
    expect(screen.getByText("Appointment is invalid")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("When?")).toHaveValue("July 27, 2026 at 9:05 AM")

    const timeInput = screen.getByLabelText("Appointment time")
    expect(timeInput).toHaveValue("09:05")
    expect(timeInput).toHaveAttribute("step", "30")
    fireEvent.input(timeInput, { target: { value: "14:45" } })
    expect(timeInput).toHaveValue("14:45")
    expect(screen.getByLabelText("appointment value")).toHaveTextContent(
      "2026-07-27T14:45:00"
    )

    Object.defineProperty(timeInput, "value", {
      configurable: true,
      value: "invalid",
      writable: true
    })
    fireEvent.input(timeInput)
    expect(screen.getByLabelText("appointment value")).toHaveTextContent(
      "2026-07-27T14:45:00"
    )

    const selectableDay = getCalendarDayButtons().find(
      (button) =>
        button.hasAttribute("data-selectable") &&
        button.getAttribute("data-selected") === null
    )
    await user.click(selectableDay!)
    await waitFor(() =>
      expect(screen.getByLabelText("appointment value")).not.toHaveTextContent(
        "2026-07-27T14:45:00"
      )
    )

    const clear = Array.from(container.querySelectorAll("button")).find(
      (button) => !button.getAttribute("aria-label")
    )
    await user.click(clear!)
    expect(screen.getByLabelText("appointment value").textContent).toBe("")
  })

  it("uses a custom formatter and tooltip clear presentation", async () => {
    const [value, setValue] = createSignal([dateTime])
    const format = vi.fn(() => "Custom date and time")
    const { container } = render(() => (
      <>
        <DateTimeInput
          name="custom-appointment"
          value={value()}
          onChange={setValue}
          format={format}
          showTooltip
        />
        <output aria-label="custom appointment value">
          {value()
            .map((entry) => entry.toString())
            .join(",")}
        </output>
      </>
    ))

    expect(screen.getByRole("textbox")).toHaveValue("Custom date and time")
    expect(format).toHaveBeenCalled()
    const clear = Array.from(container.querySelectorAll("button")).find(
      (button) => !button.getAttribute("aria-label")
    )
    await user.click(clear!)
    expect(screen.getByLabelText("custom appointment value").textContent).toBe("")
  })

  it("disables time and clear controls without a date or when read-only", async () => {
    const empty = render(() => (
      <DateTimeInput name="empty-appointment" value={[]} onChange={vi.fn()} />
    ))
    expect(screen.getByLabelText("empty-appointment time")).toBeDisabled()
    expect(
      Array.from(empty.container.querySelectorAll("button")).find(
        (button) => !button.getAttribute("aria-label")
      )
    ).toBeDisabled()
    empty.unmount()

    render(() => (
      <DateTimeInput
        name="readonly-appointment"
        value={[dateTime]}
        onChange={vi.fn()}
        readOnly
      />
    ))
    expect(screen.getByLabelText("readonly-appointment time")).toBeDisabled()
  })

  it("renders a plain label and an errored tooltip clear action", async () => {
    const first = render(() => (
      <DateTimeInput
        name="plain-appointment"
        value={[dateTime]}
        onChange={vi.fn()}
        label="Plain appointment"
      />
    ))
    expect(screen.getByText("Plain appointment")).toBeInTheDocument()
    first.unmount()

    render(() => (
      <DateTimeInput
        name="errored-tooltip-appointment"
        value={[dateTime]}
        onChange={vi.fn()}
        showTooltip
        error={["Invalid appointment"]}
      />
    ))
    expect(screen.getByText("Invalid appointment")).toBeInTheDocument()
  })
})
