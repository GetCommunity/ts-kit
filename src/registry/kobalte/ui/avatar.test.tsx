import { render, screen } from "@solidjs/testing-library"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage
} from "@/registry/kobalte/ui/avatar"

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
        <AvatarImage class="custom-image" src="/avatar.png" alt="Ada Lovelace" />
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
    ))

    expect(screen.getByText("AL").parentElement).toHaveClass("custom-avatar")
    expect(screen.getByText("AL")).toHaveClass("bg-muted")

    return screen.findByRole("img", { name: "Ada Lovelace" }).then((image) => {
      expect(image).toHaveClass("custom-image", "aspect-square")
      vi.unstubAllGlobals()
    })
  })

  it("renders grouped avatars with a badge and overflow count", () => {
    render(() => (
      <AvatarGroup class="custom-group">
        <Avatar size="sm">
          <AvatarFallback>A</AvatarFallback>
          <AvatarBadge class="custom-badge">1</AvatarBadge>
        </Avatar>
        <AvatarGroupCount class="custom-count">+2</AvatarGroupCount>
      </AvatarGroup>
    ))

    expect(screen.getByText("1")).toHaveAttribute("data-slot", "avatar-badge")
    expect(screen.getByText("1")).toHaveClass("custom-badge")
    expect(screen.getByText("+2")).toHaveAttribute("data-slot", "avatar-group-count")
    expect(screen.getByText("+2")).toHaveClass("custom-count")
    expect(screen.getByText("+2").parentElement).toHaveClass("custom-group")
  })
})
