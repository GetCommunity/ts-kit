# Get Community, Inc. TypeScript Development Registry

## Getting Started

- Uses a `registry.json` file in the root of this repo to define registry items and their files/deps/etc.
- The `pnpm r:build` command builds the public registry using `shadcn build` under the hood.
- The registry items are served as static files under `public/r/[name].json`.
- All registry item must be compatible with the `shadcn` CLI.

## Usage

### Validate Registry

```bash
pnpm dlx shadcn@latest registry validate getcommunity/ts-kit
```

### `list` Search Registry

```bash
pnpm dlx shadcn@latest list getcommunity/ts-kit
```

```bash
pnpm dlx shadcn@latest search getcommunity/ts-kit --query config-biome
```

```bash
pnpm dlx shadcn@latest search getcommunity/ts-kit --query config-prettier
```

```bash
pnpm dlx shadcn@latest search getcommunity/ts-kit --query config-ts
```

### `view` Registry Item by Name

```bash
pnpm dlx shadcn@latest view getcommunity/ts-kit/config-prettier-app
```

### `add` Registry Item by Name

```bash
pnpm dlx shadcn@latest add getcommunity/ts-kit/config-prettier-app
```

## Development

Visit the [shadcn documentation](https://ui.shadcn.com/docs/registry) to view the full documentation.

### Installation

```bash
# Install dependencies
pnpm install

# Start development server (WIP)
pnpm dev
```

The frontend uses TanStack Start's file-based Solid Router. Routes live in
`src/routes`, the router and its Query client are created in `src/router.tsx`,
and server-rendered TanStack Query data is dehydrated and hydrated through the
router integration.

### Building the Registry

Build the static registry JSON files with the native shadcn build command:

```bash
pnpm r:build
```

This resolves the included source registries into `public/r`. TanStack Start
serves those generated files at `/r/[name].json`, including the complete catalog
at `/r/registry.json`.

### Code Quality

The project uses ESLint for linting and Prettier for formatting. Their direct
configuration lives in `eslint.config.js` and `prettier.config.js`:

```bash
pnpm lint
pnpm typecheck
pnpm format:check
pnpm format
```

### Testing

The project uses vitest to test the registry.json files and to test individual registry items.

```bash
pnpm test
pnpm test:coverage
```
