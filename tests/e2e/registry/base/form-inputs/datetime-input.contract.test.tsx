import { CalendarDate, CalendarDateTime } from "@internationalized/date"
import { fireEvent, render, screen } from "@solidjs/testing-library"
import { createSignal } from "solid-js"

vi.mock("@/registry/base/ui/date-picker", () => {
  type DatePickerApi = {
    getMonthsGrid: () => Array<Array<{ label: string; value: CalendarDate }>>
    getYearsGrid: () => Array<Array<{ label: string; value: CalendarDate }>>
    weekDays: Array<{ short: string }>
    weeks: Array<Array<CalendarDate>>
  }
  const Container = (props: { children?: JSX.Element }) => <div>{props.children}</div>
  const api: DatePickerApi = {
    getMonthsGrid: () => [[{ label: "Jan", value: new CalendarDate(2026, 1, 1) }]],
    getYearsGrid: () => [[{ label: "2026", value: new CalendarDate(2026, 1, 1) }]],
    weekDays: [{ short: "Mo" }],
    weeks: [[new CalendarDate(2026, 7, 27)]]
  }
  return {
    DatePicker: (props: Record<string, unknown>) => (
      <div data-value={JSON.stringify(props.value)}>
        {props.children as JSX.Element}
        <button
          type="button"
          onClick={() =>
            (props.onValueChange as (event: { value: Array<CalendarDate> }) => void)({
              value: []
            })
          }
        >
          empty date change
        </button>
        <button
          type="button"
          onClick={() =>
            (props.onValueChange as (event: { value: Array<CalendarDate> }) => void)({
              value: [new CalendarDate(2026, 7, 28)]
            })
          }
        >
          selected date change
        </button>
      </div>
    ),
    DatePickerContent: Container,
    DatePickerContext: (props: {
      children: (api: () => DatePickerApi) => JSX.Element
    }) => <>{props.children(() => api)}</>,
    DatePickerControl: Container,
    DatePickerInput: () => <input aria-label="date part" />,
    DatePickerLabel: (props: { children?: JSX.Element }) => (
      <label>{props.children}</label>
    ),
    DatePickerNextTrigger: Container,
    DatePickerPositioner: Container,
    DatePickerPrevTrigger: Container,
    DatePickerRangeText: Container,
    DatePickerTable: Container,
    DatePickerTableBody: Container,
    DatePickerTableCell: Container,
    DatePickerTableCellTrigger: Container,
    DatePickerTableHead: Container,
    DatePickerTableHeader: Container,
    DatePickerTableRow: Container,
    DatePickerTrigger: Container,
    DatePickerView: Container,
    DatePickerViewControl: Container,
    DatePickerViewTrigger: Container
  }
})

import DateTimeInput from "@/registry/base/form-inputs/datetime-input.ui"
import { JSX } from "solid-js"

describe("DateTimeInput date-picker composition contract", () => {
  it("reactively sets and unsets values from the date-picker boundary", () => {
    const [value, setValue] = createSignal<Array<CalendarDateTime>>([])
    render(() => (
      <DateTimeInput name="contract-datetime" value={value()} onChange={setValue} />
    ))

    fireEvent.click(screen.getByText("selected date change"))
    expect(screen.getByLabelText("contract-datetime time")).toHaveValue("00:00")
    expect(screen.getByLabelText("contract-datetime time")).toBeEnabled()

    fireEvent.click(screen.getByText("empty date change"))
    expect(screen.getByLabelText("contract-datetime time")).toBeDisabled()
  })
})
