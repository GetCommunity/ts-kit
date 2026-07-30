import { Match, Show, Switch } from "solid-js"

import FormInputErrors from "@/registry/new-york/form-inputs/form-input-errors"
import type { Setter } from "solid-js"

import { cn } from "@/lib/utils/tailwind"
import {
  TextField,
  TextFieldDescription,
  TextFieldInput,
  TextFieldLabel,
  TextFieldTextArea
} from "@/registry/new-york/ui/text-field"

export type TextInputProps = {
  type:
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week"
  name: string
  value: string | null | undefined
  defaultValue?: string
  onChange: (value: string | null) => void | Setter<string | null>
  label?: string
  placeholder?: string
  description?: string
  error?: [string, ...Array<string>] | null
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  autoResize?: boolean
  autoComplete?: string
  autoFocus?: boolean
  multiline?: boolean
  rows?: number
  class?: string
  inputClass?: string
  tabIndex?: number
}

export default function TextInput(props: TextInputProps) {
  return (
    <TextField
      class={cn("grid w-full items-center gap-1.5", props.class)}
      name={props.name}
      value={props.value || ""}
      defaultValue={props.defaultValue}
      validationState={props.error ? "invalid" : "valid"}
      required={props.required}
      disabled={props.disabled}
      readOnly={props.readOnly}
      onChange={props.onChange}
    >
      <Show when={props.label}>
        <TextFieldLabel
          for={props.name}
          class={cn("w-full", props.error && "text-destructive")}
        >
          {props.label} {props.required && <span class="text-destructive">*</span>}
        </TextFieldLabel>
      </Show>
      <Show when={props.description}>
        <TextFieldDescription class={cn("w-full")}>
          {props.description}
        </TextFieldDescription>
      </Show>
      <Switch>
        <Match when={props.multiline}>
          <TextFieldTextArea
            class={cn("w-full", props.inputClass)}
            rows={props.rows}
            placeholder={props.placeholder}
            autoResize={props.autoResize}
            autofocus={props.autoFocus}
            autocomplete={props.autoComplete}
            aria-invalid={!!props.error}
            tabIndex={props.tabIndex}
          />
        </Match>
        <Match when={!props.multiline}>
          <TextFieldInput
            type={props.type}
            class={cn("w-full", props.inputClass)}
            placeholder={props.placeholder}
            autofocus={props.autoFocus}
            autocomplete={props.autoComplete}
            aria-invalid={!!props.error}
            tabIndex={props.tabIndex}
          />
        </Match>
      </Switch>
      <Show when={props.error}>
        <FormInputErrors class="w-full" error={props.error} />
      </Show>
    </TextField>
  )
}
