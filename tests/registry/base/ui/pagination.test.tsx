import { render, screen } from "@solidjs/testing-library"

import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationItems,
  PaginationNext,
  PaginationPrevious
} from "@/registry/base/ui/pagination"

describe("Pagination", () => {
  it("renders pagination controls and items", () => {
    render(() => (
      <Pagination
        count={30}
        page={2}
        itemComponent={(props) => (
          <PaginationItem page={props.page}>{props.page}</PaginationItem>
        )}
        ellipsisComponent={() => <PaginationEllipsis />}
      >
        <PaginationPrevious />
        <PaginationItems />
        <PaginationNext />
      </Pagination>
    ))

    expect(screen.getByRole("navigation")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /previous/i })).toHaveClass("gap-1")
    expect(screen.getByRole("button", { name: /next/i })).toHaveClass("gap-1")
    expect(screen.getByRole("button", { name: "2" })).toHaveClass("size-10")
  })

  it("renders custom previous and next labels plus ellipsis", () => {
    render(() => (
      <Pagination
        count={100}
        page={5}
        siblingCount={0}
        itemComponent={(props) => (
          <PaginationItem page={props.page}>{props.page}</PaginationItem>
        )}
        ellipsisComponent={() => <PaginationEllipsis />}
      >
        <PaginationPrevious>Back</PaginationPrevious>
        <PaginationItems />
        <PaginationNext>Forward</PaginationNext>
      </Pagination>
    ))

    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Forward" })).toBeInTheDocument()
    expect(screen.getAllByText("More pages").length).toBeGreaterThan(0)
  })
})
