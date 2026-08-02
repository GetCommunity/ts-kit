import { render, screen } from "@solidjs/testing-library"

import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger
} from "@/registry/kobalte/ui/popover"

describe("Popover", () => {
  it("renders trigger and open content", () => {
    render(() => (
      <Popover open>
        <PopoverTrigger>Open popover</PopoverTrigger>
        <PopoverContent class="custom-popover">
          <PopoverHeader class="custom-header">
            <PopoverTitle class="custom-title">Popover title</PopoverTitle>
            <PopoverDescription class="custom-description">
              Popover description
            </PopoverDescription>
          </PopoverHeader>
          <PopoverArrow class="custom-arrow" />
        </PopoverContent>
      </Popover>
    ))

    expect(screen.getByRole("button", { name: "Open popover" })).toBeInTheDocument()
    expect(screen.getByText("Popover title").closest(".custom-popover")).toHaveClass(
      "bg-popover"
    )
    expect(screen.getByText("Popover title")).toHaveClass("custom-title")
    expect(screen.getByText("Popover description")).toHaveClass("custom-description")
    expect(screen.getByText("Popover title").parentElement).toHaveClass("custom-header")
    expect(document.querySelector('[data-slot="popover-arrow"]')).toHaveClass(
      "custom-arrow"
    )
  })
})
