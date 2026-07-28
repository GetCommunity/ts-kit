import type { ComponentProps } from "solid-js"

export const clipboard = (props: ComponentProps<"svg">) => (
  <svg
    fill="none"
    stroke-width="2"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    viewBox="0 0 24 24"
    {...props}
    style={{ overflow: "visible", color: "currentcolor" }}
  >
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
  </svg>
)

export default clipboard
