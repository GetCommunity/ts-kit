import { render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
} from "@/registry/kobalte/ui/command"

const user = userEvent.setup()

describe("Command", () => {
  it("renders a searchable command composition", async () => {
    render(() => (
      <Command class="custom-command">
        <CommandInput aria-label="Search commands" />
        <CommandList>
          <CommandEmpty>No commands found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem value="profile">
              Profile
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandSeparator />
            <CommandItem value="settings">Settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    ))

    const input = screen.getByRole("combobox")

    expect(input).toHaveAttribute("data-slot", "command-input")
    expect(input).toHaveAttribute("aria-label", "Search commands")
    expect(screen.getByText("Profile")).toHaveAttribute("data-slot", "command-item")
    expect(screen.getByText("⌘P")).toHaveClass("z-command-shortcut")
    expect(screen.getByText("Profile").closest("[data-slot='command']")).toHaveClass(
      "custom-command"
    )

    await user.type(input, "settings")
    expect(input).toHaveValue("settings")
    expect(screen.getByText("Settings")).toBeInTheDocument()
  })

  it("renders the command dialog with accessible default copy", () => {
    render(() => (
      <CommandDialog open showCloseButton={false} class="custom-command-dialog">
        <Command>Palette content</Command>
      </CommandDialog>
    ))

    expect(screen.getByRole("dialog", { name: "Command Palette" })).toHaveClass(
      "custom-command-dialog"
    )
    expect(
      screen.getByText("Search for a command to run...").closest(".sr-only")
    ).toHaveClass("sr-only")
    expect(screen.getByText("Palette content")).toHaveAttribute("data-slot", "command")
  })
})
