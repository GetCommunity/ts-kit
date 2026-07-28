import { CalendarDate, CalendarDateTime } from "@internationalized/date"
import { fireEvent, render, screen, waitFor } from "@solidjs/testing-library"
import { createSignal } from "solid-js"

import DateInput from "@/registry/new-york/form-inputs/date-input"
import DateRangeInput from "@/registry/new-york/form-inputs/date-range-input"
import DateTimeInput from "@/registry/new-york/form-inputs/datetime-input"

const day = new CalendarDate(2026, 7, 27)
const nextDay = new CalendarDate(2026, 7, 28)

function getCalendarDayButtons() {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-scope="date-picker"][data-part="table-cell-trigger"]'
    )
  )
}

describe("DateInput", () => {
  it("renders its calendar, decorations, default format, and clears without a tooltip", () => {
    const [value, setValue] = createSignal([day])
    const { container } = render(() => (
      <>
        <DateInput
          name="publish-date"
          value={value()}
          onChange={setValue}
          label="Publish date"
          description="Choose a publication date."
          placeholder="Choose date"
          required
          error={["Date is unavailable"]}
          defaultOpen
          closeOnSelect={false}
          timeZone="UTC"
          class="date-class"
          inputClass="date-input-class"
        />
        <output aria-label="publish date value">
          {value()
            .map((entry) => entry.toString())
            .join(",")}
        </output>
      </>
    ))

    expect(screen.getByText("Publish date")).toBeInTheDocument()
    expect(screen.getByText("Choose a publication date.")).toBeInTheDocument()
    expect(screen.getByText("Date is unavailable")).toBeInTheDocument()
    expect(screen.getByRole("textbox")).toHaveValue("July 27, 2026")
    expect(screen.getByRole("textbox")).toHaveClass("date-input-class")
    expect(container.querySelector(".date-class")).toBeInTheDocument()
    expect(getCalendarDayButtons().length).toBeGreaterThan(20)

    const clear = container.querySelector(
      "button:not([aria-label])"
    ) as HTMLButtonElement
    fireEvent.click(clear)
    expect(screen.getByLabelText("publish date value").textContent).toBe("")
  })

  it("uses a custom formatter, emits calendar selection, and clears with a tooltip", async () => {
    const [value, setValue] = createSignal([day])
    const format = vi.fn(() => "Custom date")
    const { container } = render(() => (
      <>
        <DateInput
          name="custom-date"
          value={value()}
          onChange={setValue}
          format={format}
          open={() => true}
          showTooltip
        />
        <output aria-label="custom date value">
          {value()
            .map((entry) => entry.toString())
            .join(",")}
        </output>
      </>
    ))

    expect(screen.getByRole("textbox")).toHaveValue("Custom date")
    expect(format).toHaveBeenCalled()

    const selectableDay = getCalendarDayButtons().find(
      (button) =>
        button.hasAttribute("data-selectable") &&
        button.getAttribute("data-selected") === null
    )
    fireEvent.click(selectableDay!)
    await waitFor(() =>
      expect(screen.getByLabelText("custom date value")).not.toHaveTextContent(
        "2026-07-27"
      )
    )

    const clear = Array.from(container.querySelectorAll("button")).find(
      (button) => !button.getAttribute("aria-label")
    )
    fireEvent.click(clear!)
    expect(screen.getByLabelText("custom date value").textContent).toBe("")
  })

  it("disables clearing when empty or disabled", () => {
    const empty = render(() => (
      <DateInput name="empty-date" value={[]} onChange={vi.fn()} />
    ))
    expect(
      Array.from(empty.container.querySelectorAll("button")).find(
        (button) => !button.getAttribute("aria-label")
      )
    ).toBeDisabled()
    empty.unmount()

    const disabled = render(() => (
      <DateInput
        name="disabled-date"
        value={[day]}
        onChange={vi.fn()}
        label="Disabled date"
        disabled
      />
    ))
    expect(
      Array.from(disabled.container.querySelectorAll("button")).find(
        (button) => !button.getAttribute("aria-label")
      )
    ).toBeDisabled()
  })

  it("renders an errored tooltip clear action", () => {
    render(() => (
      <DateInput
        name="errored-tooltip-date"
        value={[day]}
        onChange={vi.fn()}
        showTooltip
        error={["Invalid date"]}
      />
    ))
    expect(screen.getByText("Invalid date")).toBeInTheDocument()
  })
})

