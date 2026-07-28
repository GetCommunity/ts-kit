import { render, screen } from "@solidjs/testing-library"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/registry/new-york/ui/table"

describe("Table", () => {
  it("renders table sections with wrapper and cell classes", () => {
    render(() => (
      <Table wrapperProps={{ class: "custom-wrapper" }} class="custom-table">
        <TableCaption>Client list</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>GetCommunity</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    ))

    expect(screen.getByRole("table")).toHaveClass("custom-table")
    expect(screen.getByRole("table").parentElement).toHaveClass("custom-wrapper")
    expect(screen.getByText("Name")).toHaveClass("text-left")
    expect(screen.getByText("GetCommunity")).toHaveClass("p-2")
    expect(screen.getByText("Client list")).toHaveClass("text-muted-foreground")
  })

  it("uses the default table wrapper", () => {
    render(() => <Table aria-label="Empty table" />)

    expect(
      screen.getByRole("table", { name: "Empty table" }).parentElement
    ).toHaveClass("overflow-auto")
  })
})
