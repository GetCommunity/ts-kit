import type { StrapiIconName } from "@getcommunity/gc-validators/base"

import { getIconComponent, iconMap } from "@/registry/base/icons/map"
import EmailIcon from "@/registry/base/icons/svg/email"
import FacebookIcon from "@/registry/base/icons/svg/facebook"
import InstagramIcon from "@/registry/base/icons/svg/instagram"
import LinkIcon from "@/registry/base/icons/svg/link"
import LinkedinIcon from "@/registry/base/icons/svg/linkedin"
import PhoneIcon from "@/registry/base/icons/svg/phone"
import PinterestIcon from "@/registry/base/icons/svg/pinterest"
import TiktokIcon from "@/registry/base/icons/svg/tiktok"
import TwitterIcon from "@/registry/base/icons/svg/twitter"
import { render, screen } from "@solidjs/testing-library"
import { Component, ComponentProps } from "solid-js"

const mappedIcons = {
  link: LinkIcon,
  email: EmailIcon,
  phone: PhoneIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  tiktok: TiktokIcon,
  pinterest: PinterestIcon,
  twitter: TwitterIcon
} as const satisfies Record<string, Component<ComponentProps<"svg">>>

describe("iconMap", () => {
  it("maps every supported Strapi icon name to its SVG component", () => {
    expect(iconMap).toEqual(mappedIcons)
  })

  it.each(
    Object.entries(mappedIcons) as Array<
      [StrapiIconName, Component<ComponentProps<"svg">>]
    >
  )("returns the %s component from getIconComponent", (iconName, Icon) => {
    expect(getIconComponent(iconName)).toBe(Icon)
  })

  it("returns null when no icon name is provided", () => {
    expect(getIconComponent()).toBeNull()
  })

  it("returns a renderable icon component", () => {
    const Icon = getIconComponent("email")

    expect(Icon).toBe(EmailIcon)
    if (!Icon) throw new Error("Expected email icon to resolve")

    render(() => <Icon aria-label="Email icon" data-testid="mapped-icon" />)

    expect(screen.getByTestId("mapped-icon").tagName.toLowerCase()).toBe("svg")
    expect(screen.getByTestId("mapped-icon")).toHaveAccessibleName("Email icon")
  })
})
