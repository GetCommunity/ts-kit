import { fireEvent, render, screen } from "@solidjs/testing-library"
import { createSignal } from "solid-js"

import NumberRangeInput from "@/registry/kobalte/form-inputs/number-range-input"

describe("NumberRangeInput", () => {
  it("renders a labeled two-thumb error range and value label", async () => {
    const rectSpy = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockReturnValue({
        bottom: 20,
        height: 20,
        left: 0,
        right: 100,
        top: 0,
        width: 100,
        x: 0,
        y: 0,
        toJSON: () => ({})
      })
    const setPropertySpy = vi
      .spyOn(CSSStyleDeclaration.prototype, "setProperty")
      .mockImplementation(() => {})

    const { container } = render(() => (
      <NumberRangeInput
        name="price"
        value={[10, 30]}
        onChange={vi.fn()}
        label="Price"
        description="Choose a range."
        getValueLabel={({ values }) => values.join(" to ")}
        minValue={0}
        maxValue={100}
        required
        disabled
        error={["Range is unavailable"]}
      />
    ))

    expect(screen.getByText("Price")).toBeInTheDocument()
    expect(screen.getByText("10 to 30")).toBeInTheDocument()
    expect(screen.getByText("Choose a range.")).toBeInTheDocument()
    expect(screen.getByText("Range is unavailable")).toBeInTheDocument()
    expect(container.querySelectorAll('[role="slider"]')).toHaveLength(2)

    rectSpy.mockRestore()
    setPropertySpy.mockRestore()
  })

  it("renders one thumb for a single value and two when multiple is requested", async () => {
    const setPropertySpy = vi
      .spyOn(CSSStyleDeclaration.prototype, "setProperty")
      .mockImplementation(() => {})
    const first = render(() => (
      <NumberRangeInput name="single" value={[5]} onChange={vi.fn()} />
    ))
    expect(first.container.querySelectorAll('[role="slider"]')).toHaveLength(1)
    first.unmount()

    const second = render(() => (
      <NumberRangeInput name="multiple" value={null} onChange={vi.fn()} multiple />
    ))
    expect(second.container.querySelectorAll('[role="slider"]')).toHaveLength(2)
    second.unmount()

    const empty = render(() => (
      <NumberRangeInput name="empty" value={null} onChange={vi.fn()} />
    ))
    expect(empty.container.querySelectorAll('[role="slider"]')).toHaveLength(1)
    setPropertySpy.mockRestore()
  })

  it("updates its value signal from slider input", async () => {
    const [value, setValue] = createSignal([5])
    const setPropertySpy = vi
      .spyOn(CSSStyleDeclaration.prototype, "setProperty")
      .mockImplementation(() => {})
    render(() => (
      <>
        <NumberRangeInput name="reactive-range" value={value()} onChange={setValue} />
        <output aria-label="range value">{value().join(",")}</output>
      </>
    ))

    fireEvent.keyDown(screen.getAllByRole("slider")[0]!, { key: "ArrowRight" })
    expect(screen.getByLabelText("range value")).toHaveTextContent("6")
    setPropertySpy.mockRestore()
  })
})
