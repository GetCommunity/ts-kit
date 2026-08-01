import type { sharedComponents } from "@/components/mdx-components"
import { FONT_DEFINITIONS, type FontName } from "@/lib/fonts"
import type { ColorMode } from "@kobalte/core"
import type { docs } from "@velite"
import type { Component } from "solid-js"
import * as v from "valibot"

export const StyleSchema = v.picklist([
  "vega",
  "nova",
  "lyra",
  "maia",
  "mira",
  "luma",
  "sera"
])
export type Style = v.InferOutput<typeof StyleSchema>

export const BaseColorSchema = v.picklist([
  "neutral",
  "stone",
  "zinc",
  "gray",
  "mauve",
  "olive",
  "mist",
  "taupe"
])
export type BaseColor = v.InferOutput<typeof BaseColorSchema>

const ThemeColorSchema = v.picklist([
  "amber",
  "blue",
  "cyan",
  "emerald",
  "fuchsia",
  "green",
  "indigo",
  "lime",
  "orange",
  "pink",
  "purple",
  "red",
  "rose",
  "sky",
  "teal",
  "violet",
  "yellow"
])

export const ThemeSchema = v.union([BaseColorSchema, ThemeColorSchema])
export type Theme = v.InferOutput<typeof ThemeSchema>

// Chart palette behaves like the theme picker: same value space, with
// "match base color palette" expressed by setting `chartColor === baseColor`.
export const ChartColorSchema = ThemeSchema
export type ChartColor = Theme

const FONT_NAMES = FONT_DEFINITIONS.map((f) => f.name) as [FontName, ...FontName[]]
export const FontSchema = v.picklist(FONT_NAMES)
export type Font = v.InferOutput<typeof FontSchema>

export const RadiusSchema = v.picklist(["default", "none", "small", "medium", "large"])
export type Radius = v.InferOutput<typeof RadiusSchema>

export const MenuAccentSchema = v.picklist(["subtle", "bold"])
export type MenuAccent = v.InferOutput<typeof MenuAccentSchema>

export type LockableParam =
  | "style"
  | "baseColor"
  | "theme"
  | "chartColor"
  | "headingFont"
  | "font"
  | "radius"
  | "menuAccent"

export type TocEntry = docs["toc"]

export type IframeMessage =
  | {
      type: "design-system-params-sync"
      data: DesignSystemConfig
    }
  | {
      type: "cmd-k-forward"
      key: "k" | "K"
    }
  | {
      type: "dark-mode-forward"
      key: "d" | "D"
    }
  | {
      type: "randomize-forward"
      key: "r" | "R"
    }
  | {
      type: "color-mode-sync"
      data: ColorMode
    }
  | {
      type: "iframe-height-sync"
      data: number
    }

export type IframeMessageType = IframeMessage["type"]

export const PrimitiveSchema = v.picklist(["kobalte", "base"])

export type Primitive = v.InferOutput<typeof PrimitiveSchema>

export type Kind = "ui" | "blocks"

export const DesignSystemConfigSchema = v.object({
  primitive: v.optional(PrimitiveSchema, "kobalte"),
  style: v.optional(StyleSchema, "vega"),
  baseColor: v.optional(BaseColorSchema, "neutral"),
  theme: v.optional(ThemeSchema, "neutral"),
  chartColor: v.optional(ChartColorSchema, "neutral"),
  font: v.optional(FontSchema, "inter"),
  headingFont: v.optional(FontSchema, "inter"),
  radius: v.optional(RadiusSchema, "default"),
  menuAccent: v.optional(MenuAccentSchema, "subtle")
})

export type DesignSystemConfig = v.InferOutput<typeof DesignSystemConfigSchema>

export type MdxModule = { default: Component<{ components?: typeof sharedComponents }> }
