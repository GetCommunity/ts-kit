import { render, screen } from "@solidjs/testing-library"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/registry/kobalte/ui/resizable"

describe("Resizable", () => {
  it("renders a panel group with an optional visible handle", () => {
    render(() => (
      <ResizablePanelGroup orientation="horizontal" class="custom-panel-group">
        <ResizablePanel initialSize={0.5}>Navigation</ResizablePanel>
        <ResizableHandle withHandle class="custom-handle" />
        <ResizablePanel initialSize={0.5}>Content</ResizablePanel>
      </ResizablePanelGroup>
    ))

    expect(screen.getByText("Navigation")).toHaveAttribute(
      "data-slot",
      "resizable-panel"
    )
    expect(screen.getByText("Content")).toHaveAttribute("data-slot", "resizable-panel")
    expect(document.querySelector("[data-slot='resizable-panel-group']")).toHaveClass(
      "custom-panel-group"
    )
    expect(document.querySelector("[data-slot='resizable-handle']")).toHaveClass(
      "custom-handle"
    )
    expect(document.querySelector(".z-resizable-handle-icon")).toBeInTheDocument()
  })
})
