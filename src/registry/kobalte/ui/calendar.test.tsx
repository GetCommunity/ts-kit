import { render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"

import { Calendar } from "@/registry/kobalte/ui/calendar"

const user = userEvent.setup()

describe("Calendar", () => {
  it("renders a deterministic month with navigation, week numbers, and custom cells", async () => {
    const handleMonthChange = vi.fn()

    render(() => (
      <Calendar
        defaultMonth={new Date(2026, 0, 1)}
        weekNumbers
        class="custom-calendar"
        onMonthChange={handleMonthChange}
        customCell={({ date, isOutsideMonth }) => (
          <span data-testid={isOutsideMonth ? "outside-cell" : "inside-cell"}>
            day-{date.getDate()}
          </span>
        )}
      />
    ))

    expect(screen.getByText("January 2026")).toHaveAttribute(
      "data-slot",
      "calendar-label"
    )
    expect(
      screen.getByText("January 2026").closest("[data-slot='calendar']")
    ).toHaveClass("custom-calendar")
    expect(screen.getAllByTestId("inside-cell").length).toBeGreaterThan(20)
    expect(
      document.querySelector("[data-slot='calendar-week-number-header']")
    ).toHaveTextContent("#")

    await user.click(screen.getByRole("button", { name: "Next month" }))

    expect(handleMonthChange).toHaveBeenCalledWith(expect.any(Date))
  })

  it("marks selected, disabled, and booked days", () => {
    const selected = new Date(2026, 0, 15)

    render(() => (
      <Calendar
        value={selected}
        month={new Date(2026, 0, 1)}
        disabled={(date) => date.getDate() === 14}
        booked={(date) => date.getDate() === 16}
      />
    ))

    const selectedCell = document.querySelector(
      "[data-slot='calendar-day'][data-selected='true']"
    )
    const bookedButton = Array.from(
      document.querySelectorAll<HTMLElement>("[data-slot='calendar-day-button']")
    ).find((button) => button.firstElementChild?.textContent === "16")

    expect(selectedCell).toBeInTheDocument()
    expect(bookedButton).toHaveClass("line-through")
  })

  it("supports month and year selection", async () => {
    render(() => (
      <Calendar
        defaultMonth={new Date(2026, 0, 1)}
        monthYearSelection
        startYear={2025}
        endYear={2027}
      />
    ))

    await user.click(screen.getByRole("button", { name: "Jan" }))
    await user.click(screen.getByRole("option", { name: "Feb" }))
    expect(screen.getByRole("button", { name: "Feb" })).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "2026" }))
    await user.click(screen.getByRole("option", { name: "2027" }))
    expect(screen.getByRole("button", { name: "2027" })).toBeInTheDocument()
  })

  it("renders multiple and range selections", () => {
    const { unmount } = render(() => (
      <Calendar
        mode="multiple"
        month={new Date(2026, 0, 1)}
        value={[new Date(2026, 0, 5), new Date(2026, 0, 7)]}
      />
    ))

    expect(getCurrentMonthDay(5).closest("[data-slot='calendar-day']")).toHaveAttribute(
      "data-selected",
      "true"
    )
    expect(getCurrentMonthDay(7).closest("[data-slot='calendar-day']")).toHaveAttribute(
      "data-selected",
      "true"
    )

    unmount()

    render(() => (
      <Calendar
        mode="range"
        month={new Date(2026, 0, 1)}
        value={{ from: new Date(2026, 0, 10), to: new Date(2026, 0, 15) }}
      />
    ))

    expect(getCurrentMonthDay(10)).toHaveClass("rounded-l-(--cell-radius)")
    expect(getCurrentMonthDay(12)).toHaveClass("rounded-none", "bg-muted")
    expect(getCurrentMonthDay(15)).toHaveClass("rounded-r-(--cell-radius)")
  })

  it("hides outside days and handles an incomplete range", () => {
    render(() => (
      <Calendar
        mode="range"
        month={new Date(2026, 1, 1)}
        value={{ from: new Date(2026, 1, 10), to: null }}
        showOutsideDays={false}
        fixedWeeks
        numberOfMonths={2}
      />
    ))

    expect(document.querySelectorAll("[data-slot='calendar-month']")).toHaveLength(2)
    expect(document.querySelectorAll("td.flex-1.p-0").length).toBeGreaterThan(0)
    expect(getCurrentMonthDay(10)).toHaveClass("rounded-l-(--cell-radius)")
  })
})

function getCurrentMonthDay(day: number) {
  const button = Array.from(
    document.querySelectorAll<HTMLElement>("[data-slot='calendar-day-button']")
  ).find(
    (candidate) =>
      candidate.firstElementChild?.textContent === String(day) &&
      !candidate.hasAttribute("data-outside")
  )

  expect(button, `day ${day} in the current month`).toBeDefined()
  return button!
}
