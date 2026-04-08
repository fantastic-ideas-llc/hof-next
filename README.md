# Hall of Flowers Web

Monorepo for the Hall of Flowers marketing site and exhibitor docs site.

## Setup

```powershell
bun install
```

Create local env files from the examples:

```powershell
Copy-Item apps\marketing\.env.local.example apps\marketing\.env.local
Copy-Item apps\exhibitors\.env.local.example apps\exhibitors\.env.local
```

The exhibitors app will fall back to mock conference content until real Sanity env vars are set.

## Apps

- `apps/marketing` -> `hallofflowers.com`
- `apps/exhibitors` -> `exhibitors.hallofflowers.com`

## Packages

- `packages/sanity` -> shared Sanity schema, queries, and content model helpers

## Common Commands

```powershell
bun run dev:marketing
bun run dev:exhibitors
bun run build
bun run lint
```
