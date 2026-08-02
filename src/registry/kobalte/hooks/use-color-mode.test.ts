const runtime = vi.hoisted(() => ({
  target: "server" as "client" | "server"
}))
const getCookie = vi.hoisted(() => vi.fn<(name: string) => string | undefined>())

vi.mock("@tanstack/solid-start", () => ({
  createIsomorphicFn: () => {
    type RuntimeFn = (() => unknown) & {
      client: (implementation: () => unknown) => RuntimeFn
      server: (implementation: () => unknown) => RuntimeFn
    }

    let clientImplementation = () => undefined as unknown
    let serverImplementation = () => undefined as unknown
    const runtimeFn: RuntimeFn = Object.assign(
      () =>
        runtime.target === "server" ? serverImplementation() : clientImplementation(),
      {
        client: (implementation: () => unknown) => {
          clientImplementation = implementation
          return runtimeFn
        },
        server: (implementation: () => unknown) => {
          serverImplementation = implementation
          return runtimeFn
        }
      }
    )

    return runtimeFn
  }
}))

vi.mock("@tanstack/solid-start/server", () => ({ getCookie }))

const colorModeKey = "gc-color-mode"

function setDocumentColorMode(value?: string) {
  document.cookie = `${colorModeKey}=; max-age=0; path=/`
  if (value !== undefined) {
    document.cookie = `${colorModeKey}=${value}; path=/`
  }
}

async function loadColorMode(target: "client" | "server", value?: string) {
  vi.resetModules()
  runtime.target = target
  getCookie.mockReturnValue(value)
  setDocumentColorMode(target === "client" ? value : undefined)

  return import("@/registry/kobalte/hooks/use-color-mode")
}

describe("colorModeStorageManager", () => {
  it.each(["server", "client"] as const)(
    "restores a valid %s color-mode cookie",
    async (target) => {
      const { colorModeKey: exportedKey, colorModeStorageManager } =
        await loadColorMode(target, "dark")

      expect(exportedKey).toBe(colorModeKey)
      expect(colorModeStorageManager.get("light")).toBe("dark")
    }
  )

  it.each(["server", "client"] as const)(
    "defaults a missing %s color-mode cookie to light",
    async (target) => {
      const { colorModeStorageManager } = await loadColorMode(target)

      expect(colorModeStorageManager.get("dark")).toBe("light")
    }
  )

  it.each(["server", "client"] as const)(
    "defaults an invalid %s color-mode cookie to light",
    async (target) => {
      const { colorModeStorageManager } = await loadColorMode(target, "sepia")

      expect(colorModeStorageManager.get("dark")).toBe("light")
    }
  )
})
