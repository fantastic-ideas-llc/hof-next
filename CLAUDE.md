# Hall of Flowers Monorepo

Bun workspace monorepo with two Next.js 16 apps and shared packages.

## Structure

- `apps/marketing` — Marketing site + Sanity Studio at `/cms` (hallofflowers.com)
- `apps/exhibitors` — Exhibitor manual docs site with fumadocs + Sanity Studio at `/cms` (exhibitors.hallofflowers.com)
- `packages/sanity` — Shared Sanity schema, queries, types, desk structure
- `packages/fonts` — BrownPro + BrownStd brand fonts (woff2)

## Commands

```bash
bun run dev:marketing      # Start marketing app (port 3000)
bun run dev:exhibitors     # Start exhibitors app (port 3001)
bun run build              # Build both apps
bun run lint               # Biome check
bun run format             # Biome auto-fix
```

## Sanity

- Project ID: `dxevsfa3`
- Dataset: `production`
- Both apps share the same schema from `@hof/sanity`
- Desk structure is exported from `@hof/sanity` and used by both apps

## Fumadocs CLI

The exhibitors app uses fumadocs for its docs layout. Use the CLI to add or customize components.

```bash
# Initialize CLI config
bun x @fumadocs/cli

# Add components (interactive picker)
bun x @fumadocs/cli add

# Add specific components
bun x @fumadocs/cli add banner files

# Customize fumadocs layouts
bun x @fumadocs/cli customise

# Generate file tree component from a directory
bun x @fumadocs/cli tree ./my-dir ./output.tsx
bun x @fumadocs/cli tree ./my-dir ./output.mdx
```

The CLI fetches the latest component source from the fumadocs GitHub repo and transforms import paths automatically. Components are always up-to-date at install time.

Docs: https://www.fumadocs.dev/docs/cli

## Deployment

Both apps deploy to Vercel from this repo:
- `hof-marketing` — root: `apps/marketing`
- `hof-exhibitors` — root: `apps/exhibitors`

Pushes to `main` auto-deploy both projects.
