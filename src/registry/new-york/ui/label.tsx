import { cva } from "class-variance-authority"
import { splitProps } from "solid-js"

import type { Component, ComponentProps } from "solid-js"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        label: "ui-invalid:text-destructive",
        description: "font-normal text-muted-foreground",
        error: "text-xs text-destructive",
        sub: "text-sm font-normal text-muted-foreground"
      }
    },
    defaultVariants: {
      variant: "label"
    }
  }
)

const Label: Component<ComponentProps<"label">> = (props) => {
  const [local, others] = splitProps(props, ["class"])
  return <label class={cn(labelVariants(), local.class)} {...others} />
}

export { Label, labelVariants }
