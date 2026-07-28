import { ComponentProps } from "solid-js"

export const arrowLeft = (props: ComponentProps<"svg">) => (
  <svg
    {...props}
    fill="none"
    stroke-width="2"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    viewBox="0 0 24 24"
    style={{ overflow: "visible", color: "currentcolor" }}
  >
    <path d="M19 12 5 12" />
    <path d="M12 19 5 12 12 5" />
  </svg>
)

export default arrowLeft
