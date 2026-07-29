import type { ComponentProps } from "solid-js"

export const checkBoxIndeterminate = (props: ComponentProps<"svg">) => (
  <svg
    {...props}
    fill="currentColor"
    stroke-width="0"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    style={{ overflow: "visible", color: "currentcolor" }}
  >
    <path
      fill="currentColor"
      d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm1 2v14h14V5H5Zm2 6h10v2H7v-2Z"
    />
  </svg>
)

export default checkBoxIndeterminate
