import { fireEvent, render, screen } from "@solidjs/testing-library"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/registry/new-york/ui/collapsible"

describe("Collapsible", () => {
  it("renders trigger and toggles content visibility", () => {
    render(() => (
      <Collapsible>
        <CollapsibleTrigger>Toggle details</CollapsibleTrigger>
        <CollapsibleContent>Details content</CollapsibleContent>
      </Collapsible>
    ))

    const trigger = screen.getByRole("button", { name: "Toggle details" })

    expect(screen.queryByText("Details content")).not.toBeInTheDocument()

    fireEvent.click(trigger)
    expect(screen.getByText("Details content")).toBeInTheDocument()

    fireEvent.click(trigger)
    expect(screen.queryByText("Details content")).not.toBeInTheDocument()
  })
})
