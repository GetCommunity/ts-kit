import { ComponentProps } from "solid-js"

export const arrowRight = (props: ComponentProps<"svg">) => (
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
    <path d="M5 12 19 12" />
    <path d="M12 5 19 12 12 19" />
  </svg>
)

export default arrowRight
