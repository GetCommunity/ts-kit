import { cva } from "class-variance-authority"

const orientationVariants = cva("w-full inline-flex gap-1.5 max-w-full", {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row" // justify-start items-center
    }
  },
  defaultVariants: {
    orientation: "vertical"
  }
})

export { orientationVariants }
