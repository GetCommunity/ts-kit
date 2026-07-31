import { render, screen } from "@solidjs/testing-library"

vi.mock("solid-sonner", () => ({
  Toaster: (props: {
    class?: string
    icons?: Record<string, unknown>
    position?: string
    theme?: string
  }) => (
    <div
      class={props.class}
      data-icon-count={Object.keys(props.icons ?? {}).length}
      data-position={props.position}
      data-testid="sonner"
      data-theme={props.theme}
    />
  )
}))

import { Toaster } from "@/registry/kobalte/ui/sonner"

describe("Toaster", () => {
  it("configures Sonner defaults and allows prop overrides", () => {
    render(() => <Toaster position="bottom-right" />)

    const toaster = screen.getByTestId("sonner")

    expect(toaster).toHaveAttribute("data-theme", "system")
    expect(toaster).toHaveAttribute("data-position", "bottom-right")
    expect(toaster).toHaveAttribute("data-icon-count", "5")
    expect(toaster).toHaveClass("toaster", "group")
  })
})
