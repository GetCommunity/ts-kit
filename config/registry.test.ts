import { existsSync } from "node:fs"
import { dirname, resolve } from "node:path"

import { fromProjectRoot, loadRegistry } from "~/test/utils/registry-test-utils"

const registryProjectPath = "config/registry.json"
const registryPath = fromProjectRoot(registryProjectPath)
const registry = loadRegistry(registryProjectPath)

describe(registryProjectPath, () => {
  describe.each(registry.items ?? [])("$name", (item) => {
    it.each(item.files)("references an existing file: $path", (file) => {
      expect(existsSync(resolve(dirname(registryPath), file.path))).toBe(true)
    })
  })
})
