import { cn } from "@/lib/utils"
import { Show } from "solid-js"

type FormInputDescriptionProps = {
  class?: string
  description?: string
}

export default function FormInputDescription(props: FormInputDescriptionProps) {
  return (
    <Show when={props.description}>
      <div
        class={cn(
          "text-sm text-muted-foreground w-full my-0 leading-none",
          props.class
        )}
      >
        {props.description}
      </div>
    </Show>
  )
}
