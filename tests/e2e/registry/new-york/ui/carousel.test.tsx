import { fireEvent, render, screen } from "@solidjs/testing-library"

const emblaMocks = vi.hoisted(() => {
  const api = {
    canScrollNext: vi.fn(() => true),
    canScrollPrev: vi.fn(() => true),
    off: vi.fn(),
    on: vi.fn(),
    scrollNext: vi.fn(),
    scrollPrev: vi.fn()
  }

  return {
    api,
    apiValue: api as typeof api | undefined,
    options: [] as Array<unknown>,
    plugins: [] as Array<unknown>,
    ref: vi.fn(),
    refValue: undefined as unknown
  }
})

vi.mock("embla-carousel-solid", () => ({
  default: (options: () => unknown, plugins: () => unknown) => {
    emblaMocks.options.push(options())
    emblaMocks.plugins.push(plugins())
    return [emblaMocks.refValue, () => emblaMocks.apiValue]
  }
}))

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/registry/new-york/ui/carousel"

describe("Carousel", () => {
  beforeEach(() => {
    emblaMocks.apiValue = emblaMocks.api
    emblaMocks.options.length = 0
    emblaMocks.plugins.length = 0
    vi.clearAllMocks()
    emblaMocks.refValue = emblaMocks.ref
  })

  it("renders carousel structure and navigation buttons", () => {
    const setApi = vi.fn()
    const plugin = {
      name: "test-plugin",
      options: {},
      init: vi.fn(),
      destroy: vi.fn()
    }
    const { unmount } = render(() => (
      <Carousel
        orientation="vertical"
        class="custom-carousel"
        plugins={[plugin]}
        setApi={setApi}
      >
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
    expect(setApi).toHaveBeenCalledWith(expect.any(Function))
    expect(emblaMocks.options[0]).toEqual(expect.objectContaining({ axis: "y" }))
    expect(emblaMocks.plugins[0]).toHaveLength(1)
    expect(emblaMocks.api.on).toHaveBeenCalledWith("select", expect.any(Function))

    fireEvent.click(screen.getByRole("button", { name: "Previous slide" }))
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }))
    expect(emblaMocks.api.scrollPrev).toHaveBeenCalled()
    expect(emblaMocks.api.scrollNext).toHaveBeenCalled()

    unmount()
    expect(emblaMocks.api.off).toHaveBeenCalledWith("select", expect.any(Function))
  })

  it("supports horizontal keyboard navigation and default plugins", () => {
    render(() => (
      <Carousel class="horizontal-carousel">
        <CarouselContent>
          <CarouselItem>Only slide</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    ))

    const region = screen.getByRole("region")
    expect(screen.getByText("Only slide")).toHaveClass("pl-4")
    expect(screen.getByRole("button", { name: "Previous slide" })).toHaveClass(
      "-left-12"
    )
    expect(emblaMocks.options[0]).toEqual(expect.objectContaining({ axis: "x" }))
    expect(emblaMocks.plugins[0]).toEqual([])

    fireEvent.keyDown(region, { key: "ArrowLeft" })
    fireEvent.keyDown(region, { key: "ArrowRight" })
    fireEvent.keyDown(region, { key: "Enter" })

    expect(emblaMocks.api.scrollPrev).toHaveBeenCalledOnce()
    expect(emblaMocks.api.scrollNext).toHaveBeenCalledOnce()
  })

  it("stays disabled while the carousel API is unavailable", () => {
    emblaMocks.apiValue = undefined

    render(() => (
      <Carousel>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    ))

    expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Next slide" })).toBeDisabled()

    fireEvent.keyDown(screen.getByRole("region"), { key: "ArrowLeft" })
    fireEvent.keyDown(screen.getByRole("region"), { key: "ArrowRight" })
  })

  it("rejects carousel parts rendered outside the provider", () => {
    expect(() => render(() => <CarouselContent />)).toThrow(
      "useCarousel must be used within a <Carousel />"
    )
  })

  it("accepts an element-style carousel ref from the adapter", () => {
    emblaMocks.refValue = document.createElement("div")

    render(() => (
      <Carousel>
        <CarouselContent>Slides</CarouselContent>
      </Carousel>
    ))

    expect(screen.getByText("Slides")).toBeInTheDocument()
  })
})
