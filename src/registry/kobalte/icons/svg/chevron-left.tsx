import type { ComponentProps } from "solid-js"

export const chevronLeft = (props: ComponentProps<"svg">) => (
  <>
    <svg
      {...props}
      fill="none"
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      viewBox="0 0 24 24"
      style={{ overflow: "visible", color: "currentcolor" }}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M15.75 19.5 8.25 12l7.5-7.5"
      />
    </svg>
  </>
)

export default chevronLeft
