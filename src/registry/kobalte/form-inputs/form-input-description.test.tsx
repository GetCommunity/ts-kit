import { render, screen } from "@solidjs/testing-library"

import FormInputDescription from "@/registry/kobalte/form-inputs/form-input-description"

describe("form input description", () => {
  it("renders descriptions, including custom classes", async () => {
    render(() => (
      <>
        <FormInputDescription description="Helpful context" class="description-class" />
        <FormInputDescription />
      </>
    ))

    expect(screen.getByText("Helpful context")).toHaveClass("description-class")
  })
})
