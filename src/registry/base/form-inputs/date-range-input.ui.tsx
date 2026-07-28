import { For, Show, createMemo } from "solid-js"
import { Portal } from "solid-js/web"

import type { DateValue } from "@ark-ui/solid"
import type { Setter } from "solid-js"

import { formatDateValueLong } from "@/lib/dates"
import { cn } from "@/lib/utils"
import CloseIcon from "@/registry/base/icons/svg/close"
import { Button, buttonVariants } from "@/registry/base/ui/button"
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
} from "@/registry/base/ui/date-picker"
import { labelVariants } from "@/registry/base/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/base/ui/tooltip"
import FormInputDescription from "./form-input-description.ui"
import FormInputErrors from "./form-input-errors.ui"

export type DateRangeInputProps = {
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
  closeOnSelect?: boolean
  timeZone?: string
  class?: string
  inputClass?: string
  format?: (e: DateValue) => string
  showTooltip?: boolean
}

function DateRangeInput(props: DateRangeInputProps) {
  // ClientOnly
  return (
    <DatePicker
      name={props.name}
      value={props.value}
      onValueChange={(value) => props.onChange(value.value)}
      defaultValue={props.defaultValue}
      placeholder={props.placeholder}
      disabled={props.disabled}
      readOnly={props.readOnly}
      defaultOpen={props.defaultOpen}
      closeOnSelect={props.closeOnSelect}
      timeZone={props.timeZone}
      numOfMonths={2}
      selectionMode="range"
      format={(e) => {
        if (props.format) {
          return props.format(e)
        }
        return formatDateValueLong(e)
      }}
      class={props.class}
    >
      <DatePickerControl class={"grid w-full items-center gap-1.5"}>
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
            index={0}
            class={cn(
              "h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-none transition-shadow focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              props.error &&
                "text-destructive placeholder:text-destructive border-destructive",
              props.inputClass
            )}
          />
          <DatePickerInput
            index={1}
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
              <TooltipContent>Clear Date Range</TooltipContent>
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
                {(api) => {
                  const offset = createMemo(() => api().getOffset({ months: 1 }))
                  return (
                    <>
                      <DatePickerViewControl>
                        <DatePickerPrevTrigger />
                        <DatePickerViewTrigger>
                          <DatePickerRangeText />
                        </DatePickerViewTrigger>
                        <DatePickerNextTrigger />
                      </DatePickerViewControl>
                      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                            <For each={offset().weeks}>
                              {(week) => (
                                <DatePickerTableRow>
                                  <For each={week}>
                                    {(day) => (
                                      <DatePickerTableCell
                                        value={day}
                                        visibleRange={offset().visibleRange}
                                      >
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
                      </div>
                    </>
                  )
                }}
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
                          each={api().getMonthsGrid({
                            columns: 4,
                            format: "short"
                          })}
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
                        <For
                          each={api().getYearsGrid({
                            columns: 4
                          })}
                        >
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

export default DateRangeInput
