import { render, screen } from "@solidjs/testing-library"

import {
  Progress,
  ProgressLabel,
  ProgressValueLabel
} from "@/registry/kobalte/ui/progress"

describe("Progress", () => {
  it("renders progressbar with label and value label", () => {
    render(() => (
      <Progress value={40} minValue={0} maxValue={100}>
        <ProgressLabel>Uploading</ProgressLabel>
        <ProgressValueLabel />
      </Progress>
    ))

    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "40")
    expect(screen.getByText("Uploading")).toHaveClass("text-sm")
    expect(screen.getByText("40%")).toHaveClass("text-sm")
  })
})
