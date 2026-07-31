import { render, screen } from "@solidjs/testing-library"
import * as v from "valibot"

import CookieConsentProvider, {
  COOKIE_CONSENT_DURATION,
  COOKIE_CONSENT_NAME,
  CookieConsentSchema,
  DEFAULT_COOKIE_CONSENT,
  getCookieConsent,
  saveCookieConsent,
  useCookieConsentState
} from "@/components/cookie-consent-provider"

import type {
  CookieConsentState,
  CookieConsentStateContextProvider
} from "@/components/cookie-consent-provider"

const cookieConsentMocks = vi.hoisted(() => ({
  isServer: false,
  getCookie: vi.fn(),
  setCookie: vi.fn(),
  mutate: vi.fn(),
  sentryWarn: vi.fn()
}))

vi.mock("@tanstack/solid-start", () => ({
  createServerFn: () => ({
    validator: () => ({
      handler: <THandler,>(handler: THandler) => handler
    })
  }),
  createIsomorphicFn: () => ({
    server: <TServer extends () => unknown>(serverHandler: TServer) => ({
      client:
        <TClient extends () => unknown>(clientHandler: TClient) =>
        () =>
          cookieConsentMocks.isServer ? serverHandler() : clientHandler()
    })
  })
}))

vi.mock("@tanstack/solid-start/server", () => ({
  getCookie: cookieConsentMocks.getCookie,
  setCookie: cookieConsentMocks.setCookie
}))

vi.mock("@tanstack/solid-query", () => ({
  useMutation: (factory: () => unknown) => {
    factory()
    return {
      mutate: cookieConsentMocks.mutate
    }
  }
}))

vi.mock("@sentry/solid", () => ({
  logger: {
    warn: cookieConsentMocks.sentryWarn
  }
}))

type ConsentMutationCallbacks = {
  onSuccess: (data: CookieConsentState) => void
  onError: (error: unknown) => void
}

function clearDocumentCookies() {
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim()
    if (name) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    }
  }
}

function setConsentCookie(value: unknown) {
  document.cookie = `${COOKIE_CONSENT_NAME}=${encodeURIComponent(JSON.stringify(value))}; path=/`
}

describe("CookieConsentSchema", () => {
  it("accepts a complete consent record", () => {
    expect(
      v.parse(CookieConsentSchema, {
        accepted: 123,
        necessary: true,
        analytics: true,
        marketing: false,
        functional: true
      })
    ).toEqual({
      accepted: 123,
      necessary: true,
      analytics: true,
      marketing: false,
      functional: true
    })
  })

  it("rejects records that disable necessary cookies", () => {
    expect(() =>
      v.parse(CookieConsentSchema, {
        ...DEFAULT_COOKIE_CONSENT,
        necessary: false
      })
    ).toThrow()
  })
})

