import { render, screen } from "@solidjs/testing-library"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/registry/kobalte/ui/hover-card"

describe("HoverCard", () => {
  it("renders an open card with a polymorphic trigger", () => {
    render(() => (
      <HoverCard open>
        <HoverCardTrigger href="/people/ada">Ada Lovelace</HoverCardTrigger>
        <HoverCardContent class="custom-card">First programmer</HoverCardContent>
      </HoverCard>
    ))

    expect(screen.getByRole("link", { name: "Ada Lovelace" })).toHaveAttribute(
      "href",
      "/people/ada"
    )
    expect(screen.getByText("First programmer")).toHaveAttribute(
      "data-slot",
      "hover-card-content"
    )
    expect(screen.getByText("First programmer")).toHaveClass("custom-card")
  })
})
