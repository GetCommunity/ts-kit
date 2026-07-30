import { withSentryErrorBoundary } from "@sentry/solid"
import { ErrorBoundary } from "solid-js"

export const SentryErrorBoundary = withSentryErrorBoundary(ErrorBoundary)
