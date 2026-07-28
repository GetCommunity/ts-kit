import { ComponentProps } from "solid-js"

export const checkboxMinus = (props: ComponentProps<"svg">) => (
  <svg
    {...props}
    fill="currentColor"
    stroke-width="0"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    style={{ overflow: "visible", color: "currentcolor" }}
  >
    <path d="M9.01 11h6v2h-6z" />
    <path d="M17 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zM7 17V7h10v10z" />
  </svg>
)

export default checkboxMinus
