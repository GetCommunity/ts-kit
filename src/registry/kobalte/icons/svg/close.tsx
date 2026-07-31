import type { ComponentProps } from "solid-js"

export const close = (props: ComponentProps<"svg">) => (
  <svg
    fill="currentColor"
    stroke-width="0"
    viewBox="0 0 512 512"
    style={{ overflow: "visible", color: "currentcolor" }}
    {...props}
  >
    <path d="m289.94 256 95-95A24 24 0 0 0 351 127l-95 95-95-95a24 24 0 0 0-34 34l95 95-95 95a24 24 0 1 0 34 34l95-95 95 95a24 24 0 0 0 34-34Z" />
  </svg>
)

export default close
