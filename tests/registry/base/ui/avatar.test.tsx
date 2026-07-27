import { render, screen } from "@solidjs/testing-library"

import { Avatar, AvatarFallback, AvatarImage } from "@/registry/base/ui/avatar"

describe("Avatar", () => {
  it("renders fallback and image primitives with styling", () => {
    class LoadedImage {
      onload: ((event: Event) => void) | null = null

      set src(_value: string) {
        queueMicrotask(() => this.onload?.(new Event("load")))
      }
    }
    vi.stubGlobal("Image", LoadedImage)

    render(() => (
      <Avatar class="custom-avatar">
        <AvatarImage
          class="custom-image"
          src="/avatar.png"
          alt="Ada Lovelace"
        />
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
    ))

    expect(screen.getByText("AL").parentElement).toHaveClass("custom-avatar")
    expect(screen.getByText("AL")).toHaveClass("bg-muted")

    return screen
      .findByRole("img", { name: "Ada Lovelace" })
      .then((image) => {
        expect(image).toHaveClass("custom-image", "aspect-square")
        vi.unstubAllGlobals()
      })
  })
})
