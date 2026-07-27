import { render, screen } from "@solidjs/testing-library"

import App from "@/app"

vi.mock("@solidjs/start/router", () => ({
  FileRoutes: () => <p>Current route</p>
}))

vi.mock("@solidjs/router", () => ({
  Router: (props: {
    children: unknown
    root: (props: { children: unknown }) => unknown
  }) => props.root({ children: props.children })
}))

describe("App", () => {
  it("renders routed content inside the application shell", () => {
    render(() => <App />)

    expect(screen.getByText("Current route")).toBeInTheDocument()
    expect(document.title).toBe("Shadcn Solid Registry Template")
  })
})
