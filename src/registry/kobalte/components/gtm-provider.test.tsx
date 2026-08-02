import { render, waitFor } from "@solidjs/testing-library"

import GTMProvider, {
  GTM_SCRIPT_BOOTSTRAP,
  GTM_SCRIPT_LOADER,
  gtmEvent,
  setGtmAnalyticsConsent
} from "@/registry/kobalte/components/gtm-provider"
import {
  ensureExternalScript,
  ensureInlineScript,
  removeScriptById
} from "@/registry/kobalte/lib/utils/script-tag"

const gtmMocks = vi.hoisted(() => ({
  location: { pathname: "/" },
  consent: {
    accepted: 1,
    necessary: true as const,
    analytics: false,
    marketing: false,
    functional: false
  },
  mutate: vi.fn(),
  getCookies: vi.fn(),
  deleteCookie: vi.fn(),
  ensureExternalScript: vi.fn(),
  ensureInlineScript: vi.fn(),
  removeScriptById: vi.fn()
}))

vi.mock("@tanstack/solid-router", () => ({
  useLocation: () => () => gtmMocks.location
}))

vi.mock("@/registry/kobalte/components/cookie-consent-provider", () => ({
  useCookieConsentState: () => [gtmMocks.consent, { consent: vi.fn() }]
}))

vi.mock("@tanstack/solid-start", () => ({
  createServerFn: () => ({
    handler: <THandler,>(handler: THandler) => handler
  })
}))

vi.mock("@tanstack/solid-start/server", () => ({
  getCookies: gtmMocks.getCookies,
  deleteCookie: gtmMocks.deleteCookie
}))

vi.mock("@tanstack/solid-query", () => ({
  useMutation: (
    factory: () => {
      mutationFn: (variables: unknown) => unknown
    }
  ) => {
    const options = factory()
    return {
      mutate: (
        variables: unknown,
        callbacks?: { onError?: (error: unknown) => void }
      ) => {
        gtmMocks.mutate(variables, callbacks)
        try {
          options.mutationFn(variables)
        } catch (error) {
          callbacks?.onError?.(error)
        }
      }
    }
  }
}))

vi.mock("@/registry/kobalte/lib/utils/script-tag", () => ({
  ensureExternalScript: gtmMocks.ensureExternalScript,
  ensureInlineScript: gtmMocks.ensureInlineScript,
  removeScriptById: gtmMocks.removeScriptById
}))

const defaultProps = {
  isDev: false,
  initialGtmId: "GTM-TEST",
  gtmScriptBootstrap: "test bootstrap",
  sensitivePaths: ["/checkout/payment"]
}

