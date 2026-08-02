import { cn } from "@/registry/kobalte/lib/utils/tailwind"

describe("tailwind cn utility", () => {
  it("joins simple class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1")
  })

  it("supports conditional and falsy clsx inputs", () => {
    const isHidden = false
    expect(
      cn("base", isHidden && "hidden", null, undefined, {
        active: true,
        disabled: false
      })
    ).toBe("base active")
  })

  it("merges conflicting tailwind classes by keeping the last one", () => {
    expect(cn("px-2", "px-4", "text-sm", "text-lg")).toBe("px-4 text-lg")
  })

  it("merges class arrays and nested values", () => {
    expect(cn(["p-2", ["rounded", "p-4"]], "font-bold")).toBe("rounded p-4 font-bold")
  })
})
