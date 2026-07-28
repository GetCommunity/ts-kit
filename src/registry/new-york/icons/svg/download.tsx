import { ComponentProps } from "solid-js"

export const download = (props: ComponentProps<"svg">) => (
  <svg
    {...props}
    fill="currentColor"
    stroke-width="0"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    style={{
      overflow: "visible",
      color: "currentcolor"
    }}
  >
    <path d="M19 9h-4V3H9v6H5l7 8zM4 19h16v2H4z" />
  </svg>
)

export default download
