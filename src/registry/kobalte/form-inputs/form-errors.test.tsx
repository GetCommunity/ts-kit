import { createForm, setErrors } from "@formisch/solid"
import { render, screen } from "@solidjs/testing-library"
import * as v from "valibot"

import FormErrors from "@/registry/kobalte/form-inputs/form-errors"

const FormSchema = v.object({
  email: v.string()
})

describe("FormErrors", () => {
  it("renders nothing for a form without errors", () => {
    const { container } = render(() => {
      const form = createForm({ schema: FormSchema })
      return <FormErrors formStore={form} showAllErrors />
    })

    expect(container).toBeEmptyDOMElement()
  })

  it("renders default form errors and optional deep errors", () => {
    const { container } = render(() => {
      const form = createForm({ schema: FormSchema })
      setErrors(form, { errors: ["Submission failed", "Try again"] })
      setErrors(form, { path: ["email"], errors: ["Email is invalid"] })
      return <FormErrors formStore={form} showAllErrors class="form-errors-class" />
    })

    expect(
      screen.getByText("Oops, there was an error submitting your response.")
    ).toBeInTheDocument()
    expect(
      screen.getByText("Please fix the errors outlined and try again.")
    ).toBeInTheDocument()
    expect(screen.getByText("Submission failed")).toBeInTheDocument()
    expect(screen.getByText("Try again")).toBeInTheDocument()
    expect(screen.getByText(/Email is invalid/).tagName).toBe("PRE")
    expect(container.querySelector('[role="alert"]')).toHaveClass("form-errors-class")
  })

  it("renders custom alert copy without showing the deep-error dump", () => {
    render(() => {
      const form = createForm({ schema: FormSchema })
      setErrors(form, { errors: ["Server rejected the form"] })
      return (
        <FormErrors
          formStore={form}
          title="Could not save"
          description="Review the form."
        />
      )
    })

    expect(screen.getByText("Could not save")).toBeInTheDocument()
    expect(screen.getByText("Review the form.")).toBeInTheDocument()
    expect(screen.getByText("Server rejected the form")).toBeInTheDocument()
    expect(document.querySelector("pre")).not.toBeInTheDocument()
  })
})
