import { render, screen } from "@solidjs/testing-library"

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  itemVariants
} from "@/registry/kobalte/ui/item"

describe("Item", () => {
  it("renders a polymorphic item and all composition regions", () => {
    render(() => (
      <ItemGroup>
        <Item as="a" href="/settings" variant="outline" size="sm">
          <ItemHeader>Header</ItemHeader>
          <ItemMedia variant="icon">S</ItemMedia>
          <ItemContent>
            <ItemTitle>Settings</ItemTitle>
            <ItemDescription>Manage preferences</ItemDescription>
          </ItemContent>
          <ItemActions>Action</ItemActions>
          <ItemFooter>Footer</ItemFooter>
        </Item>
        <ItemSeparator />
      </ItemGroup>
    ))

    const item = screen.getByRole("link", { name: /settings/i })

    expect(item).toHaveAttribute("href", "/settings")
    expect(item).toHaveAttribute("data-variant", "outline")
    expect(item).toHaveAttribute("data-size", "sm")
    expect(screen.getByText("S")).toHaveAttribute("data-variant", "icon")
    expect(screen.getByText("Header")).toHaveAttribute("data-slot", "item-header")
    expect(screen.getByText("Action")).toHaveAttribute("data-slot", "item-actions")
    expect(screen.getByText("Footer")).toHaveAttribute("data-slot", "item-footer")
    expect(document.querySelector("[data-slot='item-separator']")).toBeInTheDocument()
    expect(itemVariants({ variant: "muted" })).toContain("z-item-variant-muted")
  })
})
