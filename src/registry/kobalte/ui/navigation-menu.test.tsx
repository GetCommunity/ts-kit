import { fireEvent, render, screen } from "@solidjs/testing-library"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/registry/kobalte/ui/navigation-menu"

describe("NavigationMenu", () => {
  it("renders navigation items, links, triggers, and indicators", () => {
    render(() => (
      <NavigationMenu class="custom-navigation">
        <NavigationMenuItem class="custom-item">
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
        </NavigationMenuItem>
        <NavigationMenuLink href="/docs" class="custom-link">
          Documentation
        </NavigationMenuLink>
        <NavigationMenuIndicator class="custom-indicator" />
      </NavigationMenu>
    ))

    expect(screen.getByText("Products")).toHaveAttribute(
      "data-slot",
      "navigation-menu-trigger"
    )
    expect(screen.getByRole("link", { name: "Documentation" })).toHaveAttribute(
      "href",
      "/docs"
    )
    expect(screen.getByRole("link", { name: "Documentation" })).toHaveClass(
      "custom-link"
    )
    expect(document.querySelector("[data-slot='navigation-menu']")).toHaveClass(
      "custom-navigation"
    )
    expect(
      document.querySelector("[data-slot='navigation-menu-indicator']")
    ).toHaveClass("custom-indicator")
    expect(navigationMenuTriggerStyle()).toContain("z-navigation-menu-trigger")
  })

  it("renders force-mounted menu content", () => {
    render(() => (
      <NavigationMenu forceMount>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent class="custom-content">
            <NavigationMenuLink href="/guides">Guides</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenu>
    ))

    fireEvent.pointerDown(screen.getByText("Resources"), {
      button: 0,
      ctrlKey: false
    })

    expect(screen.getByRole("link", { name: "Guides" }).parentElement).toHaveClass(
      "custom-content"
    )
  })
})
