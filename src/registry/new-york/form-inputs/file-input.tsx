import { Show, createMemo, splitProps } from "solid-js"

import type { JSX } from "solid-js"
import FormInputDescription from "./form-input-description"
import FormInputErrors from "./form-input-errors"

import { cn } from "@/lib/utils/tailwind"
import { Label } from "@/registry/new-york/ui/label"

type FileInputProps = {
  ref: (element: HTMLInputElement) => void
  name: string
  value?: Array<File> | File
  onInput: JSX.EventHandler<HTMLInputElement, InputEvent>
  onChange: JSX.EventHandler<HTMLInputElement, Event>
  onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>
  accept?: string
  required?: boolean
  disabled?: boolean
  multiple?: boolean
  class?: string
  label?: string
  description?: string
  error?: [string, ...Array<string>] | null
}

/**
 * File input field that users can click or drag files into. Various
 * decorations can be displayed in or around the field to communicate the entry
 * requirements.
 */
export default function FileInput(props: FileInputProps) {
  // Split input element props
  const [, inputProps] = splitProps(props, ["class", "value", "label", "error"])

  const multiple = () => props.multiple ?? false

  // Create file list
  const getFiles = createMemo(() =>
    props.value ? (Array.isArray(props.value) ? props.value : [props.value]) : []
  )

  return (
    <div class={cn("grid w-full items-center gap-1.5", props.class)}>
      <Label
        for={props.name}
        class={cn("w-full", props.error ? "text-destructive" : "")}
        aria-disabled={props.disabled}
      >
        {props.label} {props.required && <span class="text-destructive">*</span>}
      </Label>
      <FormInputDescription description={props.description} />
      <label
        aria-disabled={props.disabled}
        class={cn(
          "relative flex size-full min-h-20 p-6 items-center justify-center rounded-2xl border-[3px] border-dashed border-foreground/30 text-center focus-within:border-foreground/60 hover:border-foreground/40 md:text-lg lg:text-xl",
          props.error &&
            "border-destructive focus-within:border-destructive/60 hover:border-destructive/50",
          props.disabled && "opacity-60",
          !getFiles().length && "text-foreground/80"
        )}
      >
        <div class={cn(props.error && "text-destructive")}>
          <Show
            when={getFiles().length}
            fallback={`Click or drag and drop file${multiple() ? "s" : ""}.`}
          >
            Selected file{multiple() ? "s" : ""}:{" "}
            {getFiles()
              .map(({ name }) => name)
              .join(", ")}
          </Show>
        </div>
        <input
          {...inputProps}
          class={cn(
            "absolute size-full opacity-0",
            props.disabled ? "cursor-not-allowed" : "cursor-pointer"
          )}
          type="file"
          id={props.name}
          disabled={props.disabled}
          aria-invalid={!!props.error}
          aria-errormessage={`${props.name}-error`}
        />
      </label>
      <FormInputErrors error={props.error} />
    </div>
  )
}
