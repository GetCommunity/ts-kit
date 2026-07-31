import { render, screen } from "@solidjs/testing-library"

import {
  Alert,
  AlertDescription,
  AlertTitle,
  alertVariants
} from "@/registry/kobalte/ui/alert"

describe("Alert", () => {
  it("renders alert content with variant and custom classes", () => {
    render(() => (
      <Alert variant="destructive" class="custom-alert">
        <AlertTitle>Problem found</AlertTitle>
        <AlertDescription>Something needs attention.</AlertDescription>
      </Alert>
    ))

    const alert = screen.getByRole("alert")

    expect(alert).toHaveClass("custom-alert", "text-destructive")
    expect(screen.getByText("Problem found")).toHaveClass("font-medium")
    expect(screen.getByText("Something needs attention.")).toHaveClass("text-sm")
  })

  it("exports reusable variant classes", () => {
    expect(alertVariants({ variant: "destructive" })).toContain("text-destructive")
  })
})
