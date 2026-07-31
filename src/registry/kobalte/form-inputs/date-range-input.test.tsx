import { CalendarDate } from "@internationalized/date"
import { render, screen, waitFor } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"
import { createSignal } from "solid-js"

import DateRangeInput from "@/registry/kobalte/form-inputs/date-range-input"

const day = new CalendarDate(2026, 7, 27)
const nextDay = new CalendarDate(2026, 7, 28)

function getCalendarDayButtons() {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-scope="date-picker"][data-part="table-cell-trigger"]'
    )
  )
}

const user = userEvent.setup()

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
    await user.click(selectableDay!)
    await waitFor(() =>
      expect(screen.getByLabelText("date range value")).not.toHaveTextContent(
        "2026-07-27,2026-07-28"
      )
    )

    const clear = Array.from(container.querySelectorAll("button")).find(
      (button) => !button.getAttribute("aria-label")
    )
    await user.click(clear!)
    expect(screen.getByLabelText("date range value").textContent).toBe("")
  })

  it("uses a custom formatter and tooltip clear presentation", async () => {
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
    await user.click(clear!)
    expect(screen.getByLabelText("formatted range value").textContent).toBe("")
  })

  it("disables clearing for an empty disabled range", async () => {
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

  it("renders an errored tooltip clear action", async () => {
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
