import type { ComponentProps } from "solid-js"
import * as SolidJs from "solid-js"

export const menuOpen = (props: ComponentProps<"svg">) => {
  const [, rest] = SolidJs.splitProps(props, ["class"])
  return (
    <svg
      fill="currentColor"
      stroke-width="0"
      viewBox="0 0 16 16"
      class={props.class}
      {...rest}
    >
      <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
    </svg>
  )
}

export default menuOpen
