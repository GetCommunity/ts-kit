import { render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"

import {
  Dialog,
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
        </DialogContent>
      </Dialog>
    ))

    expect(screen.getByRole("dialog")).toHaveClass("custom-dialog")
    expect(screen.getByText("Dialog title")).toHaveClass("text-lg")
    expect(screen.getByText("Dialog description")).toHaveClass("text-muted-foreground")

    await user.click(screen.getByRole("button", { name: "Dismiss" }))

    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
