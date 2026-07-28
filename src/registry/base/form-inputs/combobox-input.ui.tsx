import { Show, mergeProps } from "solid-js"

import type { orientationVariants } from "@/registry/base/ui/orientation"
import type { ComboboxTriggerMode } from "@kobalte/core/combobox"
import type { VariantProps } from "class-variance-authority"
import type { Setter } from "solid-js"

import { cn } from "@/lib/utils"
import {
  ComboboxContent,
  ComboboxControl,
  ComboboxInput as ComboboxInputUI,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemLabel,
  ComboboxSection,
  ComboboxTrigger,
  Combobox as ComboboxUI
} from "@/registry/base/ui/combobox"
import { Label } from "@/registry/base/ui/label"
import FormInputDescription from "./form-input-description.ui"
import FormInputErrors from "./form-input-errors.ui"

export type ComboboxInputProps<T> = {
  name: string
  value: T | undefined
  defaultValue?: T
  onChange: (value: T | null) => void | Setter<T | null>
  options: Array<T>
  optionValue: keyof T
  optionTextValue: keyof T
  optionLabel: keyof T
  optionDisabled: (option: T) => boolean
  optionDescriptionValue?: keyof T
  placeholder: string
  class?: string
  required?: boolean
  label?: string
  description?: string
  error?: [string, ...Array<string>] | null
  disabled?: boolean
  readOnly?: boolean
  autofocus?: boolean
  defaultFilter?: "startsWith" | "endsWith" | "contains"
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean, triggerMode?: ComboboxTriggerMode) => void
  onInputChange?: (value: string) => void
  removeOnBackspace?: boolean
  allowDuplicateSelectionEvents?: boolean
  disallowEmptySelection?: boolean
  closeOnSelection?: boolean
  selectionBehavior?: "toggle" | "replace"
  virtualized?: boolean
  modal?: boolean
  preventScroll?: boolean
} & VariantProps<typeof orientationVariants>

const ComboboxInput = <T,>(props: ComboboxInputProps<T>) => {
  const comboProps = mergeProps(
    {
      optionValue: "" as keyof T,
      optionLabel: "" as keyof T,
      optionTextValue: "" as keyof T,
      optionDescriptionValue: "" as keyof T
    },
    props
  )
  const orientation = () => props.orientation ?? "vertical"
  return (
    <ComboboxUI<T>
      class={cn(
        "grid w-full items-center",
        orientation() === "horizontal" ? "gap-2 grid-cols-2 items-start" : "gap-1.5",
        props.class
      )}
      name={props.name}
      defaultFilter={props.defaultFilter}
      value={props.value}
      defaultValue={props.defaultValue}
      validationState={props.error ? "invalid" : "valid"}
      required={props.required}
      disabled={props.disabled}
      readOnly={props.readOnly}
      onChange={props.onChange}
      options={props.options}
      optionValue={comboProps.optionValue}
      optionTextValue={comboProps.optionTextValue}
      optionLabel={comboProps.optionLabel}
      optionDisabled={props.optionDisabled}
      placeholder={props.placeholder}
      open={props.open}
      defaultOpen={props.defaultOpen}
      removeOnBackspace={props.removeOnBackspace}
      allowDuplicateSelectionEvents={props.allowDuplicateSelectionEvents}
      disallowEmptySelection={props.disallowEmptySelection}
      closeOnSelection={props.closeOnSelection}
      selectionBehavior={props.selectionBehavior}
      virtualized={props.virtualized}
      modal={props.modal}
      preventScroll={props.preventScroll}
      itemComponent={(itemProps) => {
        const itemLabel = () => {
          return itemProps.item.rawValue?.[comboProps.optionTextValue] as unknown as
            string | number
        }
        const itemDesc = () => {
          const desc = itemProps.item.rawValue?.[
            comboProps.optionDescriptionValue
          ] as unknown as Array<string> | string | number
          if (Array.isArray(desc)) {
            return desc.join(", ")
          }
          if (typeof desc === "string") {
            return desc
          }
          if (typeof desc === "number") {
            return desc.toString()
          }
        }
        return (
          <ComboboxItem
            item={itemProps.item}
            class="flex items-center justify-between gap-2 wrap-break-word"
          >
            <div class="flex flex-col items-stretch wrap-break-word text-left">
              <ComboboxItemLabel>{itemLabel()}</ComboboxItemLabel>
              <Show when={itemDesc()}>
                <div class="max-w-xl text-sm text-muted-foreground">{itemDesc()}</div>
              </Show>
            </div>
            <ComboboxItemIndicator />
          </ComboboxItem>
        )
      }}
      sectionComponent={(sectionProps) => {
        const itemLabel = () => {
          return sectionProps.section.rawValue[
            comboProps.optionTextValue
          ] as unknown as string | number
        }
        return <ComboboxSection>{itemLabel()}</ComboboxSection>
      }}
    >
      <div class={cn("inline-flex flex-col gap-1.5")}>
        <Show when={props.label}>
          <Label class={cn("w-full", props.error ? "text-destructive" : "")}>
            {props.label} {props.required && <span class="text-destructive">*</span>}
          </Label>
        </Show>
        <FormInputDescription description={props.description} />
      </div>
      <ComboboxControl
        aria-label={props.label}
        class={cn("w-full", props.error ? "border-destructive text-destructive" : "")}
      >
        <ComboboxInputUI
          id={props.name}
          class={cn("py-2 min-h-10", props.error && "placeholder:text-destructive")}
        />
        <ComboboxTrigger />
      </ComboboxControl>
      <ComboboxContent class="max-h-60 overflow-y-auto" />
      <FormInputErrors
        class={cn(orientation() === "horizontal" ? "col-span-2" : "")}
        error={props.error}
      />
    </ComboboxUI>
  )
}

export default ComboboxInput
