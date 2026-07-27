const clientMocks = vi.hoisted(() => ({
  mount: vi.fn((renderApp: () => unknown) => renderApp()),
  startClient: vi.fn(() => null)
}))

vi.mock("@solidjs/start/client", () => ({
  mount: clientMocks.mount,
  StartClient: clientMocks.startClient
}))

describe("client entry", () => {
  beforeEach(() => {
    vi.resetModules()
    clientMocks.mount.mockClear()
    clientMocks.startClient.mockClear()
    document.body.innerHTML = ""
  })

  it("mounts the Start client when the application root exists", async () => {
    document.body.innerHTML = '<div id="app"></div>'

    await import("@/entry-client")

    expect(clientMocks.mount).toHaveBeenCalledWith(
      expect.any(Function),
      document.getElementById("app")
    )
    expect(clientMocks.startClient).toHaveBeenCalledOnce()
  })

  it("does not mount when the application root is absent", async () => {
    await import("@/entry-client")

    expect(clientMocks.mount).not.toHaveBeenCalled()
  })
})
