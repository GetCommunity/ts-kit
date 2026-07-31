import { existsSync } from "node:fs"

import { fromProjectRoot, loadRegistry } from "~/test/utils/registry-test-utils"

describe("registry.json", () => {
  it.each(loadRegistry("registry.json").include ?? [])(
    "includes an existing registry: %s",
    (includedRegistry) => {
      expect(existsSync(fromProjectRoot(includedRegistry))).toBe(true)
    }
  )
})
