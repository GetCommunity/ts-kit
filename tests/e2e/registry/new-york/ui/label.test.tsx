import { render, screen } from "@solidjs/testing-library"

import { Label, labelVariants } from "@/registry/new-york/ui/label"

describe("Label", () => {
  it("renders label classes and htmlFor", () => {
    render(() => <Label for="email">Email</Label>)

    const label = screen.getByText("Email")

    expect(label).toHaveAttribute("for", "email")
    expect(label).toHaveClass("text-sm", "font-medium")
  })

  it("exports reusable variant classes", () => {
    expect(labelVariants({ variant: "error" })).toContain("text-destructive")
  })
})
