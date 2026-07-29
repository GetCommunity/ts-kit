import { render } from "@solidjs/testing-library"
import {
  QueryClient,
  QueryClientProvider,
  infiniteQueryOptions
} from "@tanstack/solid-query"

import type { CollectionDocument } from "@/hooks/use-infinite-query"
import type { StrapiListResponse } from "@getcommunity/gc-validators/base"
import type { JSX } from "solid-js"

export type TestDocument = CollectionDocument & {
  description?: string
  label: string
}

export type TestPage = StrapiListResponse<TestDocument>

export const alpha = createDocument(1, "alpha", "Alpha", "First option")
export const beta = createDocument(2, "beta", "Beta", "Second option")
export const gamma = createDocument(3, "gamma", "Gamma")
export const options = [alpha, beta]

export const valueMappers = {
  optionValue: "documentId" as const,
  optionTextValue: "label" as const,
  getOptionLabel: (option: TestDocument) => option.label,
  getOptionDesc: (option: TestDocument) => option.description,
  getOptionDisabled: (option: TestDocument) => option.documentId === "gamma"
}

export function createDocument(
  id: number,
  documentId: string,
  label: string,
  description?: string
): TestDocument {
  return {
    id,
    documentId,
    label,
    description,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  }
}

export function createPage(
  data: Array<TestDocument>,
  page = 1,
  pageCount = 1
): TestPage {
  return {
    data,
    meta: {
      pagination: {
        page,
        pageSize: data.length,
        pageCount,
        total: data.length
      }
    }
  }
}

export function createCollectionQueryMock(response = createPage(options)) {
  return vi.fn().mockResolvedValue(response)
}

export function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise
  })

  return { promise, resolve }
}

export function createCollectionOptions(
  testName: string,
  queryFn: ReturnType<typeof createCollectionQueryMock>,
  initialPages?: Array<TestPage>
) {
  // @ts-expect-error - query options type mismatch
  return infiniteQueryOptions({
    queryKey: ["lcrud-inputs", testName],
    queryFn,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.meta.pagination
      return pagination.page < pagination.pageCount ? pagination.page + 1 : undefined
    },
    ...(initialPages
      ? {
          initialData: {
            pages: initialPages,
            pageParams: initialPages.map(({ meta }) => meta.pagination.page)
          },
          staleTime: Infinity
        }
      : {})
  })
}

export function renderWithQuery(ui: () => JSX.Element) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: Infinity,
        retry: false
      }
    }
  })

  return {
    ...render(() => (
      <QueryClientProvider client={queryClient}>{ui()}</QueryClientProvider>
    )),
    queryClient
  }
}
