import { render, screen } from "@solidjs/testing-library"

import {
  DatePicker,
  DatePickerContent,
  DatePickerContext,
  DatePickerControl,
  DatePickerInput,
  DatePickerLabel,
  DatePickerMonthSelect,
  DatePickerNextTrigger,
  DatePickerPositioner,
  DatePickerPrevTrigger,
  DatePickerRangeText,
  DatePickerTable,
  DatePickerTableBody,
  DatePickerTableCell,
  DatePickerTableCellTrigger,
  DatePickerTableHead,
  DatePickerTableHeader,
  DatePickerTableRow,
  DatePickerTrigger,
  DatePickerView,
  DatePickerViewControl,
  DatePickerViewTrigger,
  DatePickerYearSelect
} from "@/registry/kobalte/ui/date-picker"

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

  it("renders the complete calendar view composition", () => {
    render(() => (
      <DatePicker open>
        <DatePickerPositioner>
          <DatePickerContent>
            <DatePickerView view="day" class="custom-view">
              <DatePickerViewControl class="custom-view-control">
                <DatePickerPrevTrigger>Back</DatePickerPrevTrigger>
                <DatePickerViewTrigger class="custom-view-trigger">
                  Change view
                </DatePickerViewTrigger>
                <DatePickerNextTrigger>Forward</DatePickerNextTrigger>
              </DatePickerViewControl>
              <DatePickerRangeText class="custom-range" />
              <DatePickerMonthSelect aria-label="Month" />
              <DatePickerYearSelect aria-label="Year" />
              <DatePickerContext>
                {(context) => (
                  <DatePickerTable columns={7} class="custom-table">
                    <DatePickerTableHead>
                      <DatePickerTableRow class="custom-row">
                        <DatePickerTableHeader class="custom-header">
                          {context().weekDays[0]?.short}
                        </DatePickerTableHeader>
                      </DatePickerTableRow>
                    </DatePickerTableHead>
                    <DatePickerTableBody>
                      <DatePickerTableRow>
                        <DatePickerTableCell
                          class="custom-cell"
                          value={context().weeks[0]![0]!}
                          visibleRange={context().visibleRange}
                        >
                          <DatePickerTableCellTrigger class="custom-cell-trigger">
                            {context().weeks[0]![0]!.day}
                          </DatePickerTableCellTrigger>
                        </DatePickerTableCell>
                      </DatePickerTableRow>
                    </DatePickerTableBody>
                  </DatePickerTable>
                )}
              </DatePickerContext>
            </DatePickerView>
          </DatePickerContent>
        </DatePickerPositioner>
      </DatePicker>
    ))

    expect(screen.getByText("Back")).toBeInTheDocument()
    expect(screen.getByText("Forward")).toBeInTheDocument()
    expect(screen.getByText("Change view")).toHaveClass("custom-view-trigger")
    expect(document.querySelector(".custom-view")).toHaveClass("space-y-4")
    expect(document.querySelector(".custom-view-control")).toHaveClass(
      "justify-between"
    )
    expect(document.querySelector(".custom-range")).toHaveClass("font-medium")
    expect(document.querySelector(".custom-table")).toHaveClass("border-collapse")
    expect(document.querySelector(".custom-row")).toHaveClass("mt-2")
    expect(document.querySelector(".custom-header")).toHaveClass(
      "text-muted-foreground"
    )
    expect(document.querySelector(".custom-cell")).toHaveClass("text-center")
    expect(document.querySelector(".custom-cell-trigger")).toHaveClass("font-normal")
  })
})
