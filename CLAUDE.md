# GPAMN

## Commands

This is a pnpm + Turborepo monorepo. Always run commands from the repo root.

- `pnpm build` — Build all packages
- `pnpm dev` — Start dev servers
- `pnpm lint` — Lint all packages
- `pnpm test` — Run all tests
- `pnpm typecheck` — Type-check all packages
- `pnpm format` / `pnpm format:check` — Format code with Prettier

### Filtered commands

Use `pnpm --filter <package>` to target a specific app/package:

- `pnpm --filter web build` — Build only the web app
- `pnpm --filter web test` — Run tests for the web app
- `pnpm --filter @repo/database db:generate` — Generate database client

### Database

- `pnpm db:generate` — Generate Prisma/Drizzle client
- `pnpm db:migrate` — Run migrations
- `pnpm db:push` — Push schema changes
- `pnpm db:studio` — Open database studio

### E2E tests

- `pnpm e2e` — Run end-to-end tests
