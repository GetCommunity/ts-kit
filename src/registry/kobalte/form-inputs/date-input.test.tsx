import { CalendarDate } from "@internationalized/date"
import { render, screen, waitFor } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"
import { createSignal } from "solid-js"

import DateInput from "@/registry/kobalte/form-inputs/date-input"

const day = new CalendarDate(2026, 7, 27)

function getCalendarDayButtons() {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-scope="date-picker"][data-part="table-cell-trigger"]'
    )
  )
}

const user = userEvent.setup()

describe("DateInput", () => {
  it("renders its calendar, decorations, default format, and clears without a tooltip", async () => {
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
    await user.click(clear)
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
    await user.click(selectableDay!)
    await waitFor(() =>
      expect(screen.getByLabelText("custom date value")).not.toHaveTextContent(
        "2026-07-27"
      )
    )

    const clear = Array.from(container.querySelectorAll("button")).find(
      (button) => !button.getAttribute("aria-label")
    )
    await user.click(clear!)
    expect(screen.getByLabelText("custom date value").textContent).toBe("")
  })

  it("disables clearing when empty or disabled", async () => {
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

  it("renders an errored tooltip clear action", async () => {
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
