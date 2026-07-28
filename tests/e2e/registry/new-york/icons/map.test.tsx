import type { StrapiIconName } from "@getcommunity/gc-validators/base"

import {
  getStrapiIconComponent,
  STRAPI_ICON_MAP
} from "@/registry/new-york/icons/strapi-icon-component"
import EmailIcon from "@/registry/new-york/icons/svg/email"
import FacebookIcon from "@/registry/new-york/icons/svg/facebook"
import InstagramIcon from "@/registry/new-york/icons/svg/instagram"
import LinkIcon from "@/registry/new-york/icons/svg/link"
import LinkedinIcon from "@/registry/new-york/icons/svg/linkedin"
import PhoneIcon from "@/registry/new-york/icons/svg/phone"
import PinterestIcon from "@/registry/new-york/icons/svg/pinterest"
import TiktokIcon from "@/registry/new-york/icons/svg/tiktok"
import TwitterIcon from "@/registry/new-york/icons/svg/twitter"
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

describe("STRAPI_ICON_MAP", () => {
  it("maps every supported Strapi icon name to its SVG component", () => {
    expect(STRAPI_ICON_MAP).toEqual(mappedIcons)
  })

  it.each(
    Object.entries(mappedIcons) as Array<
      [StrapiIconName, Component<ComponentProps<"svg">>]
    >
  )("returns the %s component from getStrapiIconComponent", (iconName, Icon) => {
    expect(getStrapiIconComponent(iconName)).toBe(Icon)
  })

  it("returns null when no icon name is provided", () => {
    expect(getStrapiIconComponent()).toBeNull()
  })

  it("returns a renderable icon component", () => {
    const Icon = getStrapiIconComponent("email")

    expect(Icon).toBe(EmailIcon)
    if (!Icon) throw new Error("Expected email icon to resolve")

    render(() => <Icon aria-label="Email icon" data-testid="mapped-icon" />)

    expect(screen.getByTestId("mapped-icon").tagName.toLowerCase()).toBe("svg")
    expect(screen.getByTestId("mapped-icon")).toHaveAccessibleName("Email icon")
  })
})
