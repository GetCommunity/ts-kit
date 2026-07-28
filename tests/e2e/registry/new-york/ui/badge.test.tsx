import { render, screen } from "@solidjs/testing-library"

import { Badge, badgeVariants } from "@/registry/new-york/ui/badge"

describe("Badge", () => {
  it("renders variant, round, and custom classes", () => {
    render(() => (
      <Badge variant="success" round class="custom-badge">
        Active
      </Badge>
    ))

    const badge = screen.getByText("Active")

    expect(badge).toHaveClass(
      "bg-success",
      "text-success-foreground",
      "rounded-full",
      "custom-badge"
    )
  })

  it("exports reusable variant classes", () => {
    expect(badgeVariants({ variant: "warning" })).toContain("bg-warning")
  })
})
