import { toCalendarDateTime } from "@internationalized/date"
import { For, Show } from "solid-js"
import { Portal } from "solid-js/web"

import type { DateValue } from "@ark-ui/solid"
import type { Setter } from "solid-js"

import {
  formatDateTimeValue,
  formatTimeInputValue,
  getTimeValue,
  parseTimeInputValue
} from "@/lib/utils/date"
import { cn } from "@/lib/utils/tailwind"
import FormInputDescription from "@/registry/new-york/form-inputs/form-input-description"
import FormInputErrors from "@/registry/new-york/form-inputs/form-input-errors"
import CloseIcon from "@/registry/new-york/icons/svg/close"
import { Button, buttonVariants } from "@/registry/new-york/ui/button"
import {
  DatePicker,
  DatePickerContent,
  DatePickerContext,
  DatePickerControl,
  DatePickerInput,
  DatePickerLabel,
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
  DatePickerViewTrigger
} from "@/registry/new-york/ui/date-picker"
import { labelVariants } from "@/registry/new-york/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/new-york/ui/tooltip"

export type DateTimeInputProps = {
  name: string
  value: Array<DateValue>
  onChange: (value: Array<DateValue>) => void | Setter<Array<DateValue>>
  defaultValue?: Array<DateValue>
  placeholder?: string
  label?: string
  description?: string
  error?: [string, ...Array<string>] | null
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  defaultOpen?: boolean
  open?: () => boolean
  closeOnSelect?: boolean
  timeZone?: string
  class?: string
  inputClass?: string
  timeInputClass?: string
  inline?: boolean
  format?: (e: DateValue) => string
  showTooltip?: boolean
  timeStep?: number
}

