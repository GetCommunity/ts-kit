import { render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/registry/kobalte/ui/collapsible"

const user = userEvent.setup()

describe("Collapsible", () => {
  it("renders trigger and toggles content visibility", async () => {
    render(() => (
      <Collapsible>
        <CollapsibleTrigger>Toggle details</CollapsibleTrigger>
        <CollapsibleContent>Details content</CollapsibleContent>
      </Collapsible>
    ))

    const trigger = screen.getByRole("button", { name: "Toggle details" })

    expect(screen.queryByText("Details content")).not.toBeInTheDocument()

    await user.click(trigger)
    expect(screen.getByText("Details content")).toBeInTheDocument()

    await user.click(trigger)
    expect(screen.queryByText("Details content")).not.toBeInTheDocument()
  })
})
