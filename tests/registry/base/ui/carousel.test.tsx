import { render, screen } from "@solidjs/testing-library"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/registry/base/ui/carousel"

describe("Carousel", () => {
  it("renders carousel structure and navigation buttons", () => {
    render(() => (
      <Carousel orientation="vertical" class="custom-carousel">
        <CarouselContent containerClass="custom-container">
          <CarouselItem>Slide one</CarouselItem>
          <CarouselItem>Slide two</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    ))

    expect(screen.getByRole("region")).toHaveClass("custom-carousel")
    expect(screen.getAllByRole("group")).toHaveLength(2)
    expect(screen.getByText("Slide one")).toHaveClass("pt-4")
    expect(screen.getByRole("button", { name: "Previous slide" })).toHaveClass(
      "rotate-90"
    )
    expect(screen.getByRole("button", { name: "Next slide" })).toHaveClass("rotate-90")
  })
})