describe("cookie consent persistence", () => {
  beforeEach(() => {
    cookieConsentMocks.isServer = false
    clearDocumentCookies()
  })

  afterEach(() => {
    clearDocumentCookies()
    vi.useRealTimers()
  })

  it("timestamps and stores submitted consent on the server", async () => {
    const now = new Date("2026-07-30T18:45:30.000Z")
    vi.useFakeTimers()
    vi.setSystemTime(now)
    cookieConsentMocks.getCookie.mockImplementation((name: string) => {
      if (name === "locale") return "en-US"
      if (name === "tz") return encodeURIComponent("UTC")
      return undefined
    })
    const input: CookieConsentState = {
      accepted: 0,
      necessary: true,
      analytics: true,
      marketing: false,
      functional: true
    }
    const expectedTimestamp = new Date(
      now.toLocaleString("en-US", { timeZone: "UTC" })
    ).getTime()

    const saved = await saveCookieConsent({ data: input })

    expect(saved).toEqual({
      ...input,
      accepted: expectedTimestamp
    })
    expect(cookieConsentMocks.setCookie).toHaveBeenCalledWith(
      COOKIE_CONSENT_NAME,
      JSON.stringify(saved),
      { maxAge: COOKIE_CONSENT_DURATION }
    )
  })

  it("uses default locale and time zone values when cookies are missing", async () => {
    const now = new Date("2026-07-30T18:45:30.000Z")
    vi.useFakeTimers()
    vi.setSystemTime(now)
    cookieConsentMocks.getCookie.mockReturnValue(undefined)
    const input: CookieConsentState = {
      ...DEFAULT_COOKIE_CONSENT,
      marketing: true
    }
    const expectedTimestamp = new Date(
      now.toLocaleString("en-US", { timeZone: "UTC" })
    ).getTime()

    const saved = await saveCookieConsent({ data: input })

    expect(saved.accepted).toBe(expectedTimestamp)
  })

  it("creates the default server cookie when none exists", () => {
    cookieConsentMocks.isServer = true
    cookieConsentMocks.getCookie.mockReturnValue(undefined)

    expect(getCookieConsent()).toEqual(DEFAULT_COOKIE_CONSENT)
    expect(cookieConsentMocks.setCookie).toHaveBeenCalledWith(
      COOKIE_CONSENT_NAME,
      JSON.stringify(DEFAULT_COOKIE_CONSENT),
      { maxAge: COOKIE_CONSENT_DURATION }
    )
  })

  it("reads an existing server cookie and recovers from malformed JSON", () => {
    cookieConsentMocks.isServer = true
    const stored = {
      ...DEFAULT_COOKIE_CONSENT,
      accepted: 123,
      analytics: true
    }
    cookieConsentMocks.getCookie.mockReturnValueOnce(JSON.stringify(stored))

    expect(getCookieConsent()).toEqual(stored)

    cookieConsentMocks.getCookie.mockReturnValueOnce("{invalid")
    expect(getCookieConsent()).toEqual(DEFAULT_COOKIE_CONSENT)
  })

  it("reads and validates an encoded browser cookie", () => {
    const stored = {
      ...DEFAULT_COOKIE_CONSENT,
      accepted: 456,
      marketing: true
    }
    setConsentCookie(stored)

    expect(getCookieConsent()).toEqual(stored)
  })

  it("uses defaults for missing, malformed, or invalid browser cookies", () => {
    expect(getCookieConsent()).toEqual(DEFAULT_COOKIE_CONSENT)

    document.cookie = `${COOKIE_CONSENT_NAME}=%7Binvalid; path=/`
    expect(getCookieConsent()).toEqual(DEFAULT_COOKIE_CONSENT)

    setConsentCookie({
      ...DEFAULT_COOKIE_CONSENT,
      necessary: false
    })
    expect(getCookieConsent()).toEqual(DEFAULT_COOKIE_CONSENT)
  })
})

describe("CookieConsentProvider", () => {
  beforeEach(() => {
    cookieConsentMocks.isServer = false
    clearDocumentCookies()
  })

  afterEach(clearDocumentCookies)

  it("requires consumers to be wrapped by the provider", () => {
    expect(() => useCookieConsentState()).toThrow(
      "<CookieConsentProvider> not found wrapping the <App />."
    )
  })

  it("provides state and updates it after a successful mutation", () => {
    let context: CookieConsentStateContextProvider | undefined
    const Consumer = () => {
      context = useCookieConsentState()
      return <span>Consent consumer</span>
    }
    render(() => (
      <CookieConsentProvider>
        <Consumer />
      </CookieConsentProvider>
    ))
    const submitted: CookieConsentState = {
      ...DEFAULT_COOKIE_CONSENT,
      analytics: true
    }
    const saved: CookieConsentState = {
      ...submitted,
      accepted: 789
    }

    context?.[1].consent(submitted)

    expect(screen.getByText("Consent consumer")).toBeInTheDocument()
    expect(cookieConsentMocks.mutate).toHaveBeenCalledWith(
      { data: submitted },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function)
      })
    )
    const callbacks = cookieConsentMocks.mutate.mock.calls[0]?.[1] as
      ConsentMutationCallbacks | undefined
    callbacks?.onSuccess(saved)
    expect(context?.[0]).toEqual(saved)
  })

  it("reports failed mutations to Sentry without changing state", () => {
    let context: CookieConsentStateContextProvider | undefined
    const Consumer = () => {
      context = useCookieConsentState()
      return null
    }
    render(() => (
      <CookieConsentProvider>
        <Consumer />
      </CookieConsentProvider>
    ))
    const submitted: CookieConsentState = {
      ...DEFAULT_COOKIE_CONSENT,
      functional: true
    }
    const error = new Error("Save failed")

    context?.[1].consent(submitted)
    const callbacks = cookieConsentMocks.mutate.mock.calls[0]?.[1] as
      ConsentMutationCallbacks | undefined
    callbacks?.onError(error)

    expect(cookieConsentMocks.sentryWarn).toHaveBeenCalledWith(
      "CookieConsentProvider cookieConsentMutation error: actions.consent",
      {
        reason: error,
        data: submitted
      }
    )
    expect(context?.[0]).toEqual(DEFAULT_COOKIE_CONSENT)
  })
})
