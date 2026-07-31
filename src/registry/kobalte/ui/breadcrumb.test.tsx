import { render, screen } from "@solidjs/testing-library"

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/registry/kobalte/ui/breadcrumb"

describe("Breadcrumb", () => {
  it("renders navigation, links, separators, and ellipsis", () => {
    render(() => (
      <Breadcrumb>
        <BreadcrumbList class="custom-list">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs" aria-current="page">
              Docs
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ))

    expect(screen.getByRole("navigation")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/")
    expect(screen.getByText("/")).toBeInTheDocument()
    expect(screen.getByText("More")).toHaveClass("sr-only")
    expect(screen.getByText("Home").closest("ol")).toHaveClass("custom-list")
  })

  it("provides a default separator icon", () => {
    const { container } = render(() => (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Docs</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ))

    expect(container.querySelector("svg")).toBeInTheDocument()
  })
})
