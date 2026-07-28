import { Show } from "solid-js"

import type { SliderGetValueLabelParams } from "@kobalte/core/slider"
import type { Setter } from "solid-js"

import { cn } from "@/lib/utils"
import {
  Slider,
  SliderFill,
  SliderLabel,
  SliderThumb,
  SliderTrack,
  SliderValueLabel
} from "@/registry/base/ui/slider"
import FormInputDescription from "./form-input-description.ui"
import FormInputErrors from "./form-input-errors.ui"

export type NumberRangeInputProps = {
  class?: string
  name: string
  value: Array<number> | null | undefined
  defaultValue?: Array<number>
  onChange: (value: Array<number>) => void | Setter<Array<number>>
  onChangeEnd?: (value: Array<number>) => void | Setter<Array<number>>
  label?: string
  multiple?: boolean
  inverted?: boolean
  minValue?: number
  maxValue?: number
  step?: number
  minStepsBetweenThumbs?: number
  getValueLabel?: (params: SliderGetValueLabelParams) => string
  orientation?: "horizontal" | "vertical"
  required?: boolean
  description?: string
  error?: [string, ...Array<string>] | null
  disabled?: boolean
  readOnly?: boolean
}

function NumberRangeInput(props: NumberRangeInputProps) {
  return (
    <>
      <Slider
        class={cn("flex flex-col items-start gap-1.5", props.class)}
        name={props.name}
        value={props.value ?? undefined}
        defaultValue={props.defaultValue}
        inverted={props.inverted}
        minValue={props.minValue}
        maxValue={props.maxValue}
        step={props.step}
        minStepsBetweenThumbs={props.minStepsBetweenThumbs}
        getValueLabel={props.getValueLabel}
        orientation={props.orientation}
        validationState={props.error ? "invalid" : "valid"}
        required={props.required}
        disabled={props.disabled}
        readOnly={props.readOnly}
        onChange={props.onChange}
        onChangeEnd={props.onChangeEnd}
      >
        <div
          class={cn(
            "flex w-full items-center justify-between",
            props.error && "text-destructive"
          )}
        >
          <Show when={props.label}>
            <SliderLabel class={cn(props.error && "text-destructive")}>
              {props.label} {props.required && <span class="text-destructive">*</span>}
            </SliderLabel>
          </Show>
          <Show when={props.getValueLabel}>
            <SliderValueLabel />
          </Show>
        </div>
        <FormInputDescription class="w-full" description={props.description} />
        <div
          class={cn(
            "h-10 w-full flex justify-center items-center",
            props.disabled && "cursor-not-allowed"
          )}
        >
          <SliderTrack>
            <SliderFill class={cn(props.error && "bg-destructive")} />
            <SliderThumb class={cn(props.error && "border-destructive")} />
            <Show when={props.multiple || (props.value?.length ?? 0) > 1}>
              <SliderThumb class={cn(props.error && "border-destructive")} />
            </Show>
          </SliderTrack>
        </div>
        <FormInputErrors class="w-full" error={props.error} />
      </Slider>
    </>
  )
}

export default NumberRangeInput
