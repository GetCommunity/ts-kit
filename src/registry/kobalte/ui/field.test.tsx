import { render, screen } from "@solidjs/testing-library"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
  fieldVariants
} from "@/registry/kobalte/ui/field"
import { Input } from "@/registry/kobalte/ui/input"

describe("Field", () => {
  it("renders semantic field structure and responsive variants", () => {
    render(() => (
      <FieldSet>
        <FieldLegend variant="label">Profile</FieldLegend>
        <FieldGroup>
          <Field orientation="responsive" class="custom-field">
            <FieldLabel for="name">Name</FieldLabel>
            <FieldContent>
              <FieldTitle>Public name</FieldTitle>
              <Input id="name" />
              <FieldDescription>Shown to other members.</FieldDescription>
            </FieldContent>
          </Field>
          <FieldSeparator>or</FieldSeparator>
        </FieldGroup>
      </FieldSet>
    ))

    expect(screen.getByText("Profile").tagName).toBe("LEGEND")
    expect(document.querySelector("[data-slot='field']")).toHaveAttribute(
      "data-orientation",
      "responsive"
    )
    expect(screen.getByLabelText("Name")).toHaveAttribute("id", "name")
    expect(screen.getByText("or")).toHaveAttribute(
      "data-slot",
      "field-separator-content"
    )
    expect(fieldVariants({ orientation: "horizontal" })).toContain(
      "z-field-orientation-horizontal"
    )
  })

  it("deduplicates error messages and lets children override errors", () => {
    render(() => (
      <>
        <FieldError
          errors={[
            { message: "Required" },
            { message: "Required" },
            { message: "Too short" }
          ]}
        />
        <FieldError errors={[{ message: "Ignored" }]}>Custom error</FieldError>
        <FieldError errors={[]} />
      </>
    ))

    expect(screen.getAllByRole("alert")).toHaveLength(2)
    expect(screen.getByText("Required")).toBeInTheDocument()
    expect(screen.getByText("Too short")).toBeInTheDocument()
    expect(screen.getByText("Custom error")).toBeInTheDocument()
    expect(screen.queryByText("Ignored")).not.toBeInTheDocument()
  })

  it("renders default variants and a single error message", () => {
    render(() => (
      <>
        <FieldLegend>Account</FieldLegend>
        <Field>Default field</Field>
        <FieldSeparator />
        <FieldError errors={[{ message: "Required" }]} />
      </>
    ))

    expect(screen.getByText("Account")).toHaveAttribute("data-variant", "legend")
    expect(screen.getByRole("group")).toHaveAttribute("data-orientation", "vertical")
    expect(document.querySelector("[data-slot='field-separator']")).toHaveAttribute(
      "data-content",
      "false"
    )
    expect(screen.getByRole("alert")).toHaveTextContent("Required")
  })
})
