import { render, screen } from "@solidjs/testing-library"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/registry/kobalte/ui/pagination"

describe("Pagination", () => {
  it("renders navigation links and marks the current page", () => {
    render(() => (
      <Pagination class="custom-pagination">
        <PaginationContent class="custom-content">
          <PaginationItem>
            <PaginationPrevious href="/page/1" class="custom-previous" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="/page/1">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="/page/2" isActive size="sm">
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis class="custom-ellipsis" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="/page/3" class="custom-next" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    ))

    expect(screen.getByRole("navigation", { name: "pagination" })).toHaveClass(
      "custom-pagination"
    )
    expect(screen.getByRole("list")).toHaveClass("custom-content")
    expect(screen.getAllByRole("listitem")).toHaveLength(5)

    expect(screen.getByRole("link", { name: "1" })).not.toHaveAttribute("aria-current")
    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute(
      "data-active",
      "true"
    )

    expect(screen.getByRole("link", { name: "Go to previous page" })).toHaveClass(
      "custom-previous"
    )
    expect(screen.getByRole("link", { name: "Go to next page" })).toHaveClass(
      "custom-next"
    )
    expect(screen.getByText("More pages").parentElement).toHaveClass("custom-ellipsis")
  })
})
