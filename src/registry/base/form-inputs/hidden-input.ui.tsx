import { Match, Show, Switch, splitProps } from "solid-js"

import { cn } from "@/lib/utils"

export type HiddenInputProps = {
  name: string
  value: string | Array<string> | number | boolean | null | undefined
  error?: [string, ...Array<string>] | null
  disabled?: boolean
}

function HiddenInput(props: HiddenInputProps) {
  const [field, input] = splitProps(props, ["error", "value"])
  const valueIsString = () => typeof field.value === "string"
  const valueIsArray = () => Array.isArray(field.value)
  const valueIsNumber = () => typeof field.value === "number"
  const valueIsBoolean = () => typeof field.value === "boolean"
  return (
    <>
      <div class={cn("inline-flex flex-col grow", !field.error && "hidden")}>
        <Switch
          fallback={
            <input type="hidden" value={field.value as string | undefined} {...input} />
          }
        >
          <Match when={valueIsString()}>
            <input type="hidden" value={field.value as string | undefined} {...input} />
          </Match>
          <Match when={valueIsArray()}>
            <input
              type="hidden"
              value={(field.value as Array<string> | undefined)?.join(",")}
              {...input}
            />
          </Match>
          <Match when={valueIsNumber()}>
            <input type="hidden" value={field.value as number | undefined} {...input} />
          </Match>
          <Match when={valueIsBoolean()}>
            <input
              {...props}
              value={field.value ? "true" : "false"}
              checked={field.value as boolean | undefined}
              type="hidden"
            />
          </Match>
        </Switch>
        <Show when={field.error}>
          <div class="text-sm text-destructive">
            {props.name} Error:{" "}
            {Array.isArray(field.error) ? field.error[0] : field.error}
          </div>
        </Show>
      </div>
    </>
  )
}

export default HiddenInput
