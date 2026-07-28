import { For, Show, mergeProps } from "solid-js"

import type { Setter } from "solid-js"

import { cn } from "@/lib/utils/tailwind"
import CloseIcon from "@/registry/new-york/icons/svg/close"
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
import FormInputDescription from "./form-input-description"
import FormInputErrors from "./form-input-errors"

export type SelectMultipleInputProps<T> = {
  name: string
  value: Array<T> | null | undefined
  defaultValue?: Array<T>
  onChange: (value: Array<T> | null) => void | Setter<Array<T> | null>
  options: Array<T>
  optionValue: keyof T
  optionTextValue: keyof T
  optionDisabled?: (option: T) => boolean
  optionDescriptionValue?: keyof T
  placeholder: string
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

const SelectMultipleInput = <T,>(props: SelectMultipleInputProps<T>) => {
  const selectProps = mergeProps(
    { optionTextValue: "" as keyof T, optionDescriptionValue: "" as keyof T },
    props
  )
  return (
    <Select<T>
      class={cn("grid w-full items-center gap-1.5", props.class)}
      multiple={true}
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
    >
      <Show when={props.label}>
        <SelectLabel
          for={props.name}
          class={cn("w-full", props.error && "text-destructive")}
        >
          {props.label} {props.required && <span class="text-destructive">*</span>}
        </SelectLabel>
      </Show>
      <FormInputDescription description={props.description} />
      <SelectHiddenSelect name={props.name} />
      <SelectTrigger
        class={cn(
          "w-full h-auto min-h-10",
          props.error ? "border-destructive text-destructive" : ""
        )}
        aria-label={props.placeholder}
        autofocus={props.autofocus}
      >
        <SelectValue<T> class="flex grow items-center justify-between gap-2 truncate">
          {(state) => (
            <>
              <div class="flex flex-wrap items-center gap-2">
                <For each={state.selectedOptions()}>
                  {(option) => {
                    const itemValue = () => {
                      return option[selectProps.optionTextValue] as string | number
                    }
                    return (
                      <span
                        class="inline-flex items-center gap-x-2 rounded bg-zinc-100 px-2 py-0 text-sm text-primary"
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        {itemValue()}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            state.remove(option)
                          }}
                          class="rounded-full p-0.5 hover:bg-zinc-200"
                        >
                          <CloseIcon class="size-4" />
                        </button>
                      </span>
                    )
                  }}
                </For>
              </div>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation()
                  state.clear()
                }}
                class={cn("rounded-full p-0.5 hover:bg-gray-200")}
              >
                <CloseIcon class="size-4" />
              </button>
            </>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent class="max-h-60 overflow-y-auto" />
      <Show when={props.error}>
        <FormInputErrors error={props.error} />
      </Show>
    </Select>
  )
}

export default SelectMultipleInput
