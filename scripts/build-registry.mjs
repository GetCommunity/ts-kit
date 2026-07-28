import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const REGISTRY_ITEM_SCHEMA = "https://ui.shadcn.com/schema/registry-item.json"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, "..")

function readRegistry(registryPath) {
  try {
    return JSON.parse(readFileSync(registryPath, "utf-8"))
  } catch (error) {
    throw new Error(`Unable to read registry at ${registryPath}: ${error.message}`)
  }
}

function validateArray(value, property, registryPath) {
  if (value === undefined) {
    return []
  }

  if (!Array.isArray(value)) {
    throw new Error(`Expected "${property}" in ${registryPath} to be an array.`)
  }

  return value
}

function collectRegistryItems(registryPath, registry, parentPaths = []) {
  const resolvedRegistryPath = resolve(registryPath)

  if (parentPaths.includes(resolvedRegistryPath)) {
    const cycle = [...parentPaths, resolvedRegistryPath].join(" -> ")
    throw new Error(`Circular registry include detected: ${cycle}`)
  }

  const items = validateArray(registry.items, "items", resolvedRegistryPath)
  const includes = validateArray(registry.include, "include", resolvedRegistryPath)
  const entries = items.map((item) => ({
    item,
    registryPath: resolvedRegistryPath
  }))
  const nextParentPaths = [...parentPaths, resolvedRegistryPath]

  for (const include of includes) {
    if (typeof include !== "string" || include.length === 0) {
      throw new Error(
        `Every "include" entry in ${resolvedRegistryPath} must be a non-empty string.`
      )
    }

    const includedRegistryPath = resolve(dirname(resolvedRegistryPath), include)
    const includedRegistry = readRegistry(includedRegistryPath)

    entries.push(
      ...collectRegistryItems(includedRegistryPath, includedRegistry, nextParentPaths)
    )
  }

  return entries
}

function validateRegistryItems(entries) {
  const itemRegistryPaths = new Map()

  for (const { item, registryPath } of entries) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error(`Invalid registry item in ${registryPath}.`)
    }

    if (typeof item.name !== "string" || item.name.length === 0) {
      throw new Error(`Registry item in ${registryPath} is missing a name.`)
    }

    const existingRegistryPath = itemRegistryPaths.get(item.name)
    if (existingRegistryPath) {
      throw new Error(
        `Duplicate registry item "${item.name}" found in ${existingRegistryPath} and ${registryPath}.`
      )
    }

    itemRegistryPaths.set(item.name, registryPath)
  }
}

function toProjectPath(projectRoot, filePath) {
  return relative(projectRoot, filePath).split("\\").join("/")
}

function resolveRegistryFile(projectRoot, registryPath, file) {
  if (!file || typeof file.path !== "string" || file.path.length === 0) {
    throw new Error(`Registry item file in ${registryPath} is missing a valid path.`)
  }

  // With `include`, shadcn resolves paths relative to the registry.json that
  // declares them.
  const registryRelativePath = resolve(dirname(registryPath), file.path)
  if (existsSync(registryRelativePath)) {
    return registryRelativePath
  }

  // Keep existing root-relative registries working while they migrate to
  // Option B's registry-relative paths.
  const projectRelativePath = resolve(projectRoot, file.path)
  if (projectRelativePath !== registryRelativePath && existsSync(projectRelativePath)) {
    console.warn(
      `Warning: ${file.path} in ${toProjectPath(
        projectRoot,
        registryPath
      )} is project-root relative. Option B paths should be relative to that registry.json file.`
    )
    return projectRelativePath
  }

  throw new Error(
    `Unable to find ${file.path} declared in ${toProjectPath(
      projectRoot,
      registryPath
    )}. Tried ${registryRelativePath} and ${projectRelativePath}.`
  )
}

function buildRegistryItem(projectRoot, entry) {
  const sourceFiles = validateArray(entry.item.files, "files", entry.registryPath)
  const files = []
  const flattenedFiles = []

  for (const file of sourceFiles) {
    try {
      const sourcePath = resolveRegistryFile(projectRoot, entry.registryPath, file)

      files.push({
        ...file,
        content: readFileSync(sourcePath, "utf-8")
      })
      flattenedFiles.push({
        ...file,
        path: toProjectPath(projectRoot, sourcePath)
      })
    } catch (error) {
      console.error(error.message)
    }
  }

  return {
    builtItem: {
      ...entry.item,
      $schema: REGISTRY_ITEM_SCHEMA,
      files
    },
    flattenedItem: {
      ...entry.item,
      files: flattenedFiles
    }
  }
}

export function buildRegistry({
  projectRoot = rootDir,
  registryPath = join(projectRoot, "registry.json"),
  outputDir = join(projectRoot, "public", "r")
} = {}) {
  const resolvedProjectRoot = resolve(projectRoot)
  const resolvedRegistryPath = resolve(registryPath)
  const resolvedOutputDir = resolve(outputDir)
  const registry = readRegistry(resolvedRegistryPath)
  const entries = collectRegistryItems(resolvedRegistryPath, registry)

  validateRegistryItems(entries)
  mkdirSync(resolvedOutputDir, { recursive: true })

  const flattenedItems = []

  for (const entry of entries) {
    const { builtItem, flattenedItem } = buildRegistryItem(resolvedProjectRoot, entry)
    const itemOutputPath = join(resolvedOutputDir, `${builtItem.name}.json`)

    writeFileSync(itemOutputPath, JSON.stringify(builtItem, null, 2))
    console.log(`Built: ${builtItem.name}.json`)
    flattenedItems.push(flattenedItem)
  }

  const registryIndex = {
    ...registry,
    items: flattenedItems
  }
  delete registryIndex.include

  writeFileSync(
    join(resolvedOutputDir, "registry.json"),
    JSON.stringify(registryIndex, null, 2)
  )
  console.log("Built: registry.json")
  console.log(`\nRegistry built successfully! ${flattenedItems.length} items.`)

  return {
    items: flattenedItems,
    outputDir: resolvedOutputDir
  }
}

if (process.argv[1] && resolve(process.argv[1]) === __filename) {
  buildRegistry()
}