describe("DateRangeInput", () => {
  it("renders a two-month range, default formats both values, and clears", async () => {
    const [value, setValue] = createSignal([day, nextDay])
    const { container } = render(() => (
      <>
        <DateRangeInput
          name="stay"
          value={value()}
          onChange={setValue}
          label="Stay"
          description="Choose arrival and departure."
          required
          error={["Range is invalid"]}
          defaultOpen
          closeOnSelect={false}
          timeZone="UTC"
          class="range-class"
          inputClass="range-input-class"
        />
        <output aria-label="date range value">
          {value()
            .map((entry) => entry.toString())
            .join(",")}
        </output>
      </>
    ))

    expect(screen.getByText("Stay")).toBeInTheDocument()
    expect(screen.getByText("Choose arrival and departure.")).toBeInTheDocument()
    expect(screen.getByText("Range is invalid")).toBeInTheDocument()
    const inputs = screen.getAllByRole("textbox")
    expect(inputs[0]).toHaveValue("July 27, 2026")
    expect(inputs[1]).toHaveValue("July 28, 2026")
    expect(getCalendarDayButtons().length).toBeGreaterThan(50)

    const selectableDay = getCalendarDayButtons().find(
      (button) =>
        button.hasAttribute("data-selectable") &&
        button.getAttribute("data-selected") === null
    )
    fireEvent.click(selectableDay!)
    await waitFor(() =>
      expect(screen.getByLabelText("date range value")).not.toHaveTextContent(
        "2026-07-27,2026-07-28"
      )
    )

    const clear = Array.from(container.querySelectorAll("button")).find(
      (button) => !button.getAttribute("aria-label")
    )
    fireEvent.click(clear!)
    expect(screen.getByLabelText("date range value").textContent).toBe("")
  })

  it("uses a custom formatter and tooltip clear presentation", () => {
    const [value, setValue] = createSignal([day, nextDay])
    const format = vi.fn(() => "Formatted")
    const { container } = render(() => (
      <>
        <DateRangeInput
          name="formatted-range"
          value={value()}
          onChange={setValue}
          format={format}
          showTooltip
        />
        <output aria-label="formatted range value">
          {value()
            .map((entry) => entry.toString())
            .join(",")}
        </output>
      </>
    ))

    expect(screen.getAllByRole("textbox")[0]).toHaveValue("Formatted")
    expect(format).toHaveBeenCalled()
    const clear = Array.from(container.querySelectorAll("button")).find(
      (button) => !button.getAttribute("aria-label")
    )
    fireEvent.click(clear!)
    expect(screen.getByLabelText("formatted range value").textContent).toBe("")
  })

  it("disables clearing for an empty disabled range", () => {
    const { container } = render(() => (
      <DateRangeInput
        name="empty-range"
        value={[]}
        onChange={vi.fn()}
        label="Empty range"
        disabled
      />
    ))
    expect(
      Array.from(container.querySelectorAll("button")).find(
        (button) => !button.getAttribute("aria-label")
      )
    ).toBeDisabled()
  })

  it("renders an errored tooltip clear action", () => {
    render(() => (
      <DateRangeInput
        name="errored-tooltip-range"
        value={[day, nextDay]}
        onChange={vi.fn()}
        showTooltip
        error={["Invalid range"]}
      />
    ))
    expect(screen.getByText("Invalid range")).toBeInTheDocument()
  })
})

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
    fireEvent.click(selectableDay!)
    await waitFor(() =>
      expect(screen.getByLabelText("appointment value")).not.toHaveTextContent(
        "2026-07-27T14:45:00"
      )
    )

    const clear = Array.from(container.querySelectorAll("button")).find(
      (button) => !button.getAttribute("aria-label")
    )
    fireEvent.click(clear!)
    expect(screen.getByLabelText("appointment value").textContent).toBe("")
  })

  it("uses a custom formatter and tooltip clear presentation", () => {
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
    fireEvent.click(clear!)
    expect(screen.getByLabelText("custom appointment value").textContent).toBe("")
  })

  it("disables time and clear controls without a date or when read-only", () => {
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

  it("renders a plain label and an errored tooltip clear action", () => {
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
