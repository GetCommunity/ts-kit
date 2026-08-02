import * as Sentry from "@sentry/solid"
import { tanstackRouterBrowserTracingIntegration } from "@sentry/solid/tanstackrouter"

import {
  DEFAULT_SENTRY_FILTERED_VALUE,
  DEFAULT_SENTRY_SENSITIVE_HEADERS,
  DEFAULT_SENTRY_SENSITIVE_QUERY_PARAMS,
  DEFAULT_SENTRY_TRACES_SAMPLE_RATE,
  useSentryTrace
} from "@/registry/kobalte/components/sentry-provider"

const sentryProviderMocks = vi.hoisted(() => ({
  init: vi.fn(),
  integration: { name: "test-tanstack-router-integration" },
  routerIntegration: vi.fn()
}))

vi.mock("@sentry/solid", () => ({
  init: sentryProviderMocks.init
}))

vi.mock("@sentry/solid/tanstackrouter", () => ({
  tanstackRouterBrowserTracingIntegration: sentryProviderMocks.routerIntegration
}))

type RedactionEvent = {
  request?: {
    cookies?: unknown
    headers?: Record<string, string>
    query_string?:
      string | Array<[string, string]> | Record<string, string | Array<string>>
    url?: string
  }
  user?: {
    id?: string
    ip_address?: string
  }
}

type SentryInitHooks = {
  beforeSend: (event: RedactionEvent) => RedactionEvent
  beforeSendTransaction: (event: RedactionEvent) => RedactionEvent
  beforeSendSpan: <TSpan extends { data: Record<string, unknown> }>(
    span: TSpan
  ) => TSpan
}

function getInitOptions() {
  const options = sentryProviderMocks.init.mock.calls.at(-1)?.[0]
  expect(options).toBeDefined()
  return options as unknown as Record<string, unknown> & SentryInitHooks
}

