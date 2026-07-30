import { Show } from "solid-js"

import type { Time } from "@internationalized/date"
import type { Setter } from "solid-js"

import { formatTimeInputValue, parseTimeInputValue } from "@/lib/utils/date"
import { cn } from "@/lib/utils/tailwind"
import FormInputDescription from "@/registry/new-york/form-inputs/form-input-description"
import FormInputErrors from "@/registry/new-york/form-inputs/form-input-errors"
import CloseIcon from "@/registry/new-york/icons/svg/close"
import { Button, buttonVariants } from "@/registry/new-york/ui/button"
import { labelVariants } from "@/registry/new-york/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/new-york/ui/tooltip"

export type TimeInputProps = {
  name: string
  value: Time | null | undefined
  onChange: (value: Time | null) => void | Setter<Time | null>
  defaultValue?: Time
  placeholder?: string
  label?: string
  description?: string
  error?: [string, ...Array<string>] | null
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  class?: string
  inputClass?: string
  showTooltip?: boolean
  timeStep?: number
}

function TimeInput(props: TimeInputProps) {
  const inputValue = () =>
    props.value === undefined ? props.defaultValue : props.value

  const handleTimeChange = (nextValue: string) => {
    if (!nextValue) {
      props.onChange(null)
      return
    }

    const time = parseTimeInputValue(nextValue)

    if (!time) {
      return
    }

    props.onChange(time)
  }

  return (
    <div class={cn("grid w-full items-center gap-1.5", props.class)}>
      <Show when={props.label}>
        <label
          class={cn(labelVariants(), "w-full", props.error ? "text-destructive" : "")}
          for={props.name}
        >
          {props.label} {props.required && <span class="text-destructive">*</span>}
        </label>
      </Show>
      <FormInputDescription description={props.description} />
      <div class="flex w-full flex-row gap-1">
        <input
          id={props.name}
          name={props.name}
          type="time"
          value={formatTimeInputValue(inputValue())}
          placeholder={props.placeholder}
          step={props.timeStep ?? 60}
          required={props.required}
          disabled={props.disabled}
          readOnly={props.readOnly}
          aria-invalid={props.error ? "true" : undefined}
          class={cn(
            "h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-none transition-shadow focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            props.error &&
              "text-destructive placeholder:text-destructive border-destructive",
            props.inputClass
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
                onClick={() => props.onChange(null)}
                disabled={props.disabled || !props.value}
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
              onClick={() => props.onChange(null)}
              disabled={props.disabled || !props.value}
            >
              <CloseIcon class={"size-3"} />
            </TooltipTrigger>
            <TooltipContent>Clear Time</TooltipContent>
          </Tooltip>
        </Show>
      </div>
      <FormInputErrors error={props.error} />
    </div>
  )
}

export default TimeInput
