import { fireEvent, render, screen } from "@solidjs/testing-library"
import { createSignal } from "solid-js"

import TextInput from "@/registry/kobalte/form-inputs/text-input.ui"

describe("TextInput", () => {
  it("renders and changes a single-line field", async () => {
    const [value, setValue] = createSignal<string | null>(null)
    render(() => (
      <TextInput
        type="email"
        name="email"
        value={value()}
        onChange={setValue}
        label="Email"
        description="We will contact you."
        placeholder="name@example.com"
        required
        error={["Email is required"]}
        autoComplete="email"
        autoFocus
        tabIndex={2}
        class="field-class"
        inputClass="input-class"
      />
    ))

    const input = screen.getByLabelText(/Email/) as HTMLInputElement
    expect(input).toHaveValue("")
    expect(input).toHaveAttribute("type", "email")
    expect(input).toHaveAttribute("autocomplete", "email")
    expect(input).toHaveAttribute("tabindex", "2")
    expect(input).toHaveClass("input-class")
    expect(screen.getByText("We will contact you.")).toBeInTheDocument()
    expect(screen.getByText("Email is required")).toBeInTheDocument()

    fireEvent.input(input, { target: { value: "person@example.com" } })
    expect(input).toHaveValue("person@example.com")
    fireEvent.input(input, { target: { value: "" } })
    expect(input).toHaveValue("")
  })

  it("renders and changes a multiline field", async () => {
    const [value, setValue] = createSignal<string | null>("Existing")
    render(() => (
      <TextInput
        type="text"
        name="notes"
        value={value()}
        onChange={setValue}
        multiline
        rows={4}
        autoResize
        placeholder="Notes"
      />
    ))

    const textarea = screen.getByPlaceholderText("Notes")
    expect(textarea.tagName).toBe("TEXTAREA")
    expect(textarea).toHaveAttribute("rows", "4")
    fireEvent.input(textarea, { target: { value: "Updated" } })
    expect(textarea).toHaveValue("Updated")
  })
})
