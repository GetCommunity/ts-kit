import type { ComponentProps } from "solid-js"
import * as SolidJs from "solid-js"

export const menuOpenFull = (props: ComponentProps<"svg">) => {
  const [, rest] = SolidJs.splitProps(props, ["class"])
  return (
    <svg
      fill="currentColor"
      stroke-width="0"
      viewBox="0 0 24 24"
      class={props.class}
      {...rest}
    >
      <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
    </svg>
  )
}

export default menuOpenFull
