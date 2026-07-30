import { Show, mergeProps } from "solid-js"

import type { Setter } from "solid-js"

import { cn } from "@/lib/utils/tailwind"
import FormInputDescription from "@/registry/new-york/form-inputs/form-input-description"
import FormInputErrors from "@/registry/new-york/form-inputs/form-input-errors"
import {
  Select,
  SelectContent,
  SelectDescription,
  SelectHiddenSelect,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/registry/new-york/ui/select"

export type SelectInputProps<T> = {
  name: string
  value: T | null | undefined
  defaultValue?: T
  onChange: (value: T | null) => void | Setter<T | null>
  options: Array<T>
  optionValue: keyof T
  optionTextValue: keyof T
  optionDisabled?: (option: T) => boolean
  optionDescriptionValue?: keyof T
  placeholder?: string
  required?: boolean
  label?: string
  description?: string
  error?: [string, ...Array<string>] | null
  disabled?: boolean
  readOnly?: boolean
  autofocus?: boolean
  class?: string
  closeOnSelection?: boolean
}

const SelectInput = <T,>(props: SelectInputProps<T>) => {
  const selectProps = mergeProps(
    {
      optionTextValue: "" as keyof T,
      optionDescriptionValue: "" as keyof T
    },
    props
  )
  return (
    <Select<T>
      class={cn("grid w-full items-center gap-1.5", props.class)}
      name={props.name}
      value={props.value ?? undefined}
      defaultValue={props.defaultValue}
      options={props.options}
      validationState={props.error ? "invalid" : "valid"}
      required={props.required}
      disabled={props.disabled}
      readOnly={props.readOnly}
      onChange={props.onChange}
      optionValue={props.optionValue}
      optionTextValue={selectProps.optionTextValue}
      optionDisabled={props.optionDisabled}
      placeholder={props.placeholder}
      itemComponent={(itemProps) => {
        const itemLabel = () => {
          return itemProps.item.rawValue?.[selectProps.optionTextValue] as unknown as
            string | number
        }
        const itemDesc = () => {
          const desc = itemProps.item.rawValue?.[
            selectProps.optionDescriptionValue
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
          <SelectItem item={itemProps.item} class="wrap-break-word">
            {itemLabel()}
            <Show when={itemDesc()}>
              <SelectDescription class="max-w-xl">{itemDesc()}</SelectDescription>
            </Show>
          </SelectItem>
        )
      }}
      closeOnSelection={props.closeOnSelection}
    >
      <Show when={props.label}>
        <SelectLabel class={cn("w-full", props.error && "text-destructive")}>
          {props.label} {props.required && <span class="text-destructive">*</span>}
        </SelectLabel>
      </Show>
      <FormInputDescription description={props.description} />
      <SelectHiddenSelect />
      <SelectTrigger
        aria-label={props.placeholder}
        autofocus={props.autofocus}
        class={cn("w-full", props.error ? "border-destructive text-destructive" : "")}
      >
        <SelectValue<T>>
          {(state) => {
            const displayValue = state.selectedOption()
            const itemLabel = () => {
              return displayValue?.[selectProps.optionTextValue] as unknown as
                string | number
            }
            return itemLabel()
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent class="max-h-60 overflow-y-auto" />
      <Show when={props.error}>
        <FormInputErrors error={props.error} />
      </Show>
    </Select>
  )
}

export default SelectInput
