import { render, screen } from "@solidjs/testing-library"

import HiddenInput from "@/registry/kobalte/form-inputs/hidden-input"

describe("HiddenInput", () => {
  it.each([
    ["text", "alpha"],
    ["array", ["alpha", "beta"]],
    ["number", 42],
    ["true boolean", true],
    ["false boolean", false],
    ["null", null],
    ["undefined", undefined]
  ] as const)("serializes a %s value", (_case, value) => {
    const { container } = render(() => (
      // @ts-expect-error - value is nullish/undefinable
      <HiddenInput name="hidden-field" value={value} />
    ))
    const input = container.querySelector("input") as HTMLInputElement

    expect(input).toHaveAttribute("type", "hidden")
    if (Array.isArray(value)) {
      expect(input.value).toBe("alpha,beta")
    } else if (typeof value === "boolean") {
      expect(input.value).toBe(value ? "true" : "false")
      expect(input.checked).toBe(value)
    } else if (value == null) {
      expect(input.value).toBe("")
    } else {
      expect(input.value).toBe(String(value))
    }
  })

  it("shows its first error and forwards disabled state", async () => {
    const { container } = render(() => (
      <HiddenInput
        name="account-id"
        value="abc"
        error={["Invalid account", "Ignored detail"]}
        disabled
      />
    ))

    expect(container.querySelector("input")).toBeDisabled()
    expect(screen.getByText("account-id Error: Invalid account")).toBeInTheDocument()
  })

  it("supports the defensive non-array error rendering path", async () => {
    render(() => (
      <HiddenInput
        name="legacy-field"
        value="abc"
        error={"Legacy error" as unknown as [string, ...Array<string>]}
      />
    ))
    expect(screen.getByText("legacy-field Error: Legacy error")).toBeInTheDocument()
  })
})
