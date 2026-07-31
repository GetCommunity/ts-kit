import { render, screen } from "@solidjs/testing-library"

import { AspectRatio } from "@/registry/kobalte/ui/aspect-ratio"

describe("AspectRatio", () => {
  it("sets the requested ratio and forwards element props", () => {
    render(() => (
      <AspectRatio ratio={16 / 9} class="custom-ratio" aria-label="Video">
        Preview
      </AspectRatio>
    ))

    const ratio = screen.getByLabelText("Video")

    expect(ratio).toHaveAttribute("data-slot", "aspect-ratio")
    expect(ratio).toHaveClass("aspect-(--ratio)", "custom-ratio")
    expect(ratio.style.getPropertyValue("--ratio")).toBe(String(16 / 9))
    expect(ratio).toHaveTextContent("Preview")
  })
})
