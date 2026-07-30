import { fireEvent, render, screen, waitFor } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"

import CookieConsentBanner from "@/components/cookie-consent-banner"

import type { CookieConsentState } from "@/components/cookie-consent-provider"
import type { JSX } from "solid-js"

type CapturedSwitchProps = {
  label?: string
  name: string
  checked?: boolean
  value: boolean
  error?: [string, ...Array<string>] | null
  disabled?: boolean
  onChange: (checked: boolean) => void
  onKeyPress?: (event: KeyboardEvent) => void
}

const cookieBannerMocks = vi.hoisted(() => ({
  state: {
    accepted: 0,
    necessary: true as const,
    analytics: false,
    marketing: false,
    functional: false
  },
  consent: vi.fn(),
  switchProps: [] as Array<CapturedSwitchProps>
}))

vi.mock("@/components/cookie-consent-provider", async () => {
  const v = await import("valibot")
  return {
    CookieConsentSchema: v.object({
      accepted: v.number(),
      necessary: v.literal(true),
      analytics: v.boolean(),
      marketing: v.boolean(),
      functional: v.boolean()
    }),
    useCookieConsentState: () => [
      cookieBannerMocks.state,
      { consent: cookieBannerMocks.consent }
    ]
  }
})

vi.mock("@tanstack/solid-router", () => ({
  Link: (props: { children: JSX.Element; class?: string }) => (
    <a href="/policies/gc-privacy-policy" class={props.class}>
      {props.children}
    </a>
  )
}))

vi.mock("@/registry/new-york/form-inputs/checkbox-switch-input", () => ({
  default: (props: CapturedSwitchProps) => {
    cookieBannerMocks.switchProps.push(props)
    return (
      <button
        type="button"
        role="switch"
        aria-checked={props.checked}
        data-name={props.name}
        data-value={String(props.value)}
        data-error={String(props.error)}
        disabled={props.disabled}
        onClick={() => props.onChange(!props.checked)}
        onKeyPress={(event) => props.onKeyPress?.(event)}
      >
        {props.label}
      </button>
    )
  }
}))

function resetConsentState(overrides: Partial<CookieConsentState> = {}) {
  Object.assign(cookieBannerMocks.state, {
    accepted: 0,
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
    ...overrides
  })
}

