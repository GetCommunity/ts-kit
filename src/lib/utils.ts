import type { TocEntry } from "@/lib/types"
import { cookieStorage } from "@solid-primitives/storage"
import { createIsomorphicFn } from "@tanstack/solid-start"
import { getRequestHeaders, getResponseHeaders } from "@tanstack/solid-start/server"

/**
 * Flattens nested TOC entries into a list of URL fragments for scroll spy
 */
export const flattenTocUrls = (entries: TocEntry): string[] => {
  const urls: string[] = []
  for (const entry of entries) {
    urls.push(entry.url)
    if (entry.items.length > 0) {
      urls.push(...flattenTocUrls(entry.items))
    }
  }
  return urls
}

/**
 * Returns TanStack SSR safe cookie storage provider
 * @solid-primitives/storage
 */
export const getStorage = createIsomorphicFn()
  .server(() =>
    cookieStorage.withOptions({
      expires: new Date(Date.now() + 3e10),
      getRequestHeaders: () => getRequestHeaders(),
      getResponseHeaders: () => getResponseHeaders()
    })
  )
  .client(() =>
    cookieStorage.withOptions({
      expires: new Date(Date.now() + 3e10)
    })
  )
