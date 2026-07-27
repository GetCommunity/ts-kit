import { render, screen } from "@solidjs/testing-library"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/registry/base/ui/dropdown-menu"

describe("DropdownMenu", () => {
  it("renders trigger and open menu content", () => {
    render(() => (
      <DropdownMenu open>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel inset>Menu label</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuGroupLabel class="custom-group-label">
              Account
            </DropdownMenuGroupLabel>
          </DropdownMenuGroup>
          <DropdownMenuItem>
            Edit
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem checked>Visible</DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup value="daily">
            <DropdownMenuRadioItem value="daily">Daily</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSub defaultOpen>
            <DropdownMenuSubTrigger class="custom-sub-trigger">
              Share
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent class="custom-sub-content">
              <DropdownMenuItem>Email</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    ))

    expect(screen.getByText("Actions")).toBeInTheDocument()
    expect(screen.getByText("Menu label")).toHaveClass("pl-8")
    expect(screen.getByText("Edit")).toHaveClass("text-sm")
    expect(screen.getByText("⌘E")).toHaveClass("tracking-widest")
    expect(screen.getByText("Visible")).toBeInTheDocument()
    expect(screen.getByText("Daily")).toBeInTheDocument()
    expect(screen.getByText("Account")).toHaveClass("custom-group-label")
    expect(screen.getByText("Share")).toHaveClass("custom-sub-trigger")
    expect(screen.getByText("Email").parentElement).toHaveClass(
      "custom-sub-content"
    )
  })
})
