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

## Commit Message Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/). All commit messages are validated by commitlint via a husky `commit-msg` hook.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | When to use                                             |
| ---------- | ------------------------------------------------------- |
| `feat`     | A new feature or capability                             |
| `fix`      | A bug fix                                               |
| `docs`     | Documentation-only changes                              |
| `style`    | Formatting, whitespace, missing semicolons, etc.        |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf`     | Performance improvement                                 |
| `test`     | Adding or updating tests                                |
| `ci`       | CI/CD pipeline changes                                  |
| `chore`    | Maintenance (dependencies, configs, tooling)            |
| `revert`   | Reverting a previous commit                             |

### Scopes (optional)

Use one of: `web`, `admin`, `database`, `ui`, `types`, `eslint-config`, `tailwind-config`, `e2e`, `deps`

Omit the scope when a change spans multiple packages or is repo-wide.

### Examples

```
feat(web): add volunteer role anchor links on home page
fix(database): handle null values in content query
chore(deps): update turbo to v2.9
docs: update README with deployment instructions
ci: add typecheck to GitHub Actions workflow
```

### Changelog

Generate a changelog on demand:

```sh
pnpm changelog
```
