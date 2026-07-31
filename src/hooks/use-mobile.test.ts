import { renderHook } from "@solidjs/testing-library"

import { useIsMobile } from "@/hooks/use-mobile"

describe("useIsMobile", () => {
  it("uses the media query value and reacts to changes", () => {
    let changeHandler:
      ((event: Pick<MediaQueryListEvent, "matches">) => void) | undefined
    const removeEventListener = vi.fn()

    vi.spyOn(window, "matchMedia").mockImplementation((query) => {
      expect(query).toBe("(max-width: 767px)")

      return {
        matches: true,
        media: query,
        onchange: null,
        addEventListener: vi.fn((_type, handler) => {
          changeHandler = handler as (
            event: Pick<MediaQueryListEvent, "matches">
          ) => void
        }),
        removeEventListener,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn()
      }
    })

    const { cleanup, result } = renderHook(() => useIsMobile(false))

    expect(result()).toBe(true)

    changeHandler?.({ matches: false })
    expect(result()).toBe(false)

    cleanup()
    expect(removeEventListener).toHaveBeenCalledWith("change", changeHandler)
  })
})