describe("CookieConsentBanner", () => {
  beforeEach(() => {
    resetConsentState()
    cookieBannerMocks.switchProps.length = 0
  })

  it("shows the banner for a first-time visitor and links to the privacy policy", () => {
    render(() => <CookieConsentBanner />)

    expect(document.getElementById("cookie-consent-settings")).toHaveClass(
      "translate-y-0"
    )
    expect(document.getElementById("cookie-consent-trigger")).toHaveClass(
      "translate-y-full"
    )
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute(
      "href",
      "/policies/gc-privacy-policy"
    )
    expect(screen.getAllByRole("switch")[0]).toBeDisabled()
  })

  it("opens saved preferences with pointer and keyboard controls", async () => {
    resetConsentState({
      accepted: 123,
      analytics: true,
      marketing: false,
      functional: true
    })
    const user = userEvent.setup()
    render(() => <CookieConsentBanner />)
    const trigger = document.getElementById("cookie-consent-trigger")

    expect(trigger).toHaveClass("translate-y-0")
    expect(document.getElementById("cookie-consent-settings")).toHaveClass(
      "translate-y-full"
    )

    await user.click(trigger as HTMLElement)
    expect(document.getElementById("cookie-consent-settings")).toHaveClass(
      "translate-y-0"
    )

    fireEvent.keyPress(trigger as HTMLElement, { key: "Space" })
    expect(document.getElementById("cookie-consent-settings")).toHaveClass(
      "translate-y-0"
    )
    fireEvent.keyPress(trigger as HTMLElement, { key: "Enter" })
    expect(document.getElementById("cookie-consent-settings")).toHaveClass(
      "translate-y-full"
    )
  })

  it("denies every optional cookie and closes the banner", async () => {
    const user = userEvent.setup()
    render(() => <CookieConsentBanner />)

    await user.click(screen.getByRole("button", { name: "Deny" }))

    await waitFor(() =>
      expect(cookieBannerMocks.consent).toHaveBeenCalledWith({
        accepted: 0,
        necessary: true,
        analytics: false,
        marketing: false,
        functional: false
      })
    )
    expect(document.getElementById("cookie-consent-settings")).toHaveClass(
      "translate-y-full"
    )
  })

  it("accepts the initially enabled optional cookies", async () => {
    const user = userEvent.setup()
    render(() => <CookieConsentBanner />)

    await user.click(screen.getByRole("button", { name: /^Accept$/ }))

    await waitFor(() =>
      expect(cookieBannerMocks.consent).toHaveBeenCalledWith({
        accepted: 0,
        necessary: true,
        analytics: true,
        marketing: true,
        functional: true
      })
    )
  })

  it("submits a customized preference", async () => {
    const user = userEvent.setup()
    render(() => <CookieConsentBanner />)
    const switches = screen.getAllByRole("switch")

    await user.click(switches[2] as HTMLElement)
    await user.click(screen.getByRole("button", { name: /^Accept$/ }))

    await waitFor(() =>
      expect(cookieBannerMocks.consent).toHaveBeenCalledWith(
        expect.objectContaining({
          analytics: true,
          marketing: false,
          functional: true
        })
      )
    )
  })

  it("handles switch callbacks and ignores unrelated keyboard input", async () => {
    const user = userEvent.setup()
    render(() => <CookieConsentBanner />)
    const byLabel = (label: string) => {
      const props = cookieBannerMocks.switchProps.find(
        (candidate) => candidate.label === label
      )
      expect(props).toBeDefined()
      return props as CapturedSwitchProps
    }
    const necessary = byLabel("Necessary")
    const analytics = byLabel("Analytics")
    const marketing = byLabel("Marketing")
    const functional = byLabel("Functional")
    const enter = new KeyboardEvent("keypress", {
      key: "Enter",
      cancelable: true
    })
    const otherKey = new KeyboardEvent("keypress", {
      key: "Space",
      cancelable: true
    })
    const preventDefault = vi.spyOn(enter, "preventDefault")

    necessary.onChange(false)
    necessary.onKeyPress?.(otherKey)
    necessary.onKeyPress?.(enter)
    analytics.onChange(undefined as unknown as boolean)
    expect(analytics.checked).toBe(true)
    analytics.onChange(true)
    analytics.onKeyPress?.(otherKey)
    analytics.onKeyPress?.(enter)
    marketing.onChange(undefined as unknown as boolean)
    expect(marketing.checked).toBe(true)
    marketing.onChange(true)
    marketing.onKeyPress?.(otherKey)
    marketing.onKeyPress?.(enter)
    functional.onChange(undefined as unknown as boolean)
    expect(functional.checked).toBe(true)
    functional.onChange(true)
    functional.onKeyPress?.(otherKey)
    functional.onKeyPress?.(enter)

    expect(preventDefault).toHaveBeenCalledTimes(4)
    await user.click(screen.getByRole("button", { name: /^Accept$/ }))
    await waitFor(() =>
      expect(cookieBannerMocks.consent).toHaveBeenCalledWith({
        accepted: 0,
        necessary: true,
        analytics: false,
        marketing: false,
        functional: false
      })
    )
  })

  it("accepts all optional cookies from previously denied preferences", async () => {
    resetConsentState({ accepted: 123 })
    const user = userEvent.setup()
    render(() => <CookieConsentBanner />)

    await user.click(screen.getByRole("button", { name: "Accept All" }))

    await waitFor(() =>
      expect(cookieBannerMocks.consent).toHaveBeenCalledWith({
        accepted: 0,
        necessary: true,
        analytics: true,
        marketing: true,
        functional: true
      })
    )
  })
})
