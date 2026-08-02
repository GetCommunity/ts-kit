import * as SelectPrimitive from "@kobalte/core/select"
import { For, Show, children, onMount } from "solid-js"

import type { CollectionDocument } from "@/registry/kobalte/hooks/use-infinite-query"
import type { orientationVariants } from "@/registry/kobalte/ui/orientation"
import type { StrapiListResponse } from "@getcommunity/gc-validators/base"
import type { infiniteQueryOptions } from "@tanstack/solid-query"
import type { VariantProps } from "class-variance-authority"
import type { JSX } from "solid-js"

import FormInputDescription from "@/registry/kobalte/form-inputs/form-input-description"
import FormInputErrors from "@/registry/kobalte/form-inputs/form-input-errors"
import { useInfiniteCollection } from "@/registry/kobalte/hooks/use-infinite-query"
import CloseIcon from "@/registry/kobalte/icons/svg/close"
import { cn } from "@/registry/kobalte/lib/utils/tailwind"
import { Button } from "@/registry/kobalte/ui/button"
import { Checkbox } from "@/registry/kobalte/ui/checkbox"
import {
  Select,
  SelectDescription,
  SelectHiddenSelect,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/registry/kobalte/ui/select"

export type LCRUDSelectProps<TData extends CollectionDocument> = {
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
  description?: string
  placeholder?: string
  class?: string
  disabled?: boolean
  error?: [string, ...Array<string>] | null
  closeOnSelection?: boolean

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

export default function LCRUDSelect<TData extends CollectionDocument>(
  props: LCRUDSelectProps<TData>
) {
  const orientation = () => props.orientation ?? "vertical"
  const name = () => props.name ?? "generic-select"
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
    <Select<TData>
      class={cn(
        "grid w-full items-center",
        orientation() === "horizontal" ? "gap-2 grid-cols-2 items-start" : "gap-1.5",
        props.class
      )}
      name={name()}
      value={props.value}
      options={options()}
      validationState={props.error ? "invalid" : "valid"}
      disabled={props.disabled}
      onChange={props.onChange}
      optionValue={props.optionValue}
      optionTextValue={props.optionTextValue}
      optionDisabled={props.getOptionDisabled}
      placeholder={props.placeholder ?? "Select options"}
      closeOnSelection={props.closeOnSelection ?? false}
      itemComponent={(itemProps) => {
        const raw = itemProps.item.rawValue
        const label = props.getOptionLabel(raw)
        const desc = props.getOptionDesc(raw)
        const updateDialog = children(() =>
          props.getUpdateDialog?.(itemProps.item.rawValue)
        )
        const deleteDialog = children(() =>
          props.getDeleteDialog?.(itemProps.item.rawValue)
        )
        return (
          <SelectItem
            item={itemProps.item}
            itemClass="flex items-start space-x-2 w-full"
          >
            <Checkbox id={raw.documentId} checked={props.value === raw} />
            <div class="grid gap-1.5 leading-none">
              {label}
              <Show when={desc}>
                <SelectDescription class="max-w-xl">{desc}</SelectDescription>
              </Show>
            </div>
            <Show when={updateDialog}>{updateDialog()}</Show>
            <Show when={deleteDialog}>{deleteDialog()}</Show>
          </SelectItem>
        )
      }}
    >
      <div class={cn("inline-flex flex-col gap-1.5")}>
        <Show when={props.label}>
          <SelectLabel
            class={cn("w-full", props.error ? "text-destructive" : "")}
            for={name()}
          >
            {props.label}
          </SelectLabel>
        </Show>
        <FormInputDescription description={props.description} />
      </div>
      <SelectHiddenSelect />
      <SelectTrigger
        class={cn(
          "h-auto min-h-10 w-full",
          props.error ? "border-destructive text-destructive" : ""
        )}
        aria-label={props.label ?? "Select"}
      >
        <SelectValue<TData> class="flex grow items-center justify-between gap-2 truncate">
          {(state) => (
            <>
              <div class="flex flex-wrap items-center gap-2 max-h-20 overflow-y-auto">
                <For each={state.selectedOptions()}>
                  {(option) => (
                    <span
                      class="inline-flex items-center gap-x-2 rounded bg-zinc-100 px-2 py-0 text-sm text-primary"
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      {props.getOptionLabel(option)}
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
                  )}
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
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          class={cn(
            "relative z-50 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80"
          )}
        >
          <div class="">
            <SelectPrimitive.Listbox class="max-h-60 overflow-y-auto m-0 p-1" />
            <div class="w-full relative bottom-0 left-0 flex flex-row gap-2">
              <Show when={createDialog}>{createDialog()}</Show>
              <Show when={hasMore()}>
                <Button
                  class="w-full"
                  variant={"link"}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    fetchNext()
                  }}
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
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
      <Show when={props.error}>
        <FormInputErrors
          class={cn(orientation() === "horizontal" ? "col-span-2" : "")}
          error={props.error}
        />
      </Show>
    </Select>
  )
}
