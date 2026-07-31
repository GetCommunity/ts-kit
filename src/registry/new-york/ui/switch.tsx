import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import type { JSX, ValidComponent } from "solid-js"
import * as SwitchPrimitive from "@kobalte/core/switch"
import { splitProps } from "solid-js"
import { cn } from "@/lib/utils/tailwind"

const Switch = SwitchPrimitive.Root
const SwitchDescription = SwitchPrimitive.Description
const SwitchErrorMessage = SwitchPrimitive.ErrorMessage

type SwitchControlProps = SwitchPrimitive.SwitchControlProps & {
  class?: string | undefined
  children?: JSX.Element
  label?: string | undefined
}

const SwitchControl = <T extends ValidComponent = "input">(
  props: PolymorphicProps<T, SwitchControlProps>
) => {
  const [local, others] = splitProps(props as SwitchControlProps, [
    "class",
    "children",
    "label"
  ])
  return (
    <>
      <SwitchPrimitive.Input
        class={cn(
          "[&:focus-visible+div]:outline-hidden [&:focus-visible+div]:ring-2 [&:focus-visible+div]:ring-ring [&:focus-visible+div]:ring-offset-2 [&:focus-visible+div]:ring-offset-background",
          local.class
        )}
        aria-label={local.label}
      />
      <SwitchPrimitive.Control
        class={cn(
          "inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-input transition-[color,background-color,box-shadow] ui-disabled:cursor-not-allowed ui-checked:bg-primary ui-disabled:opacity-50",
          local.class
        )}
        {...others}
      >
        {local.children}
      </SwitchPrimitive.Control>
    </>
  )
}

type SwitchThumbProps = SwitchPrimitive.SwitchThumbProps & {
  class?: string | undefined
}

const SwitchThumb = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SwitchThumbProps>
) => {
  const [local, others] = splitProps(props as SwitchThumbProps, ["class"])
  return (
    <SwitchPrimitive.Thumb
      class={cn(
        "pointer-events-none block size-5 translate-x-0 rounded-full bg-background shadow-lg ring-0 transition-transform ui-checked:translate-x-5",
        local.class
      )}
      {...others}
    />
  )
}

type SwitchLabelProps = SwitchPrimitive.SwitchLabelProps & {
  class?: string | undefined
}

const SwitchLabel = <T extends ValidComponent = "label">(
  props: PolymorphicProps<T, SwitchLabelProps>
) => {
  const [local, others] = splitProps(props as SwitchLabelProps, ["class"])
  return (
    <SwitchPrimitive.Label
      class={cn(
        "text-sm font-medium leading-none ui-disabled:cursor-not-allowed ui-disabled:opacity-70",
        local.class
      )}
      {...others}
    />
  )
}

export {
  Switch,
  SwitchControl,
  SwitchDescription,
  SwitchErrorMessage,
  SwitchLabel,
  SwitchThumb
}
