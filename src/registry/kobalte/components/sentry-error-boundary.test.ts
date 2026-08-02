import { withSentryErrorBoundary } from "@sentry/solid"
import { ErrorBoundary } from "solid-js"

const sentryBoundaryMocks = vi.hoisted(() => {
  const wrappedBoundary = () => null
  return {
    wrappedBoundary,
    withSentryErrorBoundary: vi.fn(() => wrappedBoundary)
  }
})

vi.mock("@sentry/solid", () => ({
  withSentryErrorBoundary: sentryBoundaryMocks.withSentryErrorBoundary
}))

import { SentryErrorBoundary } from "@/registry/kobalte/components/sentry-error-boundary"

describe("SentryErrorBoundary", () => {
  it("wraps Solid's ErrorBoundary with Sentry instrumentation", () => {
    expect(withSentryErrorBoundary).toHaveBeenCalledOnce()
    expect(withSentryErrorBoundary).toHaveBeenCalledWith(ErrorBoundary)
    expect(SentryErrorBoundary).toBe(sentryBoundaryMocks.wrappedBoundary)
  })
})
