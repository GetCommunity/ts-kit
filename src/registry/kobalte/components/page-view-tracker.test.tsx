import { render } from "@solidjs/testing-library"

import PageViewTracker, {
  DEFAULT_PAGE_VIEW_SENSITIVE_QUERY_PARAMS,
  sanitizePageSearch
} from "@/registry/kobalte/components/page-view-tracker"

const pageViewMocks = vi.hoisted(() => ({
  location: { pathname: "/" },
  consent: {
    accepted: 1,
    necessary: true as const,
    analytics: true,
    marketing: true,
    functional: true
  }
}))

vi.mock("@tanstack/solid-router", () => ({
  useLocation: () => () => pageViewMocks.location
}))

vi.mock("@/registry/kobalte/components/cookie-consent-provider", () => ({
  useCookieConsentState: () => [pageViewMocks.consent, { consent: vi.fn() }]
}))

function renderTracker(
  overrides: Partial<{
    isDev: boolean
    sensitivePaths: Array<string>
    sensitiveQueryParams: Array<string>
    analyticsPageViewEvent: () => void
    marketingPageViewEvent: () => void
  }> = {}
) {
  const analyticsPageViewEvent = vi.fn()
  const marketingPageViewEvent = vi.fn()
  const props = {
    isDev: false,
    sensitivePaths: ["/account/reset"],
    sensitiveQueryParams: DEFAULT_PAGE_VIEW_SENSITIVE_QUERY_PARAMS,
    analyticsPageViewEvent,
    marketingPageViewEvent,
    ...overrides
  }

  render(() => <PageViewTracker {...props} />)
  return props
}

describe("sanitizePageSearch", () => {
  it("removes default sensitive parameters and preserves safe values", () => {
    expect(sanitizePageSearch("?page=2&token=secret&code=private&sort=name")).toBe(
      "?page=2&sort=name"
    )
    expect(sanitizePageSearch("")).toBe("")
  })

  it("supports custom sensitive parameters and empty results", () => {
    expect(sanitizePageSearch("private=yes&visible=yes", ["private"])).toBe(
      "?visible=yes"
    )
    expect(sanitizePageSearch("?token=secret")).toBe("")
  })
})

describe("PageViewTracker", () => {
  beforeEach(() => {
    pageViewMocks.location.pathname = "/dashboard"
    Object.assign(pageViewMocks.consent, {
      analytics: true,
      marketing: true
    })
  })

  it("tracks analytics before marketing when both are allowed", () => {
    const calls: Array<string> = []
    renderTracker({
      analyticsPageViewEvent: () => calls.push("analytics"),
      marketingPageViewEvent: () => calls.push("marketing")
    })

    expect(calls).toEqual(["analytics", "marketing"])
  })

  it("tracks analytics without marketing when marketing consent is denied", () => {
    pageViewMocks.consent.marketing = false
    const { analyticsPageViewEvent, marketingPageViewEvent } = renderTracker()

    expect(analyticsPageViewEvent).toHaveBeenCalledOnce()
    expect(marketingPageViewEvent).not.toHaveBeenCalled()
  })

  it("does not track without analytics consent", () => {
    pageViewMocks.consent.analytics = false
    const { analyticsPageViewEvent, marketingPageViewEvent } = renderTracker()

    expect(analyticsPageViewEvent).not.toHaveBeenCalled()
    expect(marketingPageViewEvent).not.toHaveBeenCalled()
  })

  it.each([
    ["development mode", true, "/dashboard"],
    ["a sensitive path", false, "/account/reset"],
    ["an empty path", false, ""]
  ])("does not track in %s", (_case, isDev, pathname) => {
    pageViewMocks.location.pathname = pathname
    const { analyticsPageViewEvent, marketingPageViewEvent } = renderTracker({
      isDev
    })

    expect(analyticsPageViewEvent).not.toHaveBeenCalled()
    expect(marketingPageViewEvent).not.toHaveBeenCalled()
  })
})
