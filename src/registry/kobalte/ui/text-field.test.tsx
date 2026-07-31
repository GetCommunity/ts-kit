import { render, screen } from "@solidjs/testing-library"

import {
  TextField,
  TextFieldDescription,
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
  TextFieldTextArea
} from "@/registry/kobalte/ui/text-field"

describe("TextField", () => {
  it("renders input field parts", () => {
    render(() => (
      <TextField validationState="invalid" class="custom-field">
        <TextFieldLabel>Email</TextFieldLabel>
        <TextFieldInput type="email" value="hello@example.com" />
        <TextFieldDescription>Use your work email.</TextFieldDescription>
        <TextFieldErrorMessage>Email is required.</TextFieldErrorMessage>
      </TextField>
    ))

    expect(screen.getByText("Email").parentElement).toHaveClass("custom-field")
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email")
    expect(screen.getByRole("textbox")).toHaveClass("border-input")
    expect(screen.getByText("Use your work email.")).toHaveClass(
      "text-muted-foreground"
    )
    expect(screen.getByText("Email is required.")).toHaveClass("text-destructive")
  })

  it("renders textarea field parts", () => {
    render(() => (
      <TextField>
        <TextFieldLabel>Bio</TextFieldLabel>
        <TextFieldTextArea value="About us" />
      </TextField>
    ))

    expect(screen.getByRole("textbox")).toHaveClass("min-h-20")
  })
})
