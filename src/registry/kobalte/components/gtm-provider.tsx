import { useMutation } from "@tanstack/solid-query"
import { useLocation } from "@tanstack/solid-router"
import { createServerFn } from "@tanstack/solid-start"
import { deleteCookie, getCookies } from "@tanstack/solid-start/server"
import { createEffect } from "solid-js"
import { createStore } from "solid-js/store"

import type { ParentProps } from "solid-js"

import { useCookieConsentState } from "@/registry/kobalte/components/cookie-consent-provider"
import {
  ensureExternalScript,
  ensureInlineScript,
  removeScriptById
} from "@/registry/kobalte/lib/utils/script-tag"

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>
  }
}

interface GTMProviderProps extends ParentProps {
  isDev: boolean
  initialGtmId: string
  gtmScriptBootstrap: string
  sensitivePaths: Array<string>
}

interface GTMProviderState {
  gtmId: string
}

let hasAnalyticsConsent = false
export function setGtmAnalyticsConsent(hasConsent: boolean) {
  hasAnalyticsConsent = hasConsent
}

export const GTM_SCRIPT_LOADER = (gtmId: string) => {
  return `https://www.googletagmanager.com/gtm.js?id=${gtmId}`
}
export const GTM_SCRIPT_BOOTSTRAP = `window.dataLayer = window.dataLayer || [];window.dataLayer.push({'gtm.start': new Date().getTime(),event: 'gtm.js'});`

export function gtmEvent(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return
  if (!hasAnalyticsConsent && event !== "cookie_consent_update") return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event,
    ...data
  })
}

export default function GTMProvider(props: GTMProviderProps) {
  const location = useLocation()
  const [consent] = useCookieConsentState()
  const [state] = createStore<GTMProviderState>({
    gtmId: props.initialGtmId
  })
  const revokeConsentAction = useMutation(() => ({
    mutationKey: ["revokie-consent-gtm"],
    mutationFn: createServerFn({ method: "POST" }).handler(() => {
      const allCookies = getCookies()
      for (const cookieName in allCookies) {
        if (cookieName.startsWith("_ga")) {
          deleteCookie(cookieName)
        } else if (cookieName.startsWith("_gcl")) {
          deleteCookie(cookieName)
        } else if (cookieName.startsWith("_gid")) {
          deleteCookie(cookieName)
        }
      }
      return { data: true, meta: {} }
    })
  }))
  createEffect(() => {
    if (props.isDev) return
    const path = location().pathname
    if (!path) return false
    if (props.sensitivePaths.includes(location().pathname)) {
      removeScriptById("gtm-bootstrap")
      removeScriptById("gtm-loader")
      window.dataLayer = []
      return
    }
    setGtmAnalyticsConsent(consent.analytics)
    if (!consent.analytics) {
      gtmEvent("cookie_consent_update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied"
      })
      revokeConsentAction.mutate(
        {},
        {
          onError: (err) => {
            console.warn("GTMProvider revokeConsentAction error", {
              reason: err
            })
          }
        }
      )
      removeScriptById("gtm-bootstrap")
      removeScriptById("gtm-loader")
      window.dataLayer = []
    } else {
      ensureInlineScript("gtm-bootstrap", props.gtmScriptBootstrap)
      ensureExternalScript(
        "gtm-loader",
        `https://www.googletagmanager.com/gtm.js?id=${state.gtmId}`
      )
      gtmEvent("cookie_consent_update", {
        analytics_storage: "granted",
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted"
      })
    }
  })
  return null
}
