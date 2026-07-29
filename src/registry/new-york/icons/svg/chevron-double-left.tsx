import type { ComponentProps } from "solid-js"

export const chevronDoubleLeft = (props: ComponentProps<"svg">) => (
  <svg
    {...props}
    fill="none"
    stroke-width="0"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    viewBox="0 0 24 24"
    style={{ overflow: "visible", color: "currentcolor" }}
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
      d="m18.75 19.5-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
    />
  </svg>
)

export default chevronDoubleLeft