function DateTimeInput(props: DateTimeInputProps) {
  const selectedValue = () => props.value.at(0)
  const isTimeDisabled = () =>
    props.disabled || props.readOnly || props.value.length === 0

  const handleDateChange = (value: Array<DateValue>) => {
    if (value.length === 0) {
      props.onChange([])
      return
    }

    const existingTime = selectedValue()
      ? getTimeValue(selectedValue())
      : getTimeValue(value.at(0))

    props.onChange(value.map((date) => toCalendarDateTime(date, existingTime)))
  }

  const handleTimeChange = (value: string) => {
    const date = selectedValue()
    const time = parseTimeInputValue(value)

    if (!date || !time) {
      return
    }

    props.onChange([toCalendarDateTime(date, time)])
  }

  const formatDateTime = (value: DateValue) => {
    if (props.format) {
      return props.format(value)
    }

    return formatDateTimeValue(value, props.timeZone)
  }

  return (
    <DatePicker
      name={props.name}
      value={props.value}
      onValueChange={(e) => handleDateChange(e.value)}
      defaultValue={props.defaultValue}
      placeholder={props.placeholder}
      disabled={props.disabled}
      readOnly={props.readOnly}
      required={props.required}
      defaultOpen={props.defaultOpen}
      open={props.open?.()}
      closeOnSelect={props.closeOnSelect}
      timeZone={props.timeZone}
      startOfWeek={1}
      format={formatDateTime}
      class={props.class}
    >
      <DatePickerControl class={cn("grid w-full items-center gap-1.5", props.class)}>
        <Show when={props.label}>
          <DatePickerLabel
            class={cn(labelVariants(), "w-full", props.error ? "text-destructive" : "")}
            for={props.name}
          >
            {props.label} {props.required && <span class="text-destructive">*</span>}
          </DatePickerLabel>
        </Show>
        <FormInputDescription description={props.description} />
        <div class="w-full flex flex-row gap-1">
          <DatePickerInput
            placeholder={props.placeholder ?? "Pick a date and time"}
            class={cn(
              "h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-none transition-shadow focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              props.error &&
                "text-destructive placeholder:text-destructive border-destructive",
              props.inputClass
            )}
          />
          <DatePickerTrigger
            class={cn(
              props.error &&
                "[&_svg]:border-destructive [&_svg]:text-destructive border-destructive"
            )}
          />
          <input
            id={`${props.name}-time`}
            type="time"
            value={formatTimeInputValue(selectedValue())}
            step={props.timeStep ?? 60}
            disabled={isTimeDisabled()}
            readOnly={props.readOnly}
            aria-label={`${props.label ?? props.name} time`}
            aria-invalid={props.error ? "true" : undefined}
            class={cn(
              "h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-none transition-shadow focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              props.error &&
                "text-destructive placeholder:text-destructive border-destructive",
              props.timeInputClass
            )}
            onInput={(event) => handleTimeChange(event.currentTarget.value)}
          />
          <Show
            when={props.showTooltip}
            fallback={
              <>
                <Button
                  variant="outline"
                  class={cn(
                    "p-2",
                    props.error &&
                      "text-destructive hover:text-destructive border-destructive hover:bg-destructive/10"
                  )}
                  onClick={() => props.onChange([])}
                  disabled={props.disabled || props.value.length === 0}
                >
                  <CloseIcon class={"size-3"} />
                </Button>
              </>
            }
          >
            <Tooltip openDelay={200}>
              <TooltipTrigger
                class={cn(
                  buttonVariants({ variant: "outline" }),
                  "p-2",
                  props.error &&
                    "text-destructive hover:text-destructive border-destructive hover:bg-destructive/10"
                )}
                onClick={() => props.onChange([])}
                disabled={props.disabled || props.value.length === 0}
              >
                <CloseIcon class={"size-3"} />
              </TooltipTrigger>
              <TooltipContent>Clear Date and Time</TooltipContent>
            </Tooltip>
          </Show>
        </div>
        <FormInputErrors error={props.error} />
      </DatePickerControl>
      <Portal>
        <DatePickerPositioner>
          <DatePickerContent>
            <DatePickerView view="day">
              <DatePickerContext>
                {(api) => (
                  <>
                    <DatePickerViewControl>
                      <DatePickerPrevTrigger />
                      <DatePickerViewTrigger>
                        <DatePickerRangeText />
                      </DatePickerViewTrigger>
                      <DatePickerNextTrigger />
                    </DatePickerViewControl>
                    <DatePickerTable>
                      <DatePickerTableHead>
                        <DatePickerTableRow>
                          <For each={api().weekDays}>
                            {(weekDay) => (
                              <DatePickerTableHeader>
                                {weekDay.short}
                              </DatePickerTableHeader>
                            )}
                          </For>
                        </DatePickerTableRow>
                      </DatePickerTableHead>
                      <DatePickerTableBody>
                        <For each={api().weeks}>
                          {(week) => (
                            <DatePickerTableRow>
                              <For each={week}>
                                {(day) => (
                                  <DatePickerTableCell value={day}>
                                    <DatePickerTableCellTrigger>
                                      {day.day}
                                    </DatePickerTableCellTrigger>
                                  </DatePickerTableCell>
                                )}
                              </For>
                            </DatePickerTableRow>
                          )}
                        </For>
                      </DatePickerTableBody>
                    </DatePickerTable>
                  </>
                )}
              </DatePickerContext>
            </DatePickerView>
            <DatePickerView view="month">
              <DatePickerContext>
                {(api) => (
                  <>
                    <DatePickerViewControl>
                      <DatePickerPrevTrigger />
                      <DatePickerViewTrigger>
                        <DatePickerRangeText />
                      </DatePickerViewTrigger>
                      <DatePickerNextTrigger />
                    </DatePickerViewControl>
                    <DatePickerTable>
                      <DatePickerTableBody>
                        <For
                          each={api().getMonthsGrid({ columns: 4, format: "short" })}
                        >
                          {(months) => (
                            <DatePickerTableRow>
                              <For each={months}>
                                {(month) => (
                                  <DatePickerTableCell value={month.value}>
                                    <DatePickerTableCellTrigger>
                                      {month.label}
                                    </DatePickerTableCellTrigger>
                                  </DatePickerTableCell>
                                )}
                              </For>
                            </DatePickerTableRow>
                          )}
                        </For>
                      </DatePickerTableBody>
                    </DatePickerTable>
                  </>
                )}
              </DatePickerContext>
            </DatePickerView>
            <DatePickerView view="year">
              <DatePickerContext>
                {(api) => (
                  <>
                    <DatePickerViewControl>
                      <DatePickerPrevTrigger />
                      <DatePickerViewTrigger>
                        <DatePickerRangeText />
                      </DatePickerViewTrigger>
                      <DatePickerNextTrigger />
                    </DatePickerViewControl>
                    <DatePickerTable>
                      <DatePickerTableBody>
                        <For each={api().getYearsGrid({ columns: 4 })}>
                          {(years) => (
                            <DatePickerTableRow>
                              <For each={years}>
                                {(year) => (
                                  <DatePickerTableCell value={year.value}>
                                    <DatePickerTableCellTrigger>
                                      {year.label}
                                    </DatePickerTableCellTrigger>
                                  </DatePickerTableCell>
                                )}
                              </For>
                            </DatePickerTableRow>
                          )}
                        </For>
                      </DatePickerTableBody>
                    </DatePickerTable>
                  </>
                )}
              </DatePickerContext>
            </DatePickerView>
          </DatePickerContent>
        </DatePickerPositioner>
      </Portal>
    </DatePicker>
  )
}

export default DateTimeInput
