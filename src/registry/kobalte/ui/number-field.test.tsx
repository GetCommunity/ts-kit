import { render, screen } from "@solidjs/testing-library"

import {
  NumberField,
  NumberFieldDecrementTrigger,
  NumberFieldDescription,
  NumberFieldErrorMessage,
  NumberFieldGroup,
  NumberFieldIncrementTrigger,
  NumberFieldInput,
  NumberFieldLabel
} from "@/registry/kobalte/ui/number-field"

describe("NumberField", () => {
  it("renders label, input, controls, description, and error", () => {
    render(() => (
      <NumberField validationState="invalid" value={3}>
        <NumberFieldLabel>Quantity</NumberFieldLabel>
        <NumberFieldGroup class="custom-group">
          <NumberFieldInput />
          <NumberFieldIncrementTrigger>Increase</NumberFieldIncrementTrigger>
          <NumberFieldDecrementTrigger>Decrease</NumberFieldDecrementTrigger>
        </NumberFieldGroup>
        <NumberFieldDescription>Choose a quantity.</NumberFieldDescription>
        <NumberFieldErrorMessage>Quantity is required.</NumberFieldErrorMessage>
      </NumberField>
    ))

    expect(screen.getByText("Quantity")).toHaveClass("text-sm")
    expect(screen.getByRole("spinbutton")).toHaveClass("border-input")
    expect(screen.getByText("Increase")).toHaveClass("top-1")
    expect(screen.getByText("Decrease")).toHaveClass("bottom-1")
    expect(screen.getByText("Choose a quantity.")).toHaveClass("text-muted-foreground")
    expect(screen.getByText("Quantity is required.")).toHaveClass(
      "text-error-foreground"
    )
  })

  it("provides default increment and decrement icons", () => {
    const { container } = render(() => (
      <NumberField value={1}>
        <NumberFieldInput />
        <NumberFieldIncrementTrigger />
        <NumberFieldDecrementTrigger />
      </NumberField>
    ))

    expect(container.querySelector('path[d="M6 15l6 -6l6 6"]')).toBeInTheDocument()
    expect(container.querySelector('path[d="M6 9l6 6l6 -6"]')).toBeInTheDocument()
  })
})
