import { render, screen } from "@solidjs/testing-library"

import { Popover, PopoverContent, PopoverTrigger } from "@/registry/new-york/ui/popover"

describe("Popover", () => {
  it("renders trigger and open content", () => {
    render(() => (
      <Popover open>
        <PopoverTrigger>Open popover</PopoverTrigger>
        <PopoverContent class="custom-popover">Popover content</PopoverContent>
      </Popover>
    ))

    expect(screen.getByRole("button", { name: "Open popover" })).toBeInTheDocument()
    expect(screen.getByText("Popover content")).toHaveClass(
      "custom-popover",
      "bg-popover"
    )
  })
})
