import { cn } from "@/registry/kobalte/lib/utils/tailwind"
import { For, Show } from "solid-js"

type FormInputErrorsProps = {
  class?: string
  error?: [string, ...Array<string>] | null
}

export default function FormInputErrors(props: FormInputErrorsProps) {
  return (
    <Show when={props.error}>
      <div class={cn("text-xs leading-none text-error-foreground", props.class)}>
        <For each={props.error}>{(error) => <div>{error}</div>}</For>
      </div>
    </Show>
  )
}