describe("useSentryTrace", () => {
  beforeEach(() => {
    sentryProviderMocks.routerIntegration.mockReturnValue(
      sentryProviderMocks.integration
    )
  })

  it("warns and does not initialize when the DSN is missing", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)

    useSentryTrace({} as never, undefined)

    expect(warn).toHaveBeenCalledWith(
      "VITE_SENTRY_DSN is not defined. Sentry is not running."
    )
    expect(Sentry.init).not.toHaveBeenCalled()
    warn.mockRestore()
  })

  it("initializes Sentry with router tracing and safe defaults", () => {
    const router = {} as never

    useSentryTrace(router, "https://public@example.ingest.sentry.io/1")

    expect(tanstackRouterBrowserTracingIntegration).toHaveBeenCalledWith(router)
    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: "https://public@example.ingest.sentry.io/1",
        integrations: [sentryProviderMocks.integration],
        tracesSampleRate: DEFAULT_SENTRY_TRACES_SAMPLE_RATE,
        sendDefaultPii: true
      })
    )
  })

  it("redacts request URLs, query strings, headers, cookies, and IP addresses", () => {
    useSentryTrace({} as never, "dsn")
    const { beforeSend } = getInitOptions()
    const event: RedactionEvent = {
      request: {
        cookies: { session: "secret" },
        headers: {
          Authorization: "Bearer secret",
          COOKIE: "session=secret",
          Accept: "application/json"
        },
        query_string: "token=secret&page=2",
        url: "https://example.com/orders?code=private&view=summary#details"
      },
      user: {
        id: "user-1",
        ip_address: "192.0.2.1"
      }
    }

    const redacted = beforeSend(event)

    expect(redacted.request?.cookies).toBeUndefined()
    expect(redacted.request?.headers).toEqual({ Accept: "application/json" })
    expect(
      new URLSearchParams(redacted.request?.query_string as string).get("token")
    ).toBe(DEFAULT_SENTRY_FILTERED_VALUE)
    expect(
      new URLSearchParams(redacted.request?.query_string as string).get("page")
    ).toBe("2")
    const redactedUrl = new URL(redacted.request?.url ?? "")
    expect(redactedUrl.searchParams.get("code")).toBe(DEFAULT_SENTRY_FILTERED_VALUE)
    expect(redactedUrl.searchParams.get("view")).toBe("summary")
    expect(redactedUrl.hash).toBe("#details")
    expect(redacted.user).toEqual({ id: "user-1", ip_address: undefined })
  })

  it("redacts sensitive parameters from a request query string", () => {
    useSentryTrace({} as never, "dsn")
    const { beforeSend } = getInitOptions()

    const redacted = beforeSend({
      request: {
        query_string:
          "code=one-time-code&access_token=private-access-token&page=details"
      }
    })
    const output = redacted.request?.query_string as string
    const outputParams = new URLSearchParams(output)

    expect(outputParams.get("code")).toBe(DEFAULT_SENTRY_FILTERED_VALUE)
    expect(outputParams.get("access_token")).toBe(DEFAULT_SENTRY_FILTERED_VALUE)
    expect(outputParams.get("page")).toBe("details")
    expect(output).not.toContain("one-time-code")
    expect(output).not.toContain("private-access-token")

    const emptyQueryOutput = beforeSend({
      request: { query_string: "" }
    }).request?.query_string
    expect(emptyQueryOutput).toBe("")
  })

  it("redacts tuple and object query strings with custom settings", () => {
    useSentryTrace(
      {} as never,
      "dsn",
      0.5,
      false,
      ["x-secret"],
      ["private"],
      "<redacted>"
    )
    const { beforeSend, beforeSendTransaction } = getInitOptions()

    const tupleEvent = beforeSend({
      request: {
        query_string: [
          ["private", "secret"],
          ["page", "2"]
        ],
        headers: {
          "X-Secret": "hidden",
          Accept: "text/html"
        },
        url: "/checkout?private=secret#complete"
      }
    })
    const objectEvent = beforeSendTransaction({
      request: {
        query_string: {
          private: "secret",
          tags: ["one", "two"]
        }
      }
    })

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        tracesSampleRate: 0.5,
        sendDefaultPii: false
      })
    )
    expect(tupleEvent.request?.query_string).toEqual([
      ["private", "<redacted>"],
      ["page", "2"]
    ])
    expect(tupleEvent.request?.headers).toEqual({ Accept: "text/html" })
    expect(tupleEvent.request?.url).toBe("/checkout?private=%3Credacted%3E#complete")
    expect(objectEvent.request?.query_string).toEqual({
      private: "<redacted>",
      tags: ["one", "two"]
    })
  })

  it("redacts span query and URL data while preserving other values", () => {
    useSentryTrace({} as never, "dsn")
    const { beforeSendSpan } = getInitOptions()
    const span = {
      data: {
        "http.query": "access_token=secret&page=3",
        "request.url": "/callback?confirmation=private",
        label: "unchanged",
        attempts: 2
      }
    }

    const redacted = beforeSendSpan(span)

    expect(
      new URLSearchParams(redacted.data["http.query"] as string).get("access_token")
    ).toBe(DEFAULT_SENTRY_FILTERED_VALUE)
    expect(redacted.data["request.url"]).toBe("/callback?confirmation=%5BFiltered%5D")
    expect(redacted.data.label).toBe("unchanged")
    expect(redacted.data.attempts).toBe(2)
  })

  it("preserves malformed URLs and events without request details", () => {
    useSentryTrace({} as never, "dsn")
    const { beforeSend, beforeSendTransaction } = getInitOptions()

    expect(beforeSend({ request: { url: "http://[" } }).request?.url).toBe("http://[")
    expect(beforeSendTransaction({})).toEqual({})
  })

  it("exports the documented sensitive defaults", () => {
    expect(DEFAULT_SENTRY_SENSITIVE_HEADERS).toEqual([
      "authorization",
      "cookie",
      "set-cookie",
      "x-api-key"
    ])
    expect(DEFAULT_SENTRY_SENSITIVE_QUERY_PARAMS).toContain("refresh_token")
  })
})
