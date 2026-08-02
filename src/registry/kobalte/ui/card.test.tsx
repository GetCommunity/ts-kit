import { render, screen } from "@solidjs/testing-library"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/registry/kobalte/ui/card"

describe("Card", () => {
  it("renders composed card sections with classes", () => {
    render(() => (
      <Card class="custom-card">
        <CardHeader>
          <CardTitle>Card title</CardTitle>
          <CardDescription>Card description</CardDescription>
          <CardAction class="custom-action">Edit</CardAction>
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
    expect(screen.getByText("Edit")).toHaveAttribute("data-slot", "card-action")
    expect(screen.getByText("Edit")).toHaveClass("custom-action")
    expect(screen.getByText("Card content")).toHaveClass("pt-0")
    expect(screen.getByText("Card footer")).toHaveClass("flex")
  })
})
