import type { SubmitHandler } from "@formisch/solid"
import { createForm, Field, Form, setInput, submit } from "@formisch/solid"
import { Link } from "@tanstack/solid-router"
import { batch, createSignal } from "solid-js"

import {
  CookieConsentSchema,
  useCookieConsentState
} from "@/components/cookie-consent-provider"
import { cn } from "@/lib/utils/tailwind"
import CheckboxSwitchInput from "@/registry/new-york/form-inputs/checkbox-switch-input"
import HiddenInput from "@/registry/new-york/form-inputs/hidden-input"
import Cookie from "@/registry/new-york/icons/svg/cookie"
import { Button } from "@/registry/new-york/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/new-york/ui/tooltip"

export default function CookieConsentBanner() {
  const [consent, actions] = useCookieConsentState()
  const [showBanner, setShowBanner] = createSignal(consent.accepted === 0)
  const formStore = createForm({
    schema: CookieConsentSchema,
    initialInput: {
      accepted: 0,
      necessary: true,
      analytics: consent.accepted > 0 ? consent.analytics : true,
      marketing: consent.accepted > 0 ? consent.marketing : true,
      functional: consent.accepted > 0 ? consent.functional : true
    },
    validate: "submit",
    revalidate: "input"
  })
  const handleSubmit: SubmitHandler<typeof CookieConsentSchema> = (values) => {
    actions.consent(values)
    setShowBanner(false)
  }
  const updateCookies = (mode: "all" | "none") => {
    if (mode === "all") {
      batch(() => {
        setInput(formStore, { path: ["analytics"], input: true })
        setInput(formStore, { path: ["marketing"], input: true })
        setInput(formStore, { path: ["functional"], input: true })
      })
    } else {
      batch(() => {
        setInput(formStore, { path: ["analytics"], input: false })
        setInput(formStore, { path: ["marketing"], input: false })
        setInput(formStore, { path: ["functional"], input: false })
      })
    }
    submit(formStore)
  }
  const inputClass = "col-span-1 text-center border border-foreground/25 py-2"
  const switchClass = "justify-center items-center"
  return (
    <>
      <Tooltip openDelay={50} placement="right">
        <TooltipTrigger
          id="cookie-consent-trigger"
          tabIndex={!showBanner() ? 1 : undefined}
          as="a"
          class={cn(
            "z-999999 block fixed transition-transform duration-300 cursor-pointer",
            "bottom-4 left-4 size-14 p-2 lg:size-12 lg:bottom-4 lg:left-4",
            "shadow-2xl backdrop-blur-sm border rounded-full bg-white/80 dark:bg-black/80 dark:border-gray-700 dark:text-white",
            !showBanner() ? "translate-y-0" : "translate-y-full"
          )}
          onClick={() => setShowBanner((prev) => !prev)}
          onKeyPress={(e) => {
            if (e.key == "Enter") {
              e.preventDefault()
              setShowBanner((prev) => !prev)
            }
          }}
        >
          <Cookie class="size-full" />
        </TooltipTrigger>
        <TooltipContent>Edit Cookie Preferences</TooltipContent>
      </Tooltip>
      <div
        id="cookie-consent-settings"
        class={cn(
          "z-999999 block fixed bottom-0 left-0 w-full transition-transform duration-300",
          "pt-2 px-3 pb-10 sm:px-2 lg:pb-4",
          "shadow-2xl backdrop-blur-sm bg-white/80 border-t dark:bg-black/80 dark:border-gray-700 dark:text-white",
          showBanner() ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div class={cn("flex flex-col items-center justify-between px-2")}>
          <div class="my-2 prose dark:prose-invert">
            <p class="text-xs">
              <span class="font-bold">We use cookies</span> to personalize your
              experience, provide social media features, and analyze our traffic. We
              also share information about your use of our site with our social media,
              advertising and analytics partners. To learn more about the data we
              collect and how it is used, please visit our{" "}
              <Link
                to={"/policies/$slug"}
                params={{
                  slug: "gc-privacy-policy"
                }}
                reloadDocument={true}
                class="cursor-pointer underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
          <Form
            of={formStore}
            onSubmit={handleSubmit}
            class={cn(
              "grid grid-cols-2 xs:grid-cols-4 gap-0 w-full max-w-2xl mt-1 mx-auto"
            )}
          >
            <Field of={formStore} path={["accepted"]}>
              {(field) => (
                <HiddenInput
                  {...field.props}
                  value={field.input}
                  error={field.errors}
                />
              )}
            </Field>
            <Field of={formStore} path={["necessary"]}>
              {(field) => (
                <CheckboxSwitchInput<boolean>
                  {...field.props}
                  label="Necessary"
                  orientation="vertical"
                  name={field.props.name}
                  checked={true}
                  value={true}
                  error={field.errors}
                  onChange={() => field.onInput(true)}
                  onKeyPress={(e) => {
                    if (e.key == "Enter") {
                      e.preventDefault()
                      field.onInput(true)
                    }
                  }}
                  disabled={true}
                  class={inputClass}
                  switchClass={switchClass}
                />
              )}
            </Field>
            <Field of={formStore} path={["analytics"]}>
              {(field) => (
                <CheckboxSwitchInput<boolean>
                  {...field.props}
                  label="Analytics"
                  orientation="vertical"
                  name={field.props.name}
                  checked={field.input ?? true}
                  value={field.input ?? true}
                  error={field.errors}
                  onChange={(v) => field.onInput(v)}
                  onKeyPress={(e) => {
                    if (e.key == "Enter") {
                      e.preventDefault()
                      field.onInput(!field.input)
                    }
                  }}
                  class={inputClass}
                  switchClass={switchClass}
                />
              )}
            </Field>
            <Field of={formStore} path={["marketing"]}>
              {(field) => (
                <CheckboxSwitchInput<boolean>
                  {...field.props}
                  label="Marketing"
                  orientation="vertical"
                  name={field.props.name}
                  checked={field.input ?? true}
                  value={field.input ?? true}
                  error={field.errors}
                  onChange={(v) => field.onInput(v)}
                  onKeyPress={(e) => {
                    if (e.key == "Enter") {
                      e.preventDefault()
                      field.onInput(!field.input)
                    }
                  }}
                  class={inputClass}
                  switchClass={switchClass}
                />
              )}
            </Field>
            <Field of={formStore} path={["functional"]}>
              {(field) => (
                <CheckboxSwitchInput<boolean>
                  {...field.props}
                  label="Functional"
                  orientation="vertical"
                  name={field.props.name}
                  checked={field.input ?? true}
                  value={field.input ?? true}
                  error={field.errors}
                  onChange={(v) => field.onInput(v)}
                  onKeyPress={(e) => {
                    if (e.key == "Enter") {
                      e.preventDefault()
                      field.onInput(!field.input)
                    }
                  }}
                  class={inputClass}
                  switchClass={switchClass}
                />
              )}
            </Field>
          </Form>
          <div
            class={cn(
              "grid grid-col-1 xs:grid-cols-3 gap-2 w-full max-w-2xl mt-2 mx-auto"
            )}
          >
            <Button
              variant="outline"
              class={cn("col-span-1")}
              onClick={() => updateCookies("none")}
            >
              Deny
            </Button>
            <Button
              variant="secondary"
              disabled={formStore.isSubmitting || !formStore.isValid}
              onClick={() => submit(formStore)}
              class={cn("col-span-1")}
            >
              Accept
            </Button>
            <Button
              variant="default"
              disabled={formStore.isSubmitting || !formStore.isValid}
              onClick={() => updateCookies("all")}
              class={cn("col-span-1")}
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
