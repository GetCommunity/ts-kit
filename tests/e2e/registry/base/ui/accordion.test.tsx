import { render, screen } from "@solidjs/testing-library"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/registry/base/ui/accordion"

describe("Accordion", () => {
  it("renders an item with trigger and content wrappers", () => {
    render(() => (
      <Accordion defaultValue={["details"]}>
        <AccordionItem value="details" class="custom-item">
          <AccordionTrigger class="custom-trigger">Details</AccordionTrigger>
          <AccordionContent class="custom-content">Accordion body</AccordionContent>
        </AccordionItem>
      </Accordion>
    ))

    const trigger = screen.getByRole("button", { name: "Details" })

    expect(trigger).toHaveClass("custom-trigger")
    expect(screen.getByText("Accordion body")).toBeInTheDocument()
    expect(screen.getByText("Accordion body").parentElement).toHaveClass(
      "custom-content"
    )
  })

  it("renders a custom trigger icon", () => {
    render(() => (
      <Accordion>
        <AccordionItem value="custom">
          <AccordionTrigger icon={<span data-testid="custom-icon">+</span>}>
            Custom
          </AccordionTrigger>
        </AccordionItem>
      </Accordion>
    ))

    expect(screen.getByTestId("custom-icon")).toHaveTextContent("+")
  })
})
