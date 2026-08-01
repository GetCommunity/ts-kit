import {
  ensureExternalScript,
  ensureInlineScript,
  removeScriptById
} from "@/registry/kobalte/lib/utils/script-tag"

describe("script tag utilities", () => {
  afterEach(() => {
    document
      .querySelectorAll('script[id^="script-tag-test-"]')
      .forEach((script) => script.remove())
    vi.unstubAllGlobals()
  })

  it("adds an inline script once", () => {
    ensureInlineScript("script-tag-test-inline", "window.inlineLoaded = true")
    ensureInlineScript("script-tag-test-inline", "window.inlineLoaded = false")

    const scripts = document.querySelectorAll("#script-tag-test-inline")
    expect(scripts).toHaveLength(1)
    expect(scripts[0]).toBeInstanceOf(HTMLScriptElement)
    expect(scripts[0]).toHaveTextContent("window.inlineLoaded = true")
    expect(scripts[0]?.parentElement).toBe(document.head)
  })

  it("adds an asynchronous external script once", () => {
    ensureExternalScript(
      "script-tag-test-external",
      "https://cdn.example.com/analytics.js"
    )
    ensureExternalScript(
      "script-tag-test-external",
      "https://cdn.example.com/replacement.js"
    )

    const scripts = document.querySelectorAll(
      "#script-tag-test-external"
    ) as NodeListOf<HTMLScriptElement>
    expect(scripts).toHaveLength(1)
    expect(scripts[0]).toHaveAttribute("src", "https://cdn.example.com/analytics.js")
    expect(scripts[0]?.async).toBe(true)
    expect(scripts[0]?.parentElement).toBe(document.head)
  })

  it("removes an existing script and ignores a missing script", () => {
    ensureInlineScript("script-tag-test-removable", "void 0")

    removeScriptById("script-tag-test-removable")
    removeScriptById("script-tag-test-removable")

    expect(document.getElementById("script-tag-test-removable")).toBeNull()
  })

  it("does nothing when browser globals are unavailable", () => {
    vi.stubGlobal("window", undefined)

    expect(() =>
      ensureInlineScript("script-tag-test-server-inline", "void 0")
    ).not.toThrow()
    expect(() =>
      ensureExternalScript(
        "script-tag-test-server-external",
        "https://cdn.example.com/server.js"
      )
    ).not.toThrow()
    expect(() => removeScriptById("script-tag-test-server-inline")).not.toThrow()
  })
})
