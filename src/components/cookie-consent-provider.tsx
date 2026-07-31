import * as Sentry from "@sentry/solid"
import { useMutation } from "@tanstack/solid-query"
import { createIsomorphicFn, createServerFn } from "@tanstack/solid-start"
import { getCookie, setCookie } from "@tanstack/solid-start/server"
import type { JSX } from "solid-js"
import { createContext, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import * as v from "valibot"

export const CookieConsentSchema = v.object({
  accepted: v.number(), // Timestamp of when consent was given, or 0 if not accepted
  necessary: v.literal(true), // Strictly Necessary, always true: theme, auth, settings, etc.
  analytics: v.boolean(), // Analytics, optional: GA4, etc.
  marketing: v.boolean(), // Marketing / Advertising, optional: SharpSpring, etc.
  functional: v.boolean() // Functional / Preferences, optional: enhanced features, etc.
})
export type CookieConsentState = v.InferOutput<typeof CookieConsentSchema>
export type MaybeCookieConsentState = CookieConsentState | undefined

export const COOKIE_CONSENT_NAME = "gc-consent"
export const COOKIE_CONSENT_DURATION = 60 * 60 * 24 * 365 // 1 year
export const DEFAULT_COOKIE_CONSENT: CookieConsentState = {
  accepted: 0,
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false
}

// Mutations
export const saveCookieConsent = createServerFn({ method: "POST" })
  .validator(CookieConsentSchema)
  .handler(({ data }) => {
    const locale = getCookie("locale") || "en-US"
    const timeZone = decodeURIComponent(getCookie("tz") || "UTC")
    const localeDate = new Date().toLocaleString(locale, { timeZone })
    const currentLocalDate = new Date(localeDate)
    const localTimestampInMilliseconds = currentLocalDate.getTime()
    const newCookie: CookieConsentState = {
      accepted: localTimestampInMilliseconds,
      necessary: true,
      analytics: data.analytics,
      marketing: data.marketing,
      functional: data.functional
    }
    setCookie(COOKIE_CONSENT_NAME, JSON.stringify(newCookie), {
      maxAge: COOKIE_CONSENT_DURATION
    })
    return newCookie
  })

export const getCookieConsent = createIsomorphicFn()
  .server((): CookieConsentState => {
    try {
      const settings = getCookie(COOKIE_CONSENT_NAME)
      if (!settings) {
        setCookie(COOKIE_CONSENT_NAME, JSON.stringify(DEFAULT_COOKIE_CONSENT), {
          maxAge: COOKIE_CONSENT_DURATION
        })
        return DEFAULT_COOKIE_CONSENT
      }
      const parsedSettings = JSON.parse(settings) as CookieConsentState
      return parsedSettings
    } catch {
      return DEFAULT_COOKIE_CONSENT
    }
  })
  .client((): CookieConsentState => {
    try {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${COOKIE_CONSENT_NAME}=`))
      if (!cookie) return DEFAULT_COOKIE_CONSENT
      const cookieValue = cookie.split("=")[1]
      const parseCookie = JSON.parse(decodeURIComponent(cookieValue))
      const settings = v.parse(CookieConsentSchema, parseCookie)
      return settings
    } catch {
      return DEFAULT_COOKIE_CONSENT
    }
  })

// Context and Provider
export type CookieConsentStateActions = {
  consent: (data: CookieConsentState) => void
}

export type CookieConsentStateContextProvider = [
  CookieConsentState,
  CookieConsentStateActions
]

const CookieConsentStateContext = createContext<CookieConsentStateContextProvider>()

const CookieConsentProvider = (props: { children: JSX.Element }) => {
  const cookieConsentMutation = useMutation(() => ({
    mutationKey: ["save-cookie-consent"],
    mutationFn: saveCookieConsent
  }))
  const [state, setState] = createStore<CookieConsentState>(getCookieConsent())
  const actions: CookieConsentStateActions = {
    consent: (consent: CookieConsentState) => {
      cookieConsentMutation.mutate(
        { data: consent },
        {
          onSuccess: (data) => {
            setState(data)
          },
          onError: (error) => {
            Sentry.logger.warn(
              "CookieConsentProvider cookieConsentMutation error: actions.consent",
              {
                reason: error,
                data: consent
              }
            )
          }
        }
      )
    }
  }
  const store: CookieConsentStateContextProvider = [state, actions]
  return (
    <CookieConsentStateContext.Provider value={store}>
      {props.children}
    </CookieConsentStateContext.Provider>
  )
}

export default CookieConsentProvider

export function useCookieConsentState(): CookieConsentStateContextProvider {
  const ctx = useContext(CookieConsentStateContext)
  if (!ctx) throw new Error("<CookieConsentProvider> not found wrapping the <App />.")
  return ctx
}
