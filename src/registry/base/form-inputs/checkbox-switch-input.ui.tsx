import { Show } from "solid-js"

import type { orientationVariants } from "@/registry/base/ui/orientation"
import type { VariantProps } from "class-variance-authority"
import type { Setter } from "solid-js"

import { cn } from "@/lib/utils"
import { Label } from "@/registry/base/ui/label"
import {
  SwitchControl,
  SwitchLabel,
  SwitchThumb,
  Switch as SwitchUI
} from "@/registry/base/ui/switch"
import FormInputDescription from "./form-input-description.ui"
import FormInputErrors from "./form-input-errors.ui"

export type CheckboxSwitchInputProps<T> = {
  name: string
  value: T
  checked: boolean | undefined
  defaultChecked?: boolean
  onChange: (checked: boolean) => void | Setter<boolean>
  onKeyPress?: (e: KeyboardEvent) => void | undefined
  class?: string
  switchClass?: string
  label?: string
  description?: string
  itemLabel?: string
  itemDescription?: string | undefined
  error?: [string, ...Array<string>] | null
  required?: boolean | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
} & VariantProps<typeof orientationVariants>

function CheckboxSwitchInput<T>(props: CheckboxSwitchInputProps<T>) {
  const orientation = () => props.orientation ?? "vertical"
  return (
    <div
      class={cn(
        "grid w-full items-center",
        orientation() === "horizontal" ? "gap-2 grid-cols-2 items-start" : "gap-1.5",
        props.class
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
          "items-top relative flex space-x-2",
          props.switchClass,
          props.error && "text-destructive",
          props.disabled && "cursor-not-allowed"
        )}
        onClick={() => (!props.disabled ? props.onChange(!props.checked) : undefined)}
        onKeyPress={(e) =>
          !props.disabled && props.onKeyPress ? props.onKeyPress(e) : undefined
        }
      >
        <SwitchUI
          id={props.name}
          class={"flex items-center space-x-2"}
          checked={props.checked}
          defaultChecked={props.defaultChecked}
          name={props.name}
          value={String(props.value)}
          required={props.required}
          disabled={props.disabled}
          readOnly={props.readOnly}
          validationState={props.error ? "invalid" : "valid"}
        >
          <SwitchControl
            class={cn(
              props.error
                ? "border-destructive bg-destructive/20 ui-checked:bg-destructive/90"
                : ""
            )}
          >
            <SwitchThumb />
          </SwitchControl>
          <Show when={props.itemLabel || props.itemDescription}>
            <div class="grid gap-1.5 leading-none">
              <Show when={props.itemLabel}>
                <SwitchLabel
                  class={cn(props.error ? "text-destructive" : "")}
                  onClick={() => props.onChange(!props.checked)}
                >
                  {props.itemLabel}
                </SwitchLabel>
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
          </Show>
        </SwitchUI>
      </div>
      <FormInputErrors
        class={cn(orientation() === "horizontal" ? "col-span-2" : "")}
        error={props.error}
      />
    </div>
  )
}

export default CheckboxSwitchInput
