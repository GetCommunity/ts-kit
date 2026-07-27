# Code Standards

This project uses **ESLint** for static analysis and **Prettier** for consistent formatting.

## Quick Reference

- **Format code**: `pnpm format`
- **Check formatting**: `pnpm format:check`
- **Lint code**: `pnpm lint`

## Guidelines

- Keep TypeScript type-safe and prefer `unknown` over `any`.
- Use `const` by default and choose descriptive names.
- Keep functions and components focused.
- Follow semantic HTML and accessibility best practices.
- Use Solid conventions such as `class` and `for` attributes.
- Do not commit generated build output.

Run `pnpm format` and `pnpm lint` before committing.
