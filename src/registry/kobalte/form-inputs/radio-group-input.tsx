import FormInputDescription from "@/registry/kobalte/form-inputs/form-input-description"
import FormInputErrors from "@/registry/kobalte/form-inputs/form-input-errors"
import { cn } from "@/registry/kobalte/lib/utils/tailwind"
import { Label } from "@/registry/kobalte/ui/label"
import {
  RadioGroupItem,
  RadioGroupItemLabel,
  RadioGroup as RadioGroupUI
} from "@/registry/kobalte/ui/radio-group"
import { For, Show, mergeProps } from "solid-js"

export type RadioGroupInputProps<T> = {
  name: string
  value: string | null | undefined
  defaultValue?: string
  options: Array<T>
  optionValue?: keyof T | undefined
  optionTextValue?: keyof T | undefined
  optionDisabled?: (option: T) => boolean | undefined
  optionDescriptionValue?: keyof T | undefined
  required?: boolean
  label?: string
  description?: string
  orientation?: "horizontal" | "vertical"
  error?: [string, ...Array<string>] | null
  disabled?: boolean
  readOnly?: boolean
  onChange: (value: string | null) => void
}

const RadioGroupInput = <T,>(props: RadioGroupInputProps<T>) => {
  const radioProps = mergeProps(
    {
      optionTextValue: "" as keyof T,
      optionDescriptionValue: "" as keyof T,
      optionValue: "" as keyof T
    },
    props
  )
  return (
    <>
      <RadioGroupUI
        class={cn("w-full")}
        name={props.name}
        value={props.value ?? ""}
        defaultValue={props.defaultValue}
        orientation={props.orientation}
        validationState={props.error ? "invalid" : "valid"}
        required={props.required}
        disabled={props.disabled}
        readOnly={props.readOnly}
        onChange={props.onChange}
      >
        <Show when={props.label}>
          <Label
            for={props.name}
            class={cn("w-full", props.error && "text-destructive")}
          >
            {props.label} {props.required && <span class="text-destructive">*</span>}
          </Label>
        </Show>
        <FormInputDescription description={props.description} />
        <div
          class={cn(
            "w-full gap-1.5",
            // 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
            props.orientation === "horizontal"
              ? "flex flex-row flex-wrap"
              : "flex flex-col"
          )}
        >
          <For each={props.options}>
            {(option) => {
              const itemLabel = () => {
                if (radioProps.optionTextValue === "") {
                  return option as unknown as string
                }
                return option?.[radioProps.optionTextValue] as unknown as string
              }
              const itemValue = () => {
                if (radioProps.optionValue === "") {
                  return option as unknown as string
                }
                return option?.[radioProps.optionValue] as unknown as string
              }
              const itemDesc = () => {
                return option?.[radioProps.optionDescriptionValue] as unknown as string
              }
              return (
                <RadioGroupItem
                  value={itemValue()}
                  class={cn(
                    "h-auto",
                    props.orientation === "horizontal" ? "col-span-1" : "w-full",
                    props.error &&
                      "text-destructive [&>div]:border-destructive [&_svg]:text-destructive [&_svg]:fill-destructive",
                    props.disabled && "cursor-not-allowed"
                  )}
                >
                  <RadioGroupItemLabel
                    class={cn(
                      "flex cursor-pointer flex-col",
                      props.disabled && "cursor-not-allowed"
                    )}
                  >
                    {itemLabel()}
                    <Show when={itemDesc()}>
                      <div
                        class={cn(
                          "text-sm mt-1 max-w-lg text-muted-foreground font-normal",
                          props.error && "text-destructive",
                          props.disabled && "cursor-not-allowed"
                        )}
                      >
                        {itemDesc()}
                      </div>
                    </Show>
                  </RadioGroupItemLabel>
                </RadioGroupItem>
              )
            }}
          </For>
        </div>
        <FormInputErrors error={props.error} />
      </RadioGroupUI>
    </>
  )
}

export default RadioGroupInput
