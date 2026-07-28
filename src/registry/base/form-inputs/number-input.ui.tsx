import { Show, createSignal } from "solid-js"

import type { Setter } from "solid-js"
import FormInputErrors from "./form-input-errors.ui"

import { cn } from "@/lib/utils"
import {
  NumberFieldDecrementTrigger,
  NumberFieldDescription,
  NumberFieldIncrementTrigger,
  NumberFieldInput,
  NumberFieldLabel,
  NumberField as NumberFieldUI
} from "@/registry/base/ui/number-field"

export type NumberInputProps = {
  type?: "number"
  class?: string
  name: string
  value: number | null | undefined
  defaultValue?: number
  label?: string
  description?: string
  placeholder?: string
  step?: number
  error?: [string, ...Array<string>] | null
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  autoResize?: boolean
  onChange: (value: number | null) => void | Setter<number | null>
}

function NumberField(props: NumberInputProps) {
  const [rawValue, setRawValue] = createSignal<number>()
  const inputOnChange = (value: string | null) => {
    const check = value?.toString() ?? ""
    if (check.indexOf(",") !== -1) check.replace(",", "")
    const numberValue = parseFloat(value?.replace(",", "") ?? "")
    props.onChange(isNaN(numberValue) ? null : numberValue)
  }
  return (
    <>
      <NumberFieldUI
        class={cn("grid w-full max-w-md items-center gap-1.5", props.class)}
        name={props.name}
        value={props.value ?? undefined}
        defaultValue={props.defaultValue}
        validationState={props.error ? "invalid" : "valid"}
        required={props.required}
        disabled={props.disabled}
        readOnly={props.readonly}
        onChange={inputOnChange}
        rawValue={rawValue()}
        onRawValueChange={setRawValue}
        format={false}
      >
        <Show when={props.label}>
          <NumberFieldLabel
            for={props.name}
            class={cn("w-full", props.error && "text-destructive")}
          >
            {props.label} {props.required && <span class="text-destructive">*</span>}
          </NumberFieldLabel>
        </Show>
        <Show when={props.description}>
          <NumberFieldDescription class={cn("w-full my-0 leading-none")}>
            {props.description}
          </NumberFieldDescription>
        </Show>
        <div class="w-full relative">
          <NumberFieldInput id={props.name} placeholder={props.placeholder} />
          <NumberFieldIncrementTrigger />
          <NumberFieldDecrementTrigger />
        </div>
        <Show when={props.error}>
          <FormInputErrors error={props.error} />
          {/* <NumberFieldErrorMessage class={cn("w-full my-0 text-xs")}>
            <For each={props.error}>{(error) => <div>{error}</div>}</For>
          </NumberFieldErrorMessage> */}
        </Show>
      </NumberFieldUI>
    </>
  )
}

export default NumberField
