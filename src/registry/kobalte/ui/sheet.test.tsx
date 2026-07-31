import { render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/registry/kobalte/ui/sheet"

const user = userEvent.setup()

describe("Sheet", () => {
  it("renders an open side sheet and closes with the default close button", async () => {
    const handleOpenChange = vi.fn()

    render(() => (
      <Sheet open onOpenChange={handleOpenChange}>
        <SheetTrigger>Open settings</SheetTrigger>
        <SheetContent side="left" class="custom-sheet">
          <SheetHeader>
            <SheetTitle>Settings</SheetTitle>
            <SheetDescription>Update application settings.</SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <SheetClose>Done</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    ))

    const dialog = screen.getByRole("dialog")

    expect(dialog).toHaveAttribute("data-side", "left")
    expect(dialog).toHaveClass("custom-sheet")
    expect(screen.getByText("Settings").tagName).toBe("H2")
    expect(screen.getByText("Done")).toHaveAttribute("data-slot", "sheet-close")

    const defaultClose = screen
      .getAllByRole("button", { name: "Dismiss" })
      .find((button) => button.querySelector(".sr-only")?.textContent === "Close")

    await user.click(defaultClose!)
    expect(handleOpenChange).toHaveBeenCalledWith(false)
  })

  it("can hide the default close button", () => {
    render(() => (
      <Sheet open>
        <SheetContent showCloseButton={false}>
          <SheetTitle>Details</SheetTitle>
        </SheetContent>
      </Sheet>
    ))

    expect(screen.queryByRole("button", { name: "Dismiss" })).not.toBeInTheDocument()
  })
})
