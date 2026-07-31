import * as ComboboxPrimitive from "@kobalte/core/combobox"
import { Show, children, onMount } from "solid-js"

import type { CollectionDocument } from "@/hooks/use-infinite-query"
import type { orientationVariants } from "@/registry/kobalte/ui/orientation"
import type { StrapiListResponse } from "@getcommunity/gc-validators/base"
import type { infiniteQueryOptions } from "@tanstack/solid-query"
import type { VariantProps } from "class-variance-authority"
import type { JSX } from "solid-js"

import { useInfiniteCollection } from "@/hooks/use-infinite-query"
import { cn } from "@/lib/utils/tailwind"
import FormInputDescription from "@/registry/kobalte/form-inputs/form-input-description"
import FormInputErrors from "@/registry/kobalte/form-inputs/form-input-errors"
import { Button } from "@/registry/kobalte/ui/button"
import { Checkbox } from "@/registry/kobalte/ui/checkbox"
import {
  ComboboxControl,
  ComboboxHiddenSelect,
  ComboboxInput as ComboboxInputUI,
  ComboboxItem,
  ComboboxItemLabel,
  ComboboxLabel,
  ComboboxTrigger,
  Combobox as ComboboxUI
} from "@/registry/kobalte/ui/combobox"

export type LCRUDComboboxProps<TData extends CollectionDocument> = {
  /** Solid form wiring */
  initialValue?: TData | undefined
  initialValueKey?: keyof TData
  initialValueKeyValue?: TData[keyof TData]
  value: TData | undefined
  onChange: (value: TData | null | undefined) => void

  /** Solid Query options */
  queryOptions: ReturnType<typeof infiniteQueryOptions<StrapiListResponse<TData>>>

  /** UI knobs */
  name?: string
  label?: string
  placeholder?: string
  class?: string
  disabled?: boolean
  error?: [string, ...Array<string>] | null
  description?: string
  closeOnSelection?: boolean
  orientation?: "horizontal" | "vertical"

  /* Value Mappers */
  optionValue: keyof TData
  optionTextValue: keyof TData
  getOptionLabel: (o: TData) => string
  getOptionDesc: (o: TData) => string | null | undefined
  getOptionDisabled: (o: TData) => boolean

  /** UI CRUD */
  createDialog?: JSX.Element
  getUpdateDialog?: (entity: TData) => JSX.Element | null
  getDeleteDialog?: (entity: TData) => JSX.Element | null
} & VariantProps<typeof orientationVariants>

export default function LCRUDCombobox<TData extends CollectionDocument>(
  props: LCRUDComboboxProps<TData>
) {
  const orientation = () => props.orientation ?? "vertical"
  const name = () => props.name ?? "generic-combobox"
  const createDialog = children(() => props.createDialog)

  const queryParams = () => props.queryOptions
  const { query, options, hasMore, isLoading, fetchNext, loadingMoreMessage } =
    useInfiniteCollection(queryParams())

  onMount(() => {
    const initialValue = props.initialValue
    if (initialValue) {
      props.onChange(initialValue)
    }
  })

  onMount(() => {
    const opts = options()
    const valueKey = props.initialValueKey
    const value = props.initialValueKeyValue
    if (opts.length && valueKey && value) {
      const initial = opts.find((option) => option[valueKey] === value)
      props.onChange(initial)
    }
  })

  return (
    <ComboboxUI<TData>
      class={cn(
        "grid w-full items-center",
        orientation() === "horizontal" ? "gap-2 grid-cols-2 items-start" : "gap-1.5",
        props.class
      )}
      value={props.value}
      options={options()}
      validationState={props.error ? "invalid" : "valid"}
      disabled={props.disabled}
      onChange={props.onChange}
      optionValue={props.optionValue}
      optionTextValue={props.optionTextValue}
      optionLabel={props.getOptionLabel}
      optionDisabled={props.getOptionDisabled}
      placeholder={props.placeholder ?? "Select option"}
      closeOnSelection={props.closeOnSelection ?? false}
      itemComponent={(itemProps) => {
        const raw = itemProps.item.rawValue
        const itemLabel = () => props.getOptionLabel(raw)
        const itemDesc = () => props.getOptionDesc(raw)
        const updateDialog = children(() =>
          props.getUpdateDialog?.(itemProps.item.rawValue)
        )
        const deleteDialog = children(() =>
          props.getDeleteDialog?.(itemProps.item.rawValue)
        )
        return (
          <ComboboxItem
            item={itemProps.item}
            class="flex items-center justify-between gap-2 wrap-break-word"
          >
            <Checkbox id={raw.documentId} checked={props.value === raw} />
            <div class="flex flex-col items-stretch wrap-break-word text-left w-full">
              <ComboboxItemLabel>{itemLabel()}</ComboboxItemLabel>
              <Show when={itemDesc()}>
                <div class="max-w-xl text-sm text-muted-foreground">{itemDesc()}</div>
              </Show>
            </div>
            <Show when={updateDialog}>{updateDialog()}</Show>
            <Show when={deleteDialog}>{deleteDialog()}</Show>
          </ComboboxItem>
        )
      }}
    >
      <div class={cn("inline-flex flex-col gap-1.5")}>
        <Show when={props.label}>
          <ComboboxLabel
            for={name()}
            class={cn("w-full", props.error ? "text-destructive" : "")}
          >
            {props.label}
          </ComboboxLabel>
        </Show>
        <FormInputDescription description={props.description} />
      </div>
      <ComboboxControl
        aria-label={props.label ?? "Select"}
        class={cn(
          "w-full h-auto min-h-10",
          props.error ? "border-destructive text-destructive" : ""
        )}
      >
        <ComboboxInputUI
          id={name()}
          class={cn(props.error && "placeholder:text-destructive")}
        />
        <ComboboxTrigger />
      </ComboboxControl>
      <ComboboxHiddenSelect name={name()} />
      <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Content
          class={cn(
            "relative z-50 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80"
          )}
        >
          <div>
            <ComboboxPrimitive.Listbox class="max-h-60 overflow-y-auto m-0 p-1" />
            <div class="w-full relative bottom-0 left-0 flex flex-row gap-2">
              <Show when={createDialog}>{createDialog()}</Show>
              <Show when={hasMore()}>
                <Button
                  class="w-full"
                  variant={"link"}
                  onClick={fetchNext}
                  disabled={isLoading()}
                >
                  {loadingMoreMessage()}
                </Button>
              </Show>
              <Button
                class="w-full"
                variant={"link"}
                onClick={() => query.refetch()}
                disabled={isLoading()}
              >
                {isLoading() ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>
        </ComboboxPrimitive.Content>
      </ComboboxPrimitive.Portal>
      <FormInputErrors
        class={cn(orientation() === "horizontal" ? "col-span-2" : "")}
        error={props.error}
      />
    </ComboboxUI>
  )
}
