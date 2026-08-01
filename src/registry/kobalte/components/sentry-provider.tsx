import * as Sentry from "@sentry/solid"
import { tanstackRouterBrowserTracingIntegration } from "@sentry/solid/tanstackrouter"

import type { AnyRouter } from "@tanstack/solid-router"

export const DEFAULT_SENTRY_SENSITIVE_HEADERS = [
  "authorization",
  "cookie",
  "set-cookie",
  "x-api-key"
]
export const DEFAULT_SENTRY_SENSITIVE_QUERY_PARAMS = [
  "code",
  "confirmation",
  "jwt",
  "token",
  "access_token",
  "refresh_token"
]
export const DEFAULT_SENTRY_TRACES_SAMPLE_RATE = 0.1
export const DEFAULT_SENTRY_FILTERED_VALUE = "[Filtered]"

function redactUrl(
  value: string,
  sensitiveQueryParams: Array<string>,
  filteredValue: string
) {
  try {
    const hasProtocol = /^[a-z][a-z\d+.-]*:/i.test(value)
    const url = new URL(value, "https://redacted.invalid")
    for (const key of sensitiveQueryParams) {
      if (url.searchParams.has(key)) {
        url.searchParams.set(key, filteredValue)
      }
    }
    if (hasProtocol) {
      return url.toString()
    }
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return value
  }
}

function redactQueryString(
  value: NonNullable<Sentry.ErrorEvent["request"]>["query_string"],
  sensitiveQueryParams: Array<string>,
  filteredValue: string
) {
  if (typeof value === "string") {
    return new URLSearchParams(
      redactUrl(`/?${value}`, sensitiveQueryParams, filteredValue).split("?")[1] ?? ""
    ).toString()
  }
  if (Array.isArray(value)) {
    return value.map(
      ([key, queryValue]) =>
        [
          key,
          sensitiveQueryParams.includes(key) ? filteredValue : queryValue
        ] satisfies [string, string]
    )
  }
  if (value !== undefined) {
    return Object.fromEntries(
      Object.entries(value).map(([key, queryValue]) => [
        key,
        sensitiveQueryParams.includes(key) ? filteredValue : queryValue
      ])
    )
  }
  return value
}

function redactHeaders(
  headers: NonNullable<NonNullable<Sentry.ErrorEvent["request"]>["headers"]>,
  sensitiveHeaders: Array<string>
) {
  return Object.fromEntries(
    Object.entries(headers).filter(
      ([key]) => !sensitiveHeaders.includes(key.toLowerCase())
    )
  )
}

function redactRequest<TEvent extends Pick<Sentry.Event, "request" | "user">>(
  event: TEvent,
  sensitiveHeaders: Array<string>,
  sensitiveQueryParams: Array<string>,
  filteredValue: string
): TEvent {
  if (event.request) {
    event.request = {
      ...event.request,
      cookies: undefined,
      headers: event.request.headers
        ? redactHeaders(event.request.headers, sensitiveHeaders)
        : undefined,
      query_string: redactQueryString(
        event.request.query_string,
        sensitiveQueryParams,
        filteredValue
      ),
      url: event.request.url
        ? redactUrl(event.request.url, sensitiveQueryParams, filteredValue)
        : undefined
    }
  }
  if (event.user) {
    event.user = {
      ...event.user,
      ip_address: undefined
    }
  }
  return event
}

function redactSpan<TSpan extends { data: Record<string, unknown> }>(
  span: TSpan,
  sensitiveQueryParams: Array<string>,
  filteredValue: string
): TSpan {
  span.data = Object.fromEntries(
    Object.entries(span.data).map(([key, value]) => {
      if (typeof value !== "string") {
        return [key, value]
      }
      if (key === "http.query") {
        return [key, redactQueryString(value, sensitiveQueryParams, filteredValue)]
      }
      if (key.toLowerCase().includes("url")) {
        return [key, redactUrl(value, sensitiveQueryParams, filteredValue)]
      }
      return [key, value]
    })
  )
  return span
}

export function useSentryTrace<TRouter extends AnyRouter>(
  router: TRouter,
  sentryDsn: string | undefined,
  tracesSampleRate: number = DEFAULT_SENTRY_TRACES_SAMPLE_RATE,
  sendDefaultPii: boolean = true,
  sensitiveHeaders: Array<string> = DEFAULT_SENTRY_SENSITIVE_HEADERS,
  sensitiveQueryParams: Array<string> = DEFAULT_SENTRY_SENSITIVE_QUERY_PARAMS,
  filteredValue: string = DEFAULT_SENTRY_FILTERED_VALUE
) {
  if (!sentryDsn) {
    console.warn("VITE_SENTRY_DSN is not defined. Sentry is not running.")
  } else {
    Sentry.init({
      dsn: sentryDsn,
      integrations: [tanstackRouterBrowserTracingIntegration(router)],
      tracesSampleRate: tracesSampleRate,
      sendDefaultPii: sendDefaultPii,
      beforeSend: (event) =>
        redactRequest(event, sensitiveHeaders, sensitiveQueryParams, filteredValue),
      beforeSendTransaction: (event) =>
        redactRequest(event, sensitiveHeaders, sensitiveQueryParams, filteredValue),
      beforeSendSpan: (span) => redactSpan(span, sensitiveQueryParams, filteredValue)
    })
  }
}
