import { render, screen } from "@solidjs/testing-library"

import FormInputErrors from "@/registry/kobalte/form-inputs/form-input-errors"

describe("form input errors", () => {
  it("renders input error, including custom classes", async () => {
    render(() => (
      <>
        <FormInputErrors
          error={["First problem", "Second problem"]}
          class="error-class"
        />
        <FormInputErrors />
      </>
    ))

    expect(screen.getByText("First problem").parentElement).toHaveClass("error-class")
    expect(screen.getByText("Second problem")).toBeInTheDocument()
  })
})
