import { Show } from "solid-js"

import type { orientationVariants } from "@/registry/new-york/ui/orientation"
import type { VariantProps } from "class-variance-authority"
import type { Setter } from "solid-js"

import FormInputDescription from "./form-input-description"
import FormInputErrors from "./form-input-errors"

import { cn } from "@/lib/utils"
import { Checkbox as CheckboxUI } from "@/registry/new-york/ui/checkbox"
import { Label, labelVariants } from "@/registry/new-york/ui/label"

export type CheckboxInputProps = {
  name: string
  value: string
  checked: boolean | undefined
  defaultChecked?: boolean
  onChange: (checked: boolean) => void | Setter<boolean>
  class?: string
  label?: string
  description?: string
  itemLabel: string
  itemDescription?: string | undefined
  error?: [string, ...Array<string>] | null
  required?: boolean | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
  hidden?: boolean | undefined
} & VariantProps<typeof orientationVariants>

function CheckboxInput(props: CheckboxInputProps) {
  const orientation = () => props.orientation ?? "vertical"
  return (
    <div
      class={cn(
        "grid w-full items-center",
        orientation() === "horizontal" ? "gap-2 grid-cols-2 items-start" : "gap-1.5",
        props.class,
        props.hidden && "hidden",
        props.disabled ? "text-muted-foreground opacity-75 cursor-not-allowed" : ""
      )}
    >
      <div class={cn("inline-flex flex-col gap-1.5")}>
        <Show when={props.label}>
          <Label class={cn("w-full", props.error ? "text-destructive" : "")}>
            {props.label} {props.required && <span class="text-destructive">*</span>}
          </Label>
        </Show>
        <FormInputDescription description={props.description} />
      </div>
      <div
        class={cn(
          "w-full",
          "items-top flex space-x-2",
          props.error && "text-destructive"
        )}
        onClick={() => !props.disabled && props.onChange(!props.checked)}
      >
        <CheckboxUI
          id={props.name}
          checked={props.checked}
          defaultChecked={props.defaultChecked}
          name={props.name}
          value={props.value}
          required={props.required}
          disabled={props.disabled}
          readOnly={props.readOnly}
          validationState={props.error ? "invalid" : "valid"}
          class={cn(
            props.disabled ? "opactity-50" : "",
            props.error
              ? "[&>div]:border-destructive [&>div]:bg-destructive/20 [&>div]:ui-checked:bg-destructive"
              : ""
          )}
        />
        <div class="grid gap-1.5 leading-none">
          <Show when={props.itemLabel}>
            <div
              class={cn(
                labelVariants({ variant: "label" }),
                props.error ? "text-destructive" : ""
              )}
            >
              {props.itemLabel}
            </div>
          </Show>
          <Show when={props.itemDescription}>
            <div
              class={cn(
                "text-sm text-muted-foreground",
                props.error ? "text-destructive" : ""
              )}
            >
              {props.itemDescription}
            </div>
          </Show>
        </div>
      </div>
      <FormInputErrors
        class={cn(orientation() === "horizontal" ? "col-span-2" : "")}
        error={props.error}
      />
    </div>
  )
}

export default CheckboxInput
