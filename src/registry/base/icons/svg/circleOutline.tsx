import { ComponentProps } from "solid-js"

export const circleOutline = (props: ComponentProps<"svg">) => (
  <svg
    fill="currentColor"
    stroke-width="0"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    style={{ overflow: "visible", color: "currentcolor" }}
    {...props}
  >
    <path d="M464 256a208 208 0 1 0-416 0 208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0 256 256 0 1 1-512 0z" />
  </svg>
)

export default circleOutline
