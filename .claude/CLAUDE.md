# Code Standards

This project uses **Biome** for both formatting and linting (Prettier and ESLint have
been retired here — see `biome.jsonc`, which composes the shared
`registry/config/biome/biome.preset.solid-tailwind-lib.jsonc` fragments: `biome.base.jsonc`
+ `biome.solid.jsonc` + `biome.tailwind.jsonc` + `biome.lib.jsonc`).

## Quick Reference

- **Format code**: `pnpm format`
- **Check formatting**: `pnpm format:check`
- **Lint code**: `pnpm lint` (`pnpm lint:fix` to apply safe fixes)
- **Format + lint together**: `pnpm check` (`pnpm check:write` to apply fixes)

When adding a local ignore to `biome.jsonc`'s `files.includes`, never add a bare `"**"`
entry — one already comes from the extended base config, and a second one re-includes
everything below it (gitignore-style, last match wins), silently undoing prior
exclusions. Only add specific `!pattern` entries.

## Guidelines

- Keep TypeScript type-safe and prefer `unknown` over `any`.
- Use `const` by default and choose descriptive names.
- Keep functions and components focused.
- Follow semantic HTML and accessibility best practices.
- Use Solid conventions such as `class` and `for` attributes.
- Do not commit generated build output.

Run `pnpm check` before committing.
