import EmailIcon from "./svg/email"
import FacebookIcon from "./svg/facebook"
import InstagramIcon from "./svg/instagram"
import LinkIcon from "./svg/link"
import LinkedinIcon from "./svg/linkedin"
import PhoneIcon from "./svg/phone"
import PinterestIcon from "./svg/pinterest"
import TiktokIcon from "./svg/tiktok"
import TwitterIcon from "./svg/twitter"

import type { StrapiIconName } from "@getcommunity/gc-validators/base"
import type { Component, ComponentProps } from "solid-js"

export const STRAPI_ICON_MAP = {
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

export function getStrapiIconComponent(
  icon?: StrapiIconName
): Component<ComponentProps<"svg">> | null {
  if (!icon) return null
  return STRAPI_ICON_MAP[icon]
}
