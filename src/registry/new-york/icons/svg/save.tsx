import { ComponentProps } from "solid-js"

export const save = (props: ComponentProps<"svg">) => (
  <svg
    fill="currentColor"
    stroke-width="0"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    style={{ overflow: "visible", color: "currentcolor" }}
    {...props}
  >
    <path
      fill-rule="evenodd"
      d="m13.353 1.146 1.5 1.5L15 3v11.5l-.5.5h-13l-.5-.5v-13l.5-.5H13l.353.146zM2 2v12h12V3.208L12.793 2H11v4H4V2H2zm6 0v3h2V2H8z"
      clip-rule="evenodd"
    />
  </svg>
)

export default save
