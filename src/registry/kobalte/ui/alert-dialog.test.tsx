import { render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/registry/kobalte/ui/alert-dialog"

const user = userEvent.setup()

describe("AlertDialog", () => {
  it("renders an open alert dialog and closes through either action", async () => {
    const handleOpenChange = vi.fn()

    render(() => (
      <AlertDialog open onOpenChange={handleOpenChange}>
        <AlertDialogTrigger>Delete account</AlertDialogTrigger>
        <AlertDialogContent size="sm" class="custom-dialog">
          <AlertDialogHeader>
            <AlertDialogMedia>Warning</AlertDialogMedia>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ))

    const dialog = screen.getByRole("alertdialog")

    expect(dialog).toHaveAttribute("data-size", "sm")
    expect(dialog).toHaveClass("custom-dialog")
    expect(screen.getByText("Are you sure?").tagName).toBe("H2")
    expect(screen.getByText("Warning")).toHaveAttribute(
      "data-slot",
      "alert-dialog-media"
    )
    const dismissButtons = screen.getAllByRole("button", { name: "Dismiss" })
    const cancel = dismissButtons.find(
      (button) => button.dataset.slot === "alert-dialog-cancel"
    )
    const action = dismissButtons.find(
      (button) => button.dataset.slot === "alert-dialog-action"
    )

    expect(cancel).toHaveClass("z-alert-dialog-cancel")
    expect(action).toHaveTextContent("Delete")

    await user.click(action!)
    expect(handleOpenChange).toHaveBeenCalledWith(false)
  })
})
