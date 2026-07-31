import { render, screen } from "@solidjs/testing-library"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/registry/kobalte/ui/empty"

describe("Empty", () => {
  it("renders the complete empty-state composition", () => {
    render(() => (
      <Empty class="custom-empty">
        <EmptyHeader>
          <EmptyMedia variant="icon">!</EmptyMedia>
          <EmptyTitle>No projects</EmptyTitle>
          <EmptyDescription>Create a project to get started.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>New project action</EmptyContent>
      </Empty>
    ))

    expect(screen.getByText("No projects")).toHaveAttribute("data-slot", "empty-title")
    expect(screen.getByText("Create a project to get started.")).toHaveAttribute(
      "data-slot",
      "empty-description"
    )
    expect(screen.getByText("!")).toHaveAttribute("data-variant", "icon")
    expect(screen.getByText("New project action")).toHaveClass("max-w-sm")
    expect(screen.getByText("No projects").closest("[data-slot='empty']")).toHaveClass(
      "custom-empty"
    )
  })
})
