import "@testing-library/jest-dom/vitest"

import { vi } from "vitest"

// JSDOM doesn't perform layout, so the body otherwise reports a width of 0.
// Matching it to the viewport prevents scroll-lock libraries from detecting a
// viewport-sized scrollbar and generating invalid computed CSS values.
Object.defineProperty(document.body, "offsetWidth", {
  configurable: true,
  get: () => window.innerWidth
})

// Match Media
if (typeof window.matchMedia !== "function") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  })
}

// Scoll
window.scrollTo = vi.fn()
Element.prototype.scrollIntoView = vi.fn()

// Resize
if (!("ResizeObserver" in globalThis)) {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

// Intersection
if (!("IntersectionObserver" in globalThis)) {
  globalThis.IntersectionObserver = class IntersectionObserver {
    readonly root = null
    readonly rootMargin = ""
    readonly scrollMargin = ""
    readonly thresholds = []

    disconnect() {}
    observe() {}
    takeRecords() {
      return []
    }
    unobserve() {}
  }
}
