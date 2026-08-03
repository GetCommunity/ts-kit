import type { ColorMode } from "@kobalte/core"
import type { docs } from "@velite"

export type TocEntry = docs["toc"]

export type IframeMessage =
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

export type Kind = "ui" | "blocks"
