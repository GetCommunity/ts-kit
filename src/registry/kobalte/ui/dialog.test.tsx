import { render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/registry/kobalte/ui/dialog"

const user = userEvent.setup()

describe("Dialog", () => {
  it("renders open dialog content and handles close clicks", async () => {
    const handleClose = vi.fn()

    render(() => (
      <Dialog open>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent onCloseClick={handleClose} class="custom-dialog">
          <DialogHeader>
            <DialogTitle>Dialog title</DialogTitle>
            <DialogDescription>Dialog description</DialogDescription>
          </DialogHeader>
          <DialogFooter>Dialog footer</DialogFooter>
          <DialogClose class="custom-close">Close dialog</DialogClose>
        </DialogContent>
      </Dialog>
    ))

    expect(screen.getByRole("dialog")).toHaveClass("custom-dialog")
    expect(screen.getByText("Dialog title")).toHaveClass("text-lg")
    expect(screen.getByText("Dialog description")).toHaveClass("text-muted-foreground")
    const explicitClose = screen
      .getAllByRole("button", { name: "Dismiss" })
      .find((button) => button.dataset.slot === "dialog-close")
    expect(explicitClose).toHaveAttribute("data-slot", "dialog-close")
    expect(explicitClose).toHaveClass("custom-close")

    const defaultClose = screen
      .getAllByRole("button", { name: "Dismiss" })
      .find((button) => button.dataset.slot !== "dialog-close")
    await user.click(defaultClose!)

    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
