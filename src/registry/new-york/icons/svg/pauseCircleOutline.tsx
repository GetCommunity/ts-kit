import type { ComponentProps } from "solid-js"

export const pauseCircleOutline = (props: ComponentProps<"svg">) => (
  <svg
    {...props}
    fill="currentColor"
    stroke-width="0"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    style={{ overflow: "visible", color: "currentcolor" }}
  >
    <path
      fill="none"
      stroke="currentColor"
      stroke-miterlimit="10"
      stroke-width="32"
      d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192Z"
    />
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-miterlimit="10"
      stroke-width="32"
      d="M208 192 208 320"
    />
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-miterlimit="10"
      stroke-width="32"
      d="M304 192 304 320"
    />
  </svg>
)

export default pauseCircleOutline
