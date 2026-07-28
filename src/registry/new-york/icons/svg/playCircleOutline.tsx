import type { ComponentProps } from "solid-js"

export const playCircleOutline = (props: ComponentProps<"svg">) => (
  <svg
    {...props}
    fill="currentColor"
    stroke="currentColor"
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
      stroke="currentColor"
      d="m216.32 334.44 114.45-69.14a10.89 10.89 0 0 0 0-18.6l-114.45-69.14a10.78 10.78 0 0 0-16.32 9.31v138.26a10.78 10.78 0 0 0 16.32 9.31Z"
    />
  </svg>
)

export default playCircleOutline
