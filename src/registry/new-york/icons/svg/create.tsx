import { ComponentProps } from "solid-js"

export const create = (props: ComponentProps<"svg">) => (
  <svg
    fill="currentColor"
    stroke-width="0"
    viewBox="0 0 1024 1024"
    style={{ overflow: "visible", color: "currentcolor" }}
    {...props}
  >
    <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8Z" />
    <path d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8Z" />
  </svg>
)

export default create
