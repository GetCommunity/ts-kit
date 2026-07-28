import {
  CalendarDate,
  CalendarDateTime,
  Time,
  ZonedDateTime
} from "@internationalized/date"

import {
  calcDaysInMonth,
  formatDateTimeValue,
  formatDateValueLong,
  formatTimeInputValue,
  formatTimePart,
  getDateTimeZone,
  getTimeValue,
  isLeapYear,
  parseTimeInputValue
} from "@/lib/utils/dates"

describe("date utilities", () => {
  it("extracts a time or falls back to midnight", () => {
    expect(getTimeValue()).toEqual(new Time(0, 0, 0, 0))
    expect(getTimeValue(new CalendarDate(2026, 7, 27))).toEqual(new Time(0, 0, 0, 0))
    expect(getTimeValue(new CalendarDateTime(2026, 7, 27, 9, 8, 7, 6))).toEqual(
      new Time(9, 8, 7, 6)
    )
  })

  it("gets the value time zone or an explicit/default fallback", () => {
    const zoned = new ZonedDateTime(2026, 7, 27, "America/Los_Angeles", 0)

    expect(getDateTimeZone(zoned)).toBe("America/Los_Angeles")
    expect(getDateTimeZone(new CalendarDate(2026, 7, 27), "Europe/London")).toBe(
      "Europe/London"
    )
    expect(getDateTimeZone(new CalendarDate(2026, 7, 27))).toBe("UTC")
  })

  it.each([
    ["00:00", new Time(0, 0)],
    ["9:05", new Time(9, 5)],
    ["23:59", new Time(23, 59)],
    ["12:", new Time(12, 0)],
    [":30", new Time(0, 30)],
    ["12:30:00", new Time(12, 30)]
  ])("parses valid time input %s", (value, expected) => {
    expect(parseTimeInputValue(value)).toEqual(expected)
  })

  it.each(["", "12", "noon", "24:00", "12:60", "-1:00", "1:-1"])(
    "rejects invalid time input %s",
    (value) => {
      expect(parseTimeInputValue(value)).toBeNull()
    }
  )

  it("formats date and time values for display and native inputs", () => {
    expect(formatTimePart(5)).toBe("05")
    expect(formatTimePart(12)).toBe("12")
    expect(formatDateValueLong(new CalendarDate(2026, 7, 27))).toBe("July 27, 2026")
    expect(formatTimeInputValue()).toBe("")
    expect(formatTimeInputValue(new CalendarDate(2026, 7, 27))).toBe("00:00")
    expect(formatTimeInputValue(new CalendarDateTime(2026, 7, 27, 9, 5))).toBe("09:05")
    expect(formatDateTimeValue(new CalendarDateTime(2026, 7, 27, 9, 5))).toBe(
      "July 27, 2026 at 9:05 AM"
    )
  })

  it("recognizes leap years and calculates month lengths", () => {
    expect(isLeapYear(2024)).toBe(true)
    expect(isLeapYear(1900)).toBe(false)
    expect(isLeapYear(2000)).toBe(true)
    expect(isLeapYear(2023)).toBe(false)

    expect(calcDaysInMonth(2024, 2)).toBe(29)
    expect(calcDaysInMonth(2023, 2)).toBe(28)
    expect(calcDaysInMonth(2026, 1)).toBe(31)
    expect(calcDaysInMonth(2026, 4)).toBe(30)
    expect(() => calcDaysInMonth(2026, 0)).toThrow("invalid month")
    expect(() => calcDaysInMonth(2026, 13)).toThrow("invalid month")
  })
})
