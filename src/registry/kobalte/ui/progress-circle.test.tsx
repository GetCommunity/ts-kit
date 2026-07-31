import { render, screen } from "@solidjs/testing-library"

import { ProgressCircle } from "@/registry/kobalte/ui/progress-circle"

describe("ProgressCircle", () => {
  it("renders a circular progress graphic and clamps value", () => {
    const { container } = render(() => (
      <ProgressCircle value={150} size="sm" showAnimation={false}>
        Complete
      </ProgressCircle>
    ))

    const wrapper = container.firstElementChild
    const svg = wrapper?.querySelector("svg")
    const progressCircle = svg?.querySelectorAll("circle")[1]

    expect(wrapper).toHaveClass("items-center")
    expect(svg).toHaveAttribute("width", "38")
    expect(progressCircle).toHaveAttribute("stroke-dashoffset", "0")
    expect(screen.getByText("Complete")).toBeInTheDocument()
  })

  it("uses default dimensions and value", () => {
    const { container } = render(() => <ProgressCircle />)

    const svg = container.querySelector("svg")
    expect(svg).toHaveAttribute("width", "64")
    expect(svg?.querySelectorAll("circle")[1]).toHaveAttribute(
      "stroke-dashoffset",
      expect.any(String)
    )
  })

  it("supports custom dimensions and values below zero", () => {
    const { container } = render(() => (
      <ProgressCircle value={-1} radius={20} strokeWidth={2} />
    ))

    expect(container.querySelector("svg")).toHaveAttribute("width", "40")
    expect(container.querySelectorAll("circle")).toHaveLength(1)
  })
})
