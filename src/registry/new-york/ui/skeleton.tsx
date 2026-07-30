import type { ComponentProps } from "solid-js"
import { splitProps } from "solid-js"

import { cn } from "@/lib/utils/tailwind"

const Skeleton = (props: ComponentProps<"div">) => {
  const [local, others] = splitProps(props, ["class"])
  return (
    <div
      class={cn("z-skeleton animate-pulse", local.class)}
      data-slot="skeleton"
      {...others}
    />
  )
}

export { Skeleton }
