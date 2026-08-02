import * as SelectPrimitive from "@kobalte/core/select"
import { mergeProps, splitProps } from "solid-js"

import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import type { ComponentProps, JSX, ValidComponent } from "solid-js"

import { cn } from "@/registry/kobalte/lib/utils/tailwind"
import { labelVariants } from "@/registry/kobalte/ui/label"

const Select = SelectPrimitive.Root
const SelectValue = SelectPrimitive.Value
const SelectHiddenSelect = SelectPrimitive.HiddenSelect

type SelectGroupProps<T extends ValidComponent = "div"> = PolymorphicProps<
  T,
  SelectPrimitive.SelectSectionProps<T>
> &
  Pick<ComponentProps<T>, "class">

const SelectGroup = <T extends ValidComponent = "div">(props: SelectGroupProps<T>) => {
  const [local, others] = splitProps(props as SelectGroupProps, ["class"])
  return (
    <SelectPrimitive.Section
      class={cn("z-select-group", local.class)}
      data-slot="select-group"
      {...others}
    />
  )
}

type SelectTriggerProps<T extends ValidComponent = "button"> =
  SelectPrimitive.SelectTriggerProps<T> & {
    class?: string | undefined
    children?: JSX.Element
    size?: "sm" | "default"
  }

const SelectTrigger = <T extends ValidComponent = "button">(
  rawProps: PolymorphicProps<T, SelectTriggerProps<T>>
) => {
  const props = mergeProps({ size: "default" }, rawProps)
  const [local, others] = splitProps(props as SelectTriggerProps, [
    "class",
    "children",
    "size"
  ])
  return (
    <SelectPrimitive.Trigger
      class={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        local.class
      )}
      data-size={local.size}
      data-slot="select-trigger"
      {...others}
    >
      {local.children}
      <SelectPrimitive.Icon
        as="svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-4 opacity-50"
      >
        <path d="M8 9l4 -4l4 4" />
        <path d="M16 15l-4 4l-4 -4" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

type SelectContentProps<T extends ValidComponent = "div"> =
  SelectPrimitive.SelectContentProps<T> & {
    class?: string | undefined
    children?: JSX.Element
  }

const SelectContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SelectContentProps<T>>
) => {
  const [local, others] = splitProps(props as SelectContentProps, ["class", "children"])
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        class={cn(
          "relative z-50 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80",
          local.class
        )}
        {...others}
      >
        <SelectPrimitive.Listbox class="m-0 p-1" />
        {local.children}
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

type SelectItemProps<T extends ValidComponent = "li"> =
  SelectPrimitive.SelectItemProps<T> & {
    class?: string | undefined
    children?: JSX.Element
    itemClass?: string | undefined
  }

const SelectItem = <T extends ValidComponent = "li">(
  props: PolymorphicProps<T, SelectItemProps<T>>
) => {
  const [local, others] = splitProps(props as SelectItemProps, [
    "class",
    "children",
    "itemClass"
  ])
  return (
    <SelectPrimitive.Item
      class={cn(
        "relative mt-0 flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground ui-disabled:pointer-events-none ui-disabled:opacity-50",
        local.class
      )}
      {...others}
    >
      <SelectPrimitive.ItemIndicator class="absolute right-2 flex size-3.5 items-center justify-centera">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-4"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M5 12l5 5l10 -10" />
        </svg>
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemLabel class={cn(local.itemClass)}>
        {local.children}
      </SelectPrimitive.ItemLabel>
    </SelectPrimitive.Item>
  )
}

type SelectLabelProps<T extends ValidComponent = "label"> =
  SelectPrimitive.SelectLabelProps<T> & {
    class?: string | undefined
  }

const SelectLabel = <T extends ValidComponent = "label">(
  props: PolymorphicProps<T, SelectLabelProps<T>>
) => {
  const [local, others] = splitProps(props as SelectLabelProps, ["class"])
  return <SelectPrimitive.Label class={cn(labelVariants(), local.class)} {...others} />
}

type SelectDescriptionProps<T extends ValidComponent = "div"> =
  SelectPrimitive.SelectDescriptionProps<T> & {
    class?: string | undefined
  }

const SelectDescription = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SelectDescriptionProps<T>>
) => {
  const [local, others] = splitProps(props as SelectDescriptionProps, ["class"])
  return (
    <SelectPrimitive.Description
      class={cn(labelVariants({ variant: "description" }), local.class)}
      {...others}
    />
  )
}

type SelectErrorMessageProps<T extends ValidComponent = "div"> =
  SelectPrimitive.SelectErrorMessageProps<T> & {
    class?: string | undefined
  }

const SelectErrorMessage = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SelectErrorMessageProps<T>>
) => {
  const [local, others] = splitProps(props as SelectErrorMessageProps, ["class"])
  return (
    <SelectPrimitive.ErrorMessage
      class={cn(labelVariants({ variant: "error" }), local.class)}
      {...others}
    />
  )
}

type SelectSeparatorProps<T extends ValidComponent = "hr"> = ComponentProps<T> & {
  class?: string | undefined
}

const SelectSeparator = <T extends ValidComponent = "hr">(
  props: PolymorphicProps<T, SelectSeparatorProps<T>>
) => {
  const [local, others] = splitProps(props as SelectSeparatorProps, ["class"])
  return (
    <hr
      class={cn("pointer-events-none z-select-separator", local.class)}
      data-slot="select-separator"
      {...others}
    />
  )
}

export {
  Select,
  SelectContent,
  SelectDescription,
  SelectErrorMessage,
  SelectGroup,
  SelectHiddenSelect,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue
}
