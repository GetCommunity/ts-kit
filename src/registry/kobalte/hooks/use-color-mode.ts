import { createCookieStorageManager } from "@kobalte/core"
import { createIsomorphicFn } from "@tanstack/solid-start"
import { getCookie } from "@tanstack/solid-start/server"
import * as v from "valibot"

import type { ConfigColorMode } from "@kobalte/core"

export const colorModeKey = "gc-color-mode"
const colorModeSchema = v.picklist(["light", "dark"])
type ColorModeCookie = `${typeof colorModeKey}=${ConfigColorMode}`

const getStoredThemeMode = createIsomorphicFn()
  .server((): ColorModeCookie => {
    try {
      const cookie = getCookie(colorModeKey)
      if (!cookie) return `${colorModeKey}=light`
      const mode = v.parse(colorModeSchema, cookie)
      return `${colorModeKey}=${mode}`
    } catch {
      return `${colorModeKey}=light`
    }
  })
  .client((): ColorModeCookie => {
    try {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${colorModeKey}=`)) as
        ColorModeCookie | undefined
      if (!cookie) return `${colorModeKey}=light`
      const mode = v.parse(colorModeSchema, cookie.split("=")[1])
      return `${colorModeKey}=${mode}`
    } catch {
      return `${colorModeKey}=light`
    }
  })

export const colorModeStorageManager = createCookieStorageManager(
  colorModeKey,
  getStoredThemeMode()
)
