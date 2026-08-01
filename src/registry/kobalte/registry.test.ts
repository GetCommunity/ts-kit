import { existsSync } from "node:fs"

import { fromProjectRoot, loadRegistry } from "~/test/utils/registry-test-utils"

describe("kobalte/registry.json", () => {
  it.each(loadRegistry("src/registry/kobalte/registry.json").include ?? [])(
    "includes an existing registry: %s",
    (includedRegistry) => {
      expect(
        existsSync(fromProjectRoot(`src/registry/kobalte/${includedRegistry}`))
      ).toBe(true)
    }
  )
})
