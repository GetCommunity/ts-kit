import { render, screen } from "@solidjs/testing-library"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/registry/base/ui/card"

describe("Card", () => {
  it("renders composed card sections with classes", () => {
    render(() => (
      <Card class="custom-card">
        <CardHeader>
          <CardTitle>Card title</CardTitle>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
        <CardContent>Card content</CardContent>
        <CardFooter>Card footer</CardFooter>
      </Card>
    ))

    expect(screen.getByText("Card title").closest(".custom-card")).toHaveClass(
      "custom-card"
    )
    expect(screen.getByText("Card title")).toHaveClass("text-lg")
    expect(screen.getByText("Card description")).toHaveClass("text-muted-foreground")
    expect(screen.getByText("Card content")).toHaveClass("pt-0")
    expect(screen.getByText("Card footer")).toHaveClass("flex")
  })
})
