import { fireEvent, render, screen } from "@solidjs/testing-library"

import { ScrollArea, ScrollBar } from "@/registry/kobalte/ui/scroll-area"

describe("ScrollArea", () => {
  it("renders a native viewport and updates its custom scrollbar", () => {
    const handleMouseEnter = vi.fn()
    const handleMouseLeave = vi.fn()
    const clientHeight = vi
      .spyOn(HTMLElement.prototype, "clientHeight", "get")
      .mockReturnValue(100)
    const scrollHeight = vi
      .spyOn(HTMLElement.prototype, "scrollHeight", "get")
      .mockReturnValue(400)
    let resizeCallback: ResizeObserverCallback | undefined

    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: ResizeObserverCallback) {
          resizeCallback = callback
        }

        disconnect() {}
        observe() {}
        unobserve() {}
      }
    )

    render(() => (
      <ScrollArea
        aria-label="Activity"
        class="custom-scroll-area"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div>Scrollable activity</div>
      </ScrollArea>
    ))

    const area = screen.getByLabelText("Activity")
    const viewport = area.querySelector<HTMLElement>(
      "[data-slot='scroll-area-viewport']"
    )
    const scrollbar = area.querySelector<HTMLElement>(
      "[data-slot='scroll-area-scrollbar']"
    )
    const thumb = area.querySelector<HTMLElement>("[data-slot='scroll-area-thumb']")

    viewport!.scrollTop = 100

    fireEvent.scroll(viewport!)
    fireEvent.mouseEnter(area)
    resizeCallback?.([], {} as ResizeObserver)

    expect(area).toHaveClass("custom-scroll-area")
    expect(viewport).toHaveTextContent("Scrollable activity")
    expect(scrollbar).toHaveAttribute("data-orientation", "vertical")
    expect(scrollbar).not.toHaveClass("opacity-0")
    expect(thumb).toHaveStyle({ height: "25%" })
    expect(handleMouseEnter).toHaveBeenCalledOnce()

    vi.spyOn(scrollbar!, "getBoundingClientRect").mockReturnValue(
      createRect({ height: 100, top: 0 })
    )
    vi.spyOn(thumb!, "getBoundingClientRect").mockReturnValue(
      createRect({ height: 25, top: 20 })
    )

    fireEvent.mouseDown(thumb!, { clientY: 30 })
    fireEvent.mouseMove(document, { clientY: 60 })
    expect(viewport!.scrollTop).toBeGreaterThan(100)

    fireEvent.scroll(viewport!)
    fireEvent.mouseUp(document)

    viewport!.scrollTop = 200
    fireEvent.click(scrollbar!, { clientY: 10 })
    expect(viewport!.scrollTop).toBe(100)
    fireEvent.click(scrollbar!, { clientY: 30 })
    expect(viewport!.scrollTop).toBe(100)
    fireEvent.click(scrollbar!, { clientY: 90 })
    expect(viewport!.scrollTop).toBe(200)

    fireEvent.mouseLeave(area)
    expect(scrollbar).toHaveClass("opacity-0")
    expect(handleMouseLeave).toHaveBeenCalledOnce()

    clientHeight.mockRestore()
    scrollHeight.mockRestore()
    vi.unstubAllGlobals()
  })

  it("supports horizontal dragging and track paging", () => {
    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(100)
    vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(100)
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(100)
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(400)

    render(() => (
      <ScrollArea aria-label="Timeline">
        Timeline content
        <ScrollBar orientation="horizontal" class="horizontal-scrollbar" />
      </ScrollArea>
    ))

    const area = screen.getByLabelText("Timeline")
    const viewport = area.querySelector<HTMLElement>(
      "[data-slot='scroll-area-viewport']"
    )!
    const scrollbar = area.querySelector<HTMLElement>(
      "[data-orientation='horizontal']"
    )!
    const thumb = scrollbar.querySelector<HTMLElement>(
      "[data-slot='scroll-area-thumb']"
    )!

    viewport.scrollLeft = 100
    fireEvent.scroll(viewport)
    fireEvent.mouseEnter(area)

    expect(scrollbar).not.toHaveClass("opacity-0")
    expect(thumb).toHaveStyle({ width: "25%" })

    vi.spyOn(scrollbar, "getBoundingClientRect").mockReturnValue(
      createRect({ left: 0, width: 100 })
    )
    vi.spyOn(thumb, "getBoundingClientRect").mockReturnValue(
      createRect({ left: 20, width: 25 })
    )

    fireEvent.mouseDown(thumb, { clientX: 30 })
    fireEvent.mouseMove(document, { clientX: 60 })
    expect(viewport.scrollLeft).toBeGreaterThan(100)
    fireEvent.mouseUp(document)

    viewport.scrollLeft = 200
    fireEvent.click(scrollbar, { clientX: 10 })
    expect(viewport.scrollLeft).toBe(100)
    fireEvent.click(scrollbar, { clientX: 30 })
    expect(viewport.scrollLeft).toBe(100)
    fireEvent.click(scrollbar, { clientX: 90 })
    expect(viewport.scrollLeft).toBe(200)
  })

  it("stays hidden without overflow and requires a provider", () => {
    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(100)
    vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(100)
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(100)
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(100)

    render(() => (
      <ScrollArea aria-label="Short content">
        Short
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    ))

    const area = screen.getByLabelText("Short content")
    const scrollbar = area.querySelector<HTMLElement>("[data-orientation='vertical']")!
    const thumb = scrollbar.querySelector<HTMLElement>(
      "[data-slot='scroll-area-thumb']"
    )!

    fireEvent.mouseEnter(area)
    fireEvent.mouseLeave(area)
    expect(scrollbar).toHaveClass("opacity-0")

    fireEvent.mouseDown(thumb, { clientY: 5 })
    fireEvent.mouseMove(document, { clientY: 10 })
    fireEvent.mouseUp(document)

    const horizontalScrollbar = area.querySelector<HTMLElement>(
      "[data-orientation='horizontal']"
    )!
    const horizontalThumb = horizontalScrollbar.querySelector<HTMLElement>(
      "[data-slot='scroll-area-thumb']"
    )!

    fireEvent.scroll(
      area.querySelector<HTMLElement>("[data-slot='scroll-area-viewport']")!
    )
    fireEvent.mouseDown(horizontalThumb, { clientX: 5 })
    fireEvent.mouseMove(document, { clientX: 10 })
    fireEvent.mouseUp(document)

    expect(() => render(() => <ScrollBar />)).toThrow(
      "useScrollArea must be used within a <ScrollArea />"
    )
  })
})

function createRect(values: Partial<DOMRect>): DOMRect {
  return {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
    ...values
  }
}
