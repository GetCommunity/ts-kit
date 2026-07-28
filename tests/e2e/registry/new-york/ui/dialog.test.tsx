import { fireEvent, render, screen } from "@solidjs/testing-library"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/registry/new-york/ui/dialog"

describe("Dialog", () => {
  it("renders open dialog content and handles close clicks", () => {
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

    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }))

    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
