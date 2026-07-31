import { existsSync, readdirSync, readFileSync } from "node:fs"
import { dirname, extname, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"
import { preProcessFile } from "typescript"

export type RegistryFile = {
  path: string
}

export type RegistryItem = {
  dependencies?: Array<string>
  files: Array<RegistryFile>
  name: string
  registryDependencies?: Array<string>
}

export type Registry = {
  include?: Array<string>
  items?: Array<RegistryItem>
}

type RegistryEntry = {
  item: RegistryItem
  registryPath: string
}

type ImportRequirements = {
  dependencies: Array<string>
  registryDependencies: Array<string>
  unresolvedInternalImports: Array<string>
}

const TEST_DIRECTORY = dirname(fileURLToPath(import.meta.url))
export const PROJECT_ROOT = resolve(TEST_DIRECTORY, "../../..")

const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx"])
const HOST_DEPENDENCIES = new Set(["solid-js"])

export function fromProjectRoot(projectPath: string) {
  return resolve(PROJECT_ROOT, projectPath)
}

export function loadRegistry(projectPath: string): Registry {
  return JSON.parse(readFileSync(fromProjectRoot(projectPath), "utf8")) as Registry
}

export function listDirectoryFiles(registryProjectPath: string) {
  const registryDirectory = dirname(fromProjectRoot(registryProjectPath))

  return walkDirectory(registryDirectory)
    .map((filePath) => toPosixPath(relative(registryDirectory, filePath)))
    .filter(
      (filePath) =>
        filePath !== "registry.json" &&
        !filePath.split("/").some((segment) => segment.startsWith("."))
    )
    .sort()
}

export function getRegisteredFilePaths(registry: Registry) {
  return (registry.items ?? [])
    .flatMap((item) => item.files.map((file) => toPosixPath(file.path)))
    .sort()
}

export function defineSourceRegistryTests(registryProjectPath: string) {
  const registry = loadRegistry(registryProjectPath)
  const registryPath = fromProjectRoot(registryProjectPath)
  const items = registry.items ?? []
  const registryIndex = createRegistryIndex()

  describe(registryProjectPath, () => {
    it("registers every source file in its directory", () => {
      expect(getRegisteredFilePaths(registry)).toEqual(
        listDirectoryFiles(registryProjectPath)
      )
    })

    describe.each(items)("$name", (item) => {
      const requirements = getImportRequirements(item, registryPath, registryIndex)

      it("references files that exist relative to the registry", () => {
        for (const file of item.files) {
          expect(
            existsSync(resolve(dirname(registryPath), file.path)),
            `${item.name}: ${file.path}`
          ).toBe(true)
        }
      })

      it("declares every imported package dependency", () => {
        expect(requirements.unresolvedInternalImports).toEqual([])
        expect(item.dependencies ?? []).toEqual(
          expect.arrayContaining(requirements.dependencies)
        )
      })

      it("declares every imported registry dependency", () => {
        expect(requirements.unresolvedInternalImports).toEqual([])
        expect(item.registryDependencies ?? []).toEqual(
          expect.arrayContaining(requirements.registryDependencies)
        )
      })
    })
  })
}

function walkDirectory(directoryPath: string): Array<string> {
  return readdirSync(directoryPath, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = resolve(directoryPath, entry.name)
    return entry.isDirectory() ? walkDirectory(entryPath) : [entryPath]
  })
}

function createRegistryIndex() {
  const rootRegistry = loadRegistry("registry.json")
  const entries = (rootRegistry.include ?? []).flatMap((registryProjectPath) => {
    const registryPath = fromProjectRoot(registryProjectPath)
    const registry = loadRegistry(registryProjectPath)
    return (registry.items ?? []).map((item): RegistryEntry => ({ item, registryPath }))
  })
  const itemByFile = new Map<string, RegistryItem>()

  for (const entry of entries) {
    for (const file of entry.item.files) {
      itemByFile.set(resolve(dirname(entry.registryPath), file.path), entry.item)
    }
  }

  return itemByFile
}

function getImportRequirements(
  item: RegistryItem,
  registryPath: string,
  registryIndex: Map<string, RegistryItem>
): ImportRequirements {
  const dependencies = new Set<string>()
  const registryDependencies = new Set<string>()
  const unresolvedInternalImports = new Set<string>()

  for (const file of item.files) {
    const sourcePath = resolve(dirname(registryPath), file.path)
    if (!SOURCE_EXTENSIONS.has(extname(sourcePath))) {
      continue
    }

    const source = readFileSync(sourcePath, "utf8")
    const importedModules = preProcessFile(source, true, true).importedFiles

    for (const importedModule of importedModules) {
      const specifier = importedModule.fileName

      if (specifier.startsWith("@/") || specifier.startsWith(".")) {
        const resolvedImport = resolveInternalImport(sourcePath, specifier)
        const dependencyItem = resolvedImport
          ? registryIndex.get(resolvedImport)
          : undefined

        if (!resolvedImport || !dependencyItem) {
          unresolvedInternalImports.add(`${file.path}: ${specifier}`)
        } else if (dependencyItem.name !== item.name) {
          registryDependencies.add(dependencyItem.name)
        }
        continue
      }

      const packageName = getPackageName(specifier)
      if (!HOST_DEPENDENCIES.has(packageName) && !packageName.startsWith("node:")) {
        dependencies.add(packageName)
      }
    }
  }

  return {
    dependencies: [...dependencies].sort(),
    registryDependencies: [...registryDependencies].sort(),
    unresolvedInternalImports: [...unresolvedInternalImports].sort()
  }
}

function resolveInternalImport(sourcePath: string, specifier: string) {
  const unresolvedPath = specifier.startsWith("@/")
    ? resolve(PROJECT_ROOT, "src", specifier.slice(2))
    : resolve(dirname(sourcePath), specifier)
  const candidates = [
    unresolvedPath,
    `${unresolvedPath}.ts`,
    `${unresolvedPath}.tsx`,
    `${unresolvedPath}.js`,
    `${unresolvedPath}.jsx`,
    resolve(unresolvedPath, "index.ts"),
    resolve(unresolvedPath, "index.tsx")
  ]

  return candidates.find((candidate) => existsSync(candidate))
}

function getPackageName(specifier: string) {
  if (specifier.startsWith("@")) {
    return specifier.split("/").slice(0, 2).join("/")
  }
  return specifier.split("/")[0]!
}

function toPosixPath(filePath: string) {
  return filePath.split(sep).join("/")
}
