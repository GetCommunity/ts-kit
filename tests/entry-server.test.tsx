const serverMocks = vi.hoisted(() => ({
  createHandler: vi.fn((renderApp: () => unknown) => renderApp()),
  startServer: vi.fn(
    (props: {
      document: (props: {
        assets: unknown
        children: unknown
        scripts: unknown
      }) => unknown
    }) =>
      props.document({
        assets: "assets",
        children: "page",
        scripts: "scripts"
      })
  )
}))

vi.mock("@solidjs/start/server", () => ({
  createHandler: serverMocks.createHandler,
  StartServer: serverMocks.startServer
}))

describe("server entry", () => {
  it("creates the Start server document shell", async () => {
    await import("@/entry-server")

    expect(serverMocks.createHandler).toHaveBeenCalledOnce()
    expect(serverMocks.startServer).toHaveBeenCalledOnce()
    expect(
      serverMocks.startServer.mock.calls[0]?.[0]
    ).toEqual(
      expect.objectContaining({
        document: expect.any(Function)
      })
    )
  })
})
