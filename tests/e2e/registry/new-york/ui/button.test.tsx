import { render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"

import { Button, buttonVariants } from "@/registry/new-york/ui/button"

const user = userEvent.setup()

describe("Button", () => {
  it("renders children as a button with default variant styles", async () => {
    render(() => <Button>Save changes</Button>)

    const button = screen.getByRole("button", { name: "Save changes" })

    expect(button).toBeInTheDocument()
    expect(button.tagName).toBe("BUTTON")
    expect(button).toHaveClass("bg-primary", "text-primary-foreground", "h-10")
  })

  it("applies variant, size, and custom classes", async () => {
    render(() => (
      <Button variant="outline" size="sm" class="w-full">
        Filter
      </Button>
    ))

    const button = screen.getByRole("button", { name: "Filter" })

    expect(button).toHaveClass(
      "border",
      "border-input",
      "h-9",
      "px-3",
      "text-xs",
      "w-full"
    )
  })

  it("passes button props through to the root element", async () => {
    const handleClick = vi.fn()

    render(() => (
      <Button type="submit" aria-label="Submit form" onClick={handleClick}>
        Submit
      </Button>
    ))

    const button = screen.getByRole("button", { name: "Submit form" })

    expect(button).toHaveAttribute("type", "submit")

    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("renders disabled state", async () => {
    render(() => <Button disabled>Disabled action</Button>)

    const button = screen.getByRole("button", { name: "Disabled action" })

    expect(button).toBeDisabled()
    expect(button).toHaveClass("disabled:pointer-events-none", "disabled:opacity-50")
  })

  it("supports polymorphic anchor rendering", async () => {
    render(() => (
      <Button as="a" href="/resources" variant="link">
        View resources
      </Button>
    ))

    const link = screen.getByRole("link", { name: "View resources" })

    expect(link.tagName).toBe("A")
    expect(link).toHaveAttribute("href", "/resources")
    expect(link).toHaveClass("text-primary", "underline-offset-4")
  })

  it("exports reusable variant classes", async () => {
    expect(buttonVariants({ variant: "destructive", size: "icon" })).toContain(
      "bg-destructive"
    )
    expect(buttonVariants({ variant: "destructive", size: "icon" })).toContain(
      "size-10"
    )
  })
})