describe("GTM helpers", () => {
  beforeEach(() => {
    setGtmAnalyticsConsent(false)
    window.dataLayer = []
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("builds the loader URL and exports the bootstrap snippet", () => {
    expect(GTM_SCRIPT_LOADER("GTM-ABC123")).toBe(
      "https://www.googletagmanager.com/gtm.js?id=GTM-ABC123"
    )
    expect(GTM_SCRIPT_BOOTSTRAP).toContain("window.dataLayer")
    expect(GTM_SCRIPT_BOOTSTRAP).toContain("gtm.js")
  })

  it("gates ordinary events by analytics consent", () => {
    gtmEvent("page_view", { path: "/private" })
    expect(window.dataLayer).toEqual([])

    gtmEvent("cookie_consent_update", { analytics_storage: "denied" })
    expect(window.dataLayer).toEqual([
      {
        event: "cookie_consent_update",
        analytics_storage: "denied"
      }
    ])

    setGtmAnalyticsConsent(true)
    gtmEvent("page_view", { path: "/dashboard" })
    expect(window.dataLayer.at(-1)).toEqual({
      event: "page_view",
      path: "/dashboard"
    })
  })

  it("creates the data layer when consent exists before GTM has loaded", () => {
    setGtmAnalyticsConsent(true)
    window.dataLayer = undefined as unknown as Array<Record<string, unknown>>

    gtmEvent("page_view")

    expect(window.dataLayer).toEqual([{ event: "page_view" }])
  })

  it("does nothing when rendered outside the browser", () => {
    vi.stubGlobal("window", undefined)
    expect(() => gtmEvent("page_view")).not.toThrow()
  })
})

describe("GTMProvider", () => {
  beforeEach(() => {
    gtmMocks.location.pathname = "/dashboard"
    gtmMocks.consent.analytics = false
    gtmMocks.getCookies.mockReturnValue({
      _ga: "ga",
      _ga_TEST: "ga-property",
      _gcl_au: "gcl",
      _gid: "gid",
      session: "keep"
    })
    setGtmAnalyticsConsent(false)
    window.dataLayer = []
  })

  it("does not initialize GTM in development or without a path", () => {
    const { unmount } = render(() => <GTMProvider {...defaultProps} isDev />)

    expect(ensureInlineScript).not.toHaveBeenCalled()
    expect(ensureExternalScript).not.toHaveBeenCalled()
    expect(removeScriptById).not.toHaveBeenCalled()
    unmount()

    gtmMocks.location.pathname = ""
    render(() => <GTMProvider {...defaultProps} />)
    expect(gtmMocks.mutate).not.toHaveBeenCalled()
  })

  it("removes GTM and clears events on sensitive paths", () => {
    gtmMocks.location.pathname = "/checkout/payment"
    window.dataLayer = [{ event: "existing" }]

    render(() => <GTMProvider {...defaultProps} />)

    expect(removeScriptById).toHaveBeenNthCalledWith(1, "gtm-bootstrap")
    expect(removeScriptById).toHaveBeenNthCalledWith(2, "gtm-loader")
    expect(window.dataLayer).toEqual([])
    expect(gtmMocks.mutate).not.toHaveBeenCalled()
  })

  it("revokes analytics, deletes GTM cookies, and removes scripts", () => {
    const previousDataLayer: Array<Record<string, unknown>> = []
    const push = vi.spyOn(previousDataLayer, "push")
    window.dataLayer = previousDataLayer

    render(() => <GTMProvider {...defaultProps} />)

    expect(push).toHaveBeenCalledWith({
      event: "cookie_consent_update",
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    })
    expect(gtmMocks.mutate).toHaveBeenCalledWith(
      {},
      expect.objectContaining({ onError: expect.any(Function) })
    )
    expect(gtmMocks.deleteCookie.mock.calls.map(([name]) => name)).toEqual([
      "_ga",
      "_ga_TEST",
      "_gcl_au",
      "_gid"
    ])
    expect(removeScriptById).toHaveBeenCalledWith("gtm-bootstrap")
    expect(removeScriptById).toHaveBeenCalledWith("gtm-loader")
    expect(window.dataLayer).toEqual([])
  })

  it("loads GTM and grants storage when analytics consent exists", () => {
    gtmMocks.consent.analytics = true

    render(() => <GTMProvider {...defaultProps} />)

    expect(ensureInlineScript).toHaveBeenCalledWith("gtm-bootstrap", "test bootstrap")
    expect(ensureExternalScript).toHaveBeenCalledWith(
      "gtm-loader",
      "https://www.googletagmanager.com/gtm.js?id=GTM-TEST"
    )
    expect(window.dataLayer).toEqual([
      {
        event: "cookie_consent_update",
        analytics_storage: "granted",
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted"
      }
    ])
    expect(gtmMocks.mutate).not.toHaveBeenCalled()
  })

  it("warns when server-side cookie revocation fails", async () => {
    const error = new Error("Cookie deletion failed")
    gtmMocks.deleteCookie.mockImplementationOnce(() => {
      throw error
    })
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)

    render(() => <GTMProvider {...defaultProps} />)

    await waitFor(() =>
      expect(warn).toHaveBeenCalledWith("GTMProvider revokeConsentAction error", {
        reason: error
      })
    )
    warn.mockRestore()
  })
})
