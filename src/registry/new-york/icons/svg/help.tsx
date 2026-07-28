import type { ComponentProps } from "solid-js"

export const help = (props: ComponentProps<"svg">) => (
  <svg
    {...props}
    stroke-width="0"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    fill="currentColor"
    color="currentColor"
    style={{ overflow: "visible" }}
  >
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-miterlimit="10"
      stroke-width="40"
      d="M160 164s1.44-33 33.54-59.46C212.6 88.83 235.49 84.28 256 84c18.73-.23 35.47 2.94 45.48 7.82C318.59 100.2 352 120.6 352 164c0 45.67-29.18 66.37-62.35 89.18S248 298.36 248 324"
    />
    <path d="M248 367.99A32 32 0 1 0 248 431.99 32 32 0 1 0 248 367.99z" />
  </svg>
)

export default help
