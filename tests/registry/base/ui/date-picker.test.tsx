import { render, screen } from "@solidjs/testing-library"

import {
  DatePicker,
  DatePickerContent,
  DatePickerControl,
  DatePickerInput,
  DatePickerLabel,
  DatePickerNextTrigger,
  DatePickerPrevTrigger,
  DatePickerTrigger
} from "@/registry/base/ui/date-picker"

describe("DatePicker", () => {
  it("renders label, input, trigger, and open content", () => {
    render(() => (
      <DatePicker open>
        <DatePickerLabel>Publish date</DatePickerLabel>
        <DatePickerControl>
          <DatePickerInput />
          <DatePickerTrigger />
        </DatePickerControl>
        <DatePickerContent>Calendar content</DatePickerContent>
      </DatePicker>
    ))

    expect(screen.getByText("Publish date")).toBeInTheDocument()
    expect(screen.getByRole("textbox")).toHaveClass("border-border")
    expect(screen.getByRole("button")).toHaveClass("min-h-9")
    expect(screen.getByText("Calendar content")).toHaveClass("bg-popover")
  })

  it("renders default trigger icons and respects custom trigger children", () => {
    render(() => (
      <DatePicker open>
        <DatePickerControl>
          <DatePickerInput />
          <DatePickerTrigger />
        </DatePickerControl>
        <DatePickerContent>
          <DatePickerPrevTrigger />
          <DatePickerNextTrigger />
          <DatePickerTrigger>Custom trigger</DatePickerTrigger>
        </DatePickerContent>
      </DatePicker>
    ))

    expect(screen.getByTitle("Calendar")).toBeInTheDocument()
    expect(screen.getByTitle("Previous")).toBeInTheDocument()
    expect(screen.getByTitle("Next")).toBeInTheDocument()
    expect(screen.getByText("Custom trigger")).toBeInTheDocument()
    expect(screen.queryAllByText("Custom trigger")).toHaveLength(1)
  })
})
