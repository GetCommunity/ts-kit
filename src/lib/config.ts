/**
 * Discriminated entry for the "has updates" indicator. Items listed in
 * {@link UPDATED_ITEMS} render a small blue dot next to their label in the
 * sidebar (`ItemExplorer`) and command palette (`ItemPicker`). The `kind`
 * keeps the lookup unambiguous when the same slug exists across docs, ui,
 * and blocks (e.g. a doc page named "button" vs the button component).
 */
export type UpdatedItem = {
  kind: "docs" | "ui" | "blocks"
  slug: string
}

/**
 * Items flagged as recently updated. Each entry renders a blue dot next to
 * its label in the sidebar and command palette. The list is maintained
 * manually — entries stay until the maintainer removes them.
 */
export const UPDATED_ITEMS: UpdatedItem[] = [
  // { kind: "docs", slug: "changelog" },
  { kind: "docs", slug: "installation" },
  { kind: "docs", slug: "zaidan-agent" }
  // { kind: "blocks", slug: "image-crop" }
]
