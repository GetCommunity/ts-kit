import * as PopoverPrimitive from "@kobalte/core/popover"
import { splitProps } from "solid-js"

import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import type { Component, ValidComponent } from "solid-js"

import { cn } from "@/lib/utils/tailwind"

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

export { Popover, PopoverContent, PopoverTrigger }
