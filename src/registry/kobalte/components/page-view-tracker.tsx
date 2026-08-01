import { useLocation } from "@tanstack/solid-router"
import { createEffect } from "solid-js"

import { useCookieConsentState } from "@/registry/kobalte/components/cookie-consent-provider"

export const DEFAULT_PAGE_VIEW_SENSITIVE_QUERY_PARAMS = [
  "code",
  "confirmation",
  "jwt",
  "token",
  "access_token",
  "refresh_token"
]

export function sanitizePageSearch(
  search: string,
  sensitiveQueryParams: Array<string> = DEFAULT_PAGE_VIEW_SENSITIVE_QUERY_PARAMS
) {
  const sensitiveSearchParams = new Set(sensitiveQueryParams)
  if (search === "") return ""
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search)
  sensitiveSearchParams.forEach((param) => {
    params.delete(param)
  })
  const sanitizedSearch = params.toString()
  return sanitizedSearch === "" ? "" : `?${sanitizedSearch}`
}

interface PageViewTrackerProps {
  isDev: boolean
  sensitivePaths: Array<string>
  sensitiveQueryParams: Array<string>
  analyticsPageViewEvent: () => void
  marketingPageViewEvent: () => void
}

export default function PageViewTracker(props: PageViewTrackerProps) {
  const location = useLocation()
  const [consent] = useCookieConsentState()
  createEffect(() => {
    if (props.isDev) return
    const path = location().pathname
    if (!path) return false
    if (props.sensitivePaths.includes(path)) return
    // Analytics
    if (!consent.analytics) return
    props.analyticsPageViewEvent()
    // Marketing
    if (!consent.marketing) return
    props.marketingPageViewEvent()
  })

  return null
}
