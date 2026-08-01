import { useInfiniteQuery } from "@tanstack/solid-query"
import { createMemo } from "solid-js"

import type { BaseDocument, StrapiListResponse } from "@getcommunity/gc-validators/base"
import type { infiniteQueryOptions } from "@tanstack/solid-query"

export interface CollectionDocument extends BaseDocument, Record<string, unknown> {}

export type PageItem<TPage extends StrapiListResponse<CollectionDocument>> =
  TPage["data"][number]

export function useInfiniteCollection<
  TPage extends StrapiListResponse<CollectionDocument>
>(queryOptions: ReturnType<typeof infiniteQueryOptions<TPage>>) {
  const query = useInfiniteQuery<TPage>(() => queryOptions)
  const pages = createMemo(() => query.data?.pages ?? [])

  const options = createMemo<Array<PageItem<TPage>>>(() => {
    const flat = pages().flatMap((p) => p.data)
    const map = new Map<string | number, PageItem<TPage>>()

    for (const item of flat) {
      const key = item.documentId
      if (!map.has(key)) {
        map.set(key, item)
      }
    }

    return Array.from(map.values())
  })

  const hasMore = createMemo(() => query.hasNextPage)
  const isLoading = createMemo(
    () => query.isPending || query.isFetching || query.isLoading
  )

  const fetchNext = () => query.fetchNextPage()
  const loadingMoreMessage = createMemo<string>(() => {
    const page = query.data?.pages.at(-1)
    const pageMeta = page?.meta.pagination
    if (!pageMeta) return "Loading..."
    if (query.isFetching) return "Loading more..."
    return hasMore() ? "Load More" : "Nothing more to load"
  })

  return {
    query,
    options,
    hasMore,
    isLoading,
    fetchNext,
    loadingMoreMessage
  } as const
}
