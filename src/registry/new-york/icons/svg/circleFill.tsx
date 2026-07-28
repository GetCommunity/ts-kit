import { ComponentProps } from "solid-js"

export const circleFill = (props: ComponentProps<"svg">) => (
  <svg
    fill="currentColor"
    stroke-width="0"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    style={{ overflow: "visible", color: "currentcolor" }}
    {...props}
  >
    <path d="M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512z" />
  </svg>
)

export default circleFill
