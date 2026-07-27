import { fireEvent, render, screen } from "@solidjs/testing-library"

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarGroupLabel,
  MenubarItem,
  MenubarItemLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger
} from "@/registry/base/ui/menubar"

describe("Menubar", () => {
  it("renders menu trigger and item wrappers", () => {
    render(() => (
      <>
        <Menubar class="custom-menubar">
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
          </MenubarMenu>
        </Menubar>
        <MenubarShortcut>⌘N</MenubarShortcut>
      </>
    ))

    expect(screen.getByText("File").closest("[role='menubar']")).toHaveClass(
      "custom-menubar"
    )
    expect(screen.getByText("⌘N")).toHaveClass("text-muted-foreground")
  })

  it("allows custom trigger and shortcut classes", () => {
    render(() => (
      <>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger class="custom-trigger">Edit</MenubarTrigger>
          </MenubarMenu>
        </Menubar>
        <MenubarShortcut class="custom-shortcut">⌘P</MenubarShortcut>
      </>
    ))

    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveClass(
      "custom-trigger"
    )
    expect(screen.getByText("⌘P")).toHaveClass("custom-shortcut")
  })

  it("renders every menu item composition when opened", () => {
    render(() => (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent class="custom-content">
            <MenubarGroup>
              <MenubarGroupLabel inset class="custom-group-label">
                Documents
              </MenubarGroupLabel>
              <MenubarItem inset class="custom-item">
                New
              </MenubarItem>
              <MenubarItem class="plain-item">Open</MenubarItem>
              <MenubarItem>
                <MenubarItemLabel inset class="custom-item-label">
                  Recent
                </MenubarItemLabel>
              </MenubarItem>
              <MenubarItem>
                <MenubarItemLabel>All files</MenubarItemLabel>
              </MenubarItem>
            </MenubarGroup>
            <MenubarCheckboxItem checked class="custom-checkbox-item">
              Autosave
            </MenubarCheckboxItem>
            <MenubarRadioGroup value="list">
              <MenubarRadioItem value="list" class="custom-radio-item">
                List
              </MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSub defaultOpen>
              <MenubarSubTrigger inset class="custom-sub-trigger">
                Share
              </MenubarSubTrigger>
              <MenubarSubContent class="custom-sub-content">
                <MenubarItem>Email</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator class="custom-separator" />
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    ))

    fireEvent.pointerDown(screen.getByRole("menuitem", { name: "File" }), {
      button: 0,
      ctrlKey: false
    })

    expect(screen.getByText("Documents")).toHaveClass(
      "custom-group-label",
      "pl-8"
    )
    expect(screen.getByText("New")).toHaveClass("custom-item", "pl-8")
    expect(screen.getByText("Open")).not.toHaveClass("pl-8")
    expect(screen.getByText("Recent")).toHaveClass(
      "custom-item-label",
      "pl-8"
    )
    expect(screen.getByText("Autosave")).toHaveClass("custom-checkbox-item")
    expect(screen.getByText("List")).toHaveClass("custom-radio-item")
    expect(screen.getByText("Share")).toHaveClass("custom-sub-trigger", "pl-8")
    expect(screen.getByText("Email").parentElement).toHaveClass(
      "custom-sub-content"
    )
    expect(document.querySelector(".custom-separator")).toBeInTheDocument()
  })
})
