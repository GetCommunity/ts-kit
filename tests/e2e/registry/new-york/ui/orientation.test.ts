import { orientationVariants } from "@/registry/new-york/ui/orientation"

describe("orientationVariants", () => {
  it("returns default vertical classes", () => {
    expect(orientationVariants()).toContain("flex-col")
  })

  it("returns horizontal classes", () => {
    const classes = orientationVariants({ orientation: "horizontal" })

    expect(classes).toContain("flex-row")
  })
})
