import { render, screen } from "@solidjs/testing-library"

import { Flex } from "@/registry/kobalte/ui/flex"

describe("Flex", () => {
  it("renders default and configured flex classes", () => {
    render(() => (
      <Flex
        flexDirection="col"
        justifyContent="center"
        alignItems="stretch"
        class="custom-flex"
      >
        Flex content
      </Flex>
    ))

    const flex = screen.getByText("Flex content")

    expect(flex).toHaveClass(
      "flex",
      "w-full",
      "flex-col",
      "justify-center",
      "items-stretch",
      "custom-flex"
    )
  })
})
