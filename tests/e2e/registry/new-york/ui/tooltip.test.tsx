import { render, screen } from "@solidjs/testing-library"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/new-york/ui/tooltip"

describe("Tooltip", () => {
  it("renders trigger and open tooltip content", () => {
    render(() => (
      <Tooltip open>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent class="custom-tooltip">Helpful detail</TooltipContent>
      </Tooltip>
    ))

    expect(screen.getByText("Hover me")).toBeInTheDocument()
    expect(screen.getByRole("tooltip")).toHaveClass("custom-tooltip", "bg-popover")
    expect(screen.getByText("Helpful detail")).toBeInTheDocument()
  })
})
