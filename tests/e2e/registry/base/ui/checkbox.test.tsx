import { render, screen } from "@solidjs/testing-library"

import { Checkbox } from "@/registry/base/ui/checkbox"

describe("Checkbox", () => {
  it("renders a styled checkbox input", () => {
    render(() => <Checkbox checked aria-label="Accept terms" class="custom-checkbox" />)

    const checkbox = screen.getByRole("checkbox")

    expect(checkbox).toBeChecked()
    expect(checkbox.parentElement).toHaveClass("custom-checkbox")
  })

  it("renders the indeterminate state", () => {
    const { container } = render(() => (
      <Checkbox indeterminate aria-label="Select some rows" />
    ))

    expect((screen.getByRole("checkbox") as HTMLInputElement).indeterminate).toBe(true)
    expect(container.querySelector('path[d="M5 12l14 0"]')).toBeInTheDocument()
  })
})
