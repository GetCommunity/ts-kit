import { fireEvent, render, screen } from "@solidjs/testing-library"

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger
} from "@/registry/kobalte/ui/context-menu"

describe("ContextMenu", () => {
  it("opens from a context-menu event and renders all item types", () => {
    render(() => (
      <ContextMenu>
        <ContextMenuTrigger>Open actions</ContextMenuTrigger>
        <ContextMenuContent class="custom-content">
          <ContextMenuGroup>
            <ContextMenuLabel inset>Actions</ContextMenuLabel>
            <ContextMenuItem variant="destructive" inset>
              Delete
              <ContextMenuShortcut>⌘D</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuCheckboxItem checked>Visible</ContextMenuCheckboxItem>
          <ContextMenuRadioGroup value="grid">
            <ContextMenuRadioItem value="grid">Grid</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <ContextMenuSub defaultOpen>
            <ContextMenuSubTrigger inset>Share</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Email</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
        </ContextMenuContent>
      </ContextMenu>
    ))

    fireEvent.contextMenu(screen.getByText("Open actions"), {
      clientX: 10,
      clientY: 20
    })

    expect(screen.getByText("Actions")).toHaveAttribute("data-inset", "true")
    expect(screen.getByText("Delete")).toHaveAttribute("data-variant", "destructive")
    expect(screen.getByText("⌘D")).toHaveClass("z-context-menu-shortcut")
    expect(screen.getByText("Visible")).toBeInTheDocument()
    expect(screen.getByText("Grid")).toBeInTheDocument()
    expect(screen.getByText("Share")).toHaveAttribute("data-inset", "true")
    expect(screen.getByText("Email")).toBeInTheDocument()
    expect(
      screen.getByText("Actions").closest("[data-slot='context-menu-content']")
    ).toHaveClass("custom-content")
  })

  it("exports a portal wrapper for custom content", () => {
    render(() => (
      <ContextMenu>
        <ContextMenuTrigger>Portal trigger</ContextMenuTrigger>
        <ContextMenuPortal>
          <div>Custom portal content</div>
        </ContextMenuPortal>
      </ContextMenu>
    ))

    fireEvent.contextMenu(screen.getByText("Portal trigger"))

    expect(screen.getByText("Custom portal content")).toBeInTheDocument()
  })
})
