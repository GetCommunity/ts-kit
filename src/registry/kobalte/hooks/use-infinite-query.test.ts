import { renderHook, waitFor } from "@solidjs/testing-library"
import {
  QueryClient,
  QueryClientProvider,
  infiniteQueryOptions
} from "@tanstack/solid-query"
import { createComponent } from "solid-js"

import { useInfiniteCollection } from "@/registry/kobalte/hooks/use-infinite-query"

import type { CollectionDocument } from "@/registry/kobalte/hooks/use-infinite-query"
import type { StrapiListResponse } from "@getcommunity/gc-validators/base"
import type { Component, JSX } from "solid-js"

type TestDocument = CollectionDocument & {
  label: string
}

type TestPage = StrapiListResponse<TestDocument>

function createDocument(id: number, documentId: string, label: string): TestDocument {
  return {
    id,
    documentId,
    label,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  }
}

function createPage(
  page: number,
  pageCount: number,
  data: Array<TestDocument>
): TestPage {
  return {
    data,
    meta: {
      pagination: {
        page,
        pageSize: 2,
        pageCount,
        total: 4
      }
    }
  }
}

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise
  })

  return { promise, resolve }
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: Infinity,
        retry: false
      }
    }
  })
}

function createQueryWrapper(
  queryClient: QueryClient
): Component<{ children: JSX.Element }> {
  return (props) =>
    createComponent(QueryClientProvider, {
      client: queryClient,
      get children() {
        return props.children
      }
    })
}

function createCollectionOptions(queryFn: (page: number) => Promise<TestPage>) {
  return infiniteQueryOptions({
    queryKey: ["test-infinite-collection"],
    queryFn: ({ pageParam }) => queryFn(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.meta.pagination
      return pagination.page < pagination.pageCount ? pagination.page + 1 : undefined
    }
  })
}

describe("useInfiniteCollection", () => {
  it("reactively exposes initial loading and the first collection page", async () => {
    const firstPage = createDeferred<TestPage>()
    const queryClient = createQueryClient()
    const queryOptions = createCollectionOptions(() => firstPage.promise)
    // @ts-expect-error - query options type mismatch
    const { result } = renderHook(() => useInfiniteCollection(queryOptions), {
      wrapper: createQueryWrapper(queryClient)
    })

    expect(result.options()).toEqual([])
    expect(result.hasMore()).toBe(false)
    expect(result.isLoading()).toBe(true)
    expect(result.loadingMoreMessage()).toBe("Loading...")

    firstPage.resolve(createPage(1, 2, [createDocument(1, "alpha", "Alpha")]))

    await waitFor(() => expect(result.query.isSuccess).toBe(true))
    expect(result.options().map(({ label }) => label)).toEqual(["Alpha"])
    expect(result.hasMore()).toBe(true)
    expect(result.isLoading()).toBe(false)
    expect(result.loadingMoreMessage()).toBe("Load More")
  })

  it("loads another page and keeps the first document for duplicate ids", async () => {
    const nextPage = createDeferred<TestPage>()
    const queryClient = createQueryClient()
    const queryOptions = createCollectionOptions((page) => {
      if (page === 1) {
        return Promise.resolve(
          createPage(1, 2, [
            createDocument(1, "alpha", "Alpha"),
            createDocument(2, "shared", "Original")
          ])
        )
      }
      return nextPage.promise
    })
    // @ts-expect-error - query options type mismatch
    const { result } = renderHook(() => useInfiniteCollection(queryOptions), {
      wrapper: createQueryWrapper(queryClient)
    })

    await waitFor(() => expect(result.query.isSuccess).toBe(true))
    expect(result.options().map(({ label }) => label)).toEqual(["Alpha", "Original"])

    const fetchNextPage = result.fetchNext()
    await waitFor(() => expect(result.loadingMoreMessage()).toBe("Loading more..."))
    expect(result.isLoading()).toBe(true)

    nextPage.resolve(
      createPage(2, 2, [
        createDocument(3, "shared", "Duplicate"),
        createDocument(4, "beta", "Beta")
      ])
    )
    await fetchNextPage

    await waitFor(() =>
      expect(result.options().map(({ label }) => label)).toEqual([
        "Alpha",
        "Original",
        "Beta"
      ])
    )
    expect(result.hasMore()).toBe(false)
    expect(result.isLoading()).toBe(false)
    expect(result.loadingMoreMessage()).toBe("Nothing more to load")
  })
})
