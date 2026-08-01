import * as PopoverPrimitive from "@kobalte/core/popover"
import { splitProps } from "solid-js"

import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import type { Component, ComponentProps, ValidComponent } from "solid-js"

import { cn } from "@/registry/kobalte/lib/utils/tailwind"

const PopoverTrigger = PopoverPrimitive.Trigger

const Popover: Component<PopoverPrimitive.PopoverRootProps> = (props) => {
  return <PopoverPrimitive.Root gutter={4} {...props} />
}

type PopoverContentProps<T extends ValidComponent = "div"> =
  PopoverPrimitive.PopoverContentProps<T> & { class?: string | undefined }

const PopoverContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, PopoverContentProps<T>>
) => {
  const [local, others] = splitProps(props as PopoverContentProps, ["class"])
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        class={cn(
          "z-50 w-72 origin-(--kb-popover-content-transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none ui-expanded:animate-in ui-closed:animate-out ui-closed:fade-out-0 ui-expanded:fade-in-0 ui-closed:zoom-out-95 ui-expanded:zoom-in-95",
          local.class
        )}
        {...others}
      />
    </PopoverPrimitive.Portal>
  )
}

type PopoverHeaderProps = ComponentProps<"div"> & {
  class?: string | undefined
}

const PopoverHeader = (props: PopoverHeaderProps) => {
  const [local, others] = splitProps(props, ["class"])
  return (
    <div
      data-slot="popover-header"
      class={cn("z-popover-header", local.class)}
      {...others}
    />
  )
}

type PopoverTitleProps<T extends ValidComponent = "h2"> = PolymorphicProps<
  T,
  PopoverPrimitive.PopoverTitleProps<T>
> &
  Pick<ComponentProps<T>, "class">

const PopoverTitle = <T extends ValidComponent = "h2">(props: PopoverTitleProps<T>) => {
  const [local, others] = splitProps(props as PopoverTitleProps, ["class"])
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      class={cn("z-font-heading z-popover-title", local.class)}
      {...others}
    />
  )
}

type PopoverDescriptionProps<T extends ValidComponent = "p"> = PolymorphicProps<
  T,
  PopoverPrimitive.PopoverDescriptionProps<T>
> &
  Pick<ComponentProps<T>, "class">

const PopoverDescription = <T extends ValidComponent = "p">(
  props: PopoverDescriptionProps<T>
) => {
  const [local, others] = splitProps(props as PopoverDescriptionProps, ["class"])
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      class={cn("z-popover-description", local.class)}
      {...others}
    />
  )
}

type PopoverArrowProps<T extends ValidComponent = "div"> = PolymorphicProps<
  T,
  PopoverPrimitive.PopoverArrowProps<T>
> &
  Pick<ComponentProps<T>, "class">

const PopoverArrow = <T extends ValidComponent = "div">(
  props: PopoverArrowProps<T>
) => {
  const [local, others] = splitProps(props as PopoverArrowProps, ["class"])
  return (
    <PopoverPrimitive.Arrow
      data-slot="popover-arrow"
      class={cn("z-popover-arrow", local.class)}
      {...others}
    />
  )
}

export {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger
}
