import { render, screen } from "@solidjs/testing-library"

import {
  Slider,
  SliderFill,
  SliderLabel,
  SliderThumb,
  SliderTrack,
  SliderValueLabel
} from "@/registry/base/ui/slider"

describe("Slider", () => {
  it("renders slider parts with label and value label", () => {
    render(() => (
      <Slider value={[25]} minValue={0} maxValue={100}>
        <SliderLabel>Volume</SliderLabel>
        <SliderValueLabel />
      </Slider>
    ))

    expect(screen.getByText("Volume")).toHaveClass("text-sm")
    expect(screen.getByText("25")).toHaveClass("text-sm")
    expect(screen.getByText("Volume").parentElement).toHaveClass("touch-none")
  })

  it("renders the track, fill, thumb, and native range input", () => {
    const rectSpy = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockReturnValue({
        bottom: 20,
        height: 20,
        left: 0,
        right: 100,
        top: 0,
        width: 100,
        x: 0,
        y: 0,
        toJSON: () => ({})
      })
    const setPropertySpy = vi
      .spyOn(CSSStyleDeclaration.prototype, "setProperty")
      .mockImplementation(() => {})
    const { container } = render(() => (
      <Slider value={[40]} minValue={0} maxValue={100}>
        <SliderTrack class="custom-track">
          <SliderFill class="custom-fill" />
          <SliderThumb class="custom-thumb" />
        </SliderTrack>
      </Slider>
    ))

    expect(container.querySelector(".custom-track")).toHaveClass("bg-secondary")
    expect(container.querySelector(".custom-fill")).toHaveClass("bg-primary")
    expect(container.querySelector('[role="slider"]')).toHaveClass("custom-thumb")
    expect(container.querySelector('input[type="range"]')).toBeInTheDocument()
    rectSpy.mockRestore()
    setPropertySpy.mockRestore()
  })
})
