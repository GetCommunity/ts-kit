import { Time, toCalendarDateTime } from "@internationalized/date"

import type { DateValue } from "@internationalized/date"

export function formatTimePart(value: number) {
  return value.toString().padStart(2, "0")
}

export function getTimeValue(value?: DateValue | Time | null) {
  if (!value || !("hour" in value)) {
    return new Time()
  }
  return new Time(value.hour, value.minute, value.second, value.millisecond)
}

export function getDateTimeZone(value: DateValue, fallbackTimeZone?: string) {
  if ("timeZone" in value) {
    return value.timeZone
  }
  return fallbackTimeZone ?? "UTC"
}

export function parseTimeInputValue(value: string) {
  const [hour, minute] = value.split(":").map(Number)
  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null
  }
  return new Time(hour, minute)
}

export function formatDateValueLong(value: DateValue) {
  const parsedDate = new Date(Date.parse(value.toString()))
  const normalizedDate = new Date(
    parsedDate.getUTCFullYear(),
    parsedDate.getUTCMonth(),
    parsedDate.getUTCDate()
  )
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long"
  }).format(normalizedDate)
}

export function formatTimeInputValue(value?: DateValue | Time | null) {
  if (!value) {
    return ""
  }
  const time = getTimeValue(value)
  return `${formatTimePart(time.hour)}:${formatTimePart(time.minute)}`
}

export function formatDateTimeValue(value: DateValue, fallbackTimeZone?: string) {
  const timeZone = getDateTimeZone(value, fallbackTimeZone)
  const dateTime = toCalendarDateTime(value)

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone
  }).format(dateTime.toDate(timeZone))
}

export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export const calcDaysInMonth = (year: number, month: number): number => {
  if (month < 1 || month > 12) {
    throw new Error("invalid month")
  }
  const daysMap = {
    1: 31,
    2: isLeapYear(year) ? 29 : 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31
  }
  return daysMap[month as Month]
}
