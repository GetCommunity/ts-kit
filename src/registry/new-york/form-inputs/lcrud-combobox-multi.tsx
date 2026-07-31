import type { StrapiListResponse } from "@getcommunity/gc-validators/base"
import type { infiniteQueryOptions } from "@tanstack/solid-query"
import type { VariantProps } from "class-variance-authority"
import type { JSX } from "solid-js"
import type { CollectionDocument } from "@/hooks/use-infinite-query"
import type { orientationVariants } from "@/registry/new-york/ui/orientation"
import * as ComboboxPrimitive from "@kobalte/core/combobox"
import { children, For, onMount, Show } from "solid-js"
import { useInfiniteCollection } from "@/hooks/use-infinite-query"
import { cn } from "@/lib/utils/tailwind"
import FormInputDescription from "@/registry/new-york/form-inputs/form-input-description"
import FormInputErrors from "@/registry/new-york/form-inputs/form-input-errors"
import CloseIcon from "@/registry/new-york/icons/svg/close"
import { Button } from "@/registry/new-york/ui/button"
import { Checkbox } from "@/registry/new-york/ui/checkbox"
import {
  ComboboxControl,
  ComboboxHiddenSelect,
  ComboboxInput as ComboboxInputUI,
  ComboboxItem,
  ComboboxItemLabel,
  ComboboxLabel,
  ComboboxTrigger,
  Combobox as ComboboxUI
} from "@/registry/new-york/ui/combobox"

export type LCRUDComboboxMultiProps<TData extends CollectionDocument> = {
  /** Solid form wiring */
  initialValue?: Array<TData>
  initialValuesKey?: keyof TData
  initialValuesKeyValues?: Array<TData[keyof TData]>
  value: Array<TData> | undefined
  onChange: (value: Array<TData> | null | undefined) => void

  /** Solid Query options */
  queryOptions: ReturnType<typeof infiniteQueryOptions<StrapiListResponse<TData>>>

  /** UI knobs */
  name?: string
  label?: string
  triggerLabel?: string
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

export default function LCRUDComboboxMulti<TData extends CollectionDocument>(
  props: LCRUDComboboxMultiProps<TData>
) {
  const orientation = () => props.orientation ?? "vertical"
  const name = () => props.name ?? "generic-combobox-multi"
  const optionLabel = (option: TData) => props.getOptionLabel(option)
  const createDialog = children(() => props.createDialog)

  const queryParams = () => props.queryOptions
  const { query, options, hasMore, isLoading, fetchNext, loadingMoreMessage } =
    useInfiniteCollection(queryParams())

  const selectAll = () => {
    const allOptions = options()
    props.onChange(allOptions)
  }

  onMount(() => {
    const initialValue = props.initialValue
    if (initialValue) {
      props.onChange(initialValue)
    }
  })

  onMount(() => {
    const opts = options()
    const valueKey = props.initialValuesKey
    const values = props.initialValuesKeyValues
    if (opts.length && valueKey && values?.length) {
      const initial = opts.filter((o) => values.includes(o[valueKey]))
      props.onChange(initial)
    }
  })

  return (
    <ComboboxUI<TData>
      multiple={true}
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
      optionLabel={optionLabel}
      optionDisabled={props.getOptionDisabled}
      placeholder={props.placeholder ?? "Select options"}
      closeOnSelection={props.closeOnSelection ?? false}
      itemComponent={(itemProps) => {
        const raw = itemProps.item.rawValue
        const itemLabel = () => optionLabel(raw)
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
            <Checkbox id={raw.documentId} checked={props.value?.includes(raw)} />
            <div class="w-full flex flex-col items-stretch wrap-break-word text-left">
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
      <ComboboxControl<TData>
        aria-label={props.label ?? "Select options"}
        class={cn(
          "w-full h-auto min-h-10",
          props.error ? "border-destructive text-destructive" : ""
        )}
      >
        {(state) => (
          <>
            <div class="flex w-full flex-col pr-2">
              <Show when={state.selectedOptions().length > 0}>
                <div class="flex shrink grow flex-wrap items-center gap-2 pt-1">
                  <For each={state.selectedOptions()}>
                    {(option) => {
                      const itemLabel = optionLabel(option)
                      return (
                        <span
                          class="inline-flex items-center gap-x-2 rounded bg-zinc-100 px-2 py-0.5 text-sm"
                          onPointerDown={(e) => e.stopPropagation()}
                        >
                          {itemLabel}
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
              </Show>
              <ComboboxInputUI
                id={name()}
                class={cn(props.error && "placeholder:text-destructive")}
              />
            </div>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation()
                state.clear()
              }}
              class={cn(
                "self-center rounded-full p-0.5 hover:bg-gray-200",
                props.error ? "text-destructive" : ""
              )}
            >
              <CloseIcon class="size-4" />
            </button>
            <ComboboxTrigger class={cn(props.error ? "text-destructive" : "")} />
          </>
        )}
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
              <Button
                class="w-full"
                variant={"link"}
                onClick={() => selectAll()}
                disabled={isLoading()}
              >
                Select All
              </Button>
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
