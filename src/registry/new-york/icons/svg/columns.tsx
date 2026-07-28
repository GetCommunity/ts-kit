import type { ComponentProps } from "solid-js"

export const columns = (props: ComponentProps<"svg">) => (
  <svg
    fill="none"
    stroke-width="2"
    {...props}
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    viewBox="0 0 24 24"
    style={{ overflow: "visible", color: "currentcolor" }}
  >
    <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18" />
  </svg>
)

export default columns
