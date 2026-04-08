# Hall of Flowers — Exhibitor Docs Site

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Next.js 16.2 documentation site for Hall of Flowers exhibitors, powered by Sanity CMS, Fumadocs UI, Bun, and Biome.

**Architecture:** Single Next.js app that pulls exhibitor documentation from a shared Sanity dataset. The conference is the central entity — all content (docs, booth types, FAQs) belongs to a specific conference. Multiple conferences can be active simultaneously. The Sanity dataset is shared with a future marketing site at `hallofflowers.com`.

**Tech Stack:** Next.js 16.2.2, React 19, fumadocs-core/ui 16.7.10, Sanity 5, @sanity/client 7, next-sanity 9, Tailwind CSS 4, Bun, Biome 2.4, TypeScript 5.8, Shiki 3

---

## Part 1: Design

### Problem

Hall of Flowers runs cannabis trade conferences in multiple cities (Ventura CA, Santa Rosa CA, New York NY). Each conference has its own exhibitor documentation because regulations, venue layouts, booth options, and logistics differ by location and jurisdiction.

Currently the exhibitor manual lives on Squarespace at `exhibitors.hallofflowers.com`. It's static, hard to update, and not connected to any shared data system. There's also a marketing site being built separately for ticket sales and event promotion.

Both sites need to pull from the same source of truth — a shared Sanity CMS dataset.

### Goals

1. Build a modern exhibitor documentation site using Next.js 16.2 + Fumadocs
2. Content managed in Sanity CMS, shared dataset with the marketing site
3. Support multiple conferences with independent documentation per conference
4. Multiple conferences can be active simultaneously (e.g., selling tickets to NYC and Santa Rosa at the same time)
5. Use Bun (package manager) and Biome (lint/format)

### Conference is the central entity

Everything hangs off the conference. A conference owns its own set of exhibitor docs, booth types, FAQs, and contacts. This is critical because cannabis regulations vary by state — California docs are different from New York docs.

```
Conference
  ├── Event data (name, dates, venue, location)
  ├── Status (draft / active / archived)
  ├── Contacts (references to master staff roster)
  ├── Exhibitor Docs (many) — rules, guidelines, compliance
  ├── Booth Types (many) — specs, pricing, images
  └── FAQs (many) — conference-specific questions
```

### Conference status lives on the conference itself

Each conference controls its own visibility via a `status` field:

- **draft** — Team is building content. Not visible on any site.
- **active** — Live. Visible on exhibitor site and marketing site. Selling tickets.
- **archived** — Conference is over. Hidden from public sites but data preserved in Sanity.

This allows multiple conferences to be active at the same time, which is required when events overlap in their sales cycles.

```
NYC Fall 2026        → active
Santa Rosa Nov 2026  → active
Ventura Spring 2026  → archived
Miami Winter 2027    → draft
```

### Exhibitor site shows multiple active conferences

When more than one conference is active, the exhibitor site presents a conference picker. The exhibitor selects which conference they're attending and sees that conference's documentation.

URL structure:
```
exhibitors.hallofflowers.com/
  → Landing page or conference picker (shows all active conferences)

exhibitors.hallofflowers.com/[conference-slug]/
  → Docs index for that conference

exhibitors.hallofflowers.com/[conference-slug]/[doc-slug]
  → Individual doc page
```

### One Sanity project, one dataset

Both sites connect to the same Sanity project and dataset. Schema types are namespaced by concern:

**Shared (both sites use):**
- `conference` — dates, venue, location, status, contacts
- `staff` — master roster of contacts by department
- `faq` — with audience field (exhibitor / attendee / both)

**Exhibitor site:**
- `exhibitorDoc` — manual pages, linked to a conference
- `boothType` — booth specs, linked to a conference

**Marketing site (future):**
- `marketingPage`, `speaker`, `ticket`, etc.

### Content reuse between conferences

Some exhibitor docs are similar across conferences (general setup instructions, common rules). Rather than building a template/inheritance system, the approach is **duplicate and edit** — copy last conference's docs to the new one and adjust. This is simpler and avoids complexity, especially since state-specific cannabis regulations make most docs meaningfully different anyway.

### Decisions made

- **Staff model** — Master staff roster, each conference references its contacts from the list via a reference array. No duplication.
- **Sanity Studio location** — Lives on the marketing site at `hallofflowers.com/cms`. Both sites share the same Sanity project/dataset, editors go to one place. This exhibitor site is read-only (no embedded studio).
- **Conference picker UX** — When multiple conferences are active, the exhibitor site needs a way to switch between them. Exact UX TBD — could be a landing page with conference cards (location + image), a toggle/dropdown in the fumadocs sidebar, or a modal. Will prototype during implementation.

### Open questions

1. **Marketing site multi-conference display** — When two conferences are active, how does the marketing site present them? Shared homepage with both? Separate landing pages? TBD.
2. **Conference picker exact UX** — Landing page with cards? Sidebar toggle? Modal? Need to prototype to decide.
3. **Single active conference behavior** — If only one conference is active, skip the picker and go straight to docs? Or always show it for consistency?

---

## Part 2: Sanity Schema Design

### conference

| Field | Type | Notes |
|-------|------|-------|
| name | string | "Hall of Flowers — NYC Fall 2026" |
| slug | slug | URL-friendly, e.g. "nyc-fall-2026" |
| status | string (enum) | draft / active / archived |
| startDate | datetime | |
| endDate | datetime | |
| venue.name | string | |
| venue.address | text | |
| venue.city | string | |
| venue.state | string | |
| venue.zip | string | |
| venue.mapUrl | url | Google Maps link |
| hours | array of objects | day, open, close |
| contacts | array of references → staff | Conference-specific contacts picked from master roster |
| description | blockContent | |

### exhibitorDoc

| Field | Type | Notes |
|-------|------|-------|
| title | string | |
| slug | slug | |
| description | text | Short summary |
| conference | reference → conference | Which conference this belongs to |
| category | string (enum) | show-info, booth-type, cannabis-guidelines, video-guides |
| sortOrder | number | Controls sidebar ordering |
| body | blockContent | Rich text content |
| publishedAt | datetime | |

### boothType

| Field | Type | Notes |
|-------|------|-------|
| name | string | Craft Stand, Boutique, Arena, etc. |
| slug | slug | |
| conference | reference → conference | |
| description | text | |
| dimensions | string | e.g. "10x10" |
| price | number | Starting price |
| includes | array of strings | What's included |
| images | array of images | |
| specs | blockContent | Detailed specifications |

### faq

| Field | Type | Notes |
|-------|------|-------|
| question | string | |
| answer | blockContent | |
| conference | reference → conference | |
| audience | string (enum) | exhibitor / attendee / both |
| sortOrder | number | |

### staff

| Field | Type | Notes |
|-------|------|-------|
| name | string | |
| role | string | |
| department | string (enum) | retail-relations, marketing, cannabis-guidelines, sales, onboarding, operations |
| email | string | |
| phone | string | |
| photo | image | |

Staff is a master roster — the same people work across conferences. Each conference picks its contacts from the master list via a reference array on the conference schema. No duplication.

### blockContent

Rich text array supporting: styled text (normal, h2, h3, h4, blockquote), bold/italic/code marks, links, images with alt/caption, callouts (info/warn/error/tip), code blocks with syntax highlighting.

---

## Part 3: Implementation Plan

### Task 1: Initialize project with Bun

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.gitignore`

**Step 1: Initialize git repo**

```bash
cd C:/Users/brenn/Documents/GitHub/hof-exhibitors-next
git init
```

**Step 2: Create package.json**

```json
{
  "name": "hof-exhibitors-next",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "format": "biome check --write .",
    "lint:ci": "biome ci ."
  },
  "dependencies": {
    "fumadocs-core": "^16.7.10",
    "fumadocs-ui": "^16.7.10",
    "@fumadocs/tailwind": "^0.0.3",
    "next": "^16.2.2",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "@sanity/client": "^7.20.0",
    "@sanity/image-url": "^1.1.0",
    "@portabletext/react": "^3.2.0",
    "next-sanity": "^9.8.0",
    "shiki": "^3.0.0",
    "tailwindcss": "^4.1.0",
    "@tailwindcss/postcss": "^4.1.0"
  },
  "devDependencies": {
    "@biomejs/biome": "^2.4.10",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.8.0",
    "postcss": "^8.5.0"
  }
}
```

Note: `sanity` (the studio package) is NOT included — studio lives on the marketing site. This site only needs `@sanity/client` for read-only data fetching.

**Step 3: Install dependencies**

```bash
bun install
```

**Step 4: Create tsconfig.json**

Standard Next.js 16 TypeScript config with `@/*` path alias.

**Step 5: Create .gitignore**

Standard Next.js gitignore + `.env.local`, `node_modules`, `.next`, `.turbo`.

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: initialize project with bun, next 16.2, fumadocs, sanity"
```

---

### Task 2: Configure Biome

**Files:**
- Create: `biome.json`

**Step 1: Create biome.json**

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.10/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab",
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always"
    }
  },
  "files": {
    "ignore": [".next", "node_modules", "dist"]
  }
}
```

**Step 2: Verify biome works**

```bash
bun run lint
```

**Step 3: Commit**

```bash
git add biome.json
git commit -m "chore: configure biome for linting and formatting"
```

---

### Task 3: Set up Next.js app structure with Tailwind

**Files:**
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `app/global.css` (Tailwind imports + fumadocs styles)
- Create: `app/layout.tsx` (root layout with fumadocs RootProvider)
- Create: `app/layout.config.tsx` (fumadocs shared layout config)
- Create: `app/(home)/layout.tsx`
- Create: `app/(home)/page.tsx` (landing page / conference picker)

**Step 1: Create next.config.ts**

Minimal Next.js config.

**Step 2: Create postcss.config.mjs**

Tailwind CSS 4 PostCSS plugin.

**Step 3: Create global.css**

Import Tailwind and fumadocs-ui preset styles.

**Step 4: Create root layout.tsx**

RootProvider from fumadocs-ui, html/body structure, font setup.

**Step 5: Create layout.config.tsx**

Shared navigation config: site title "Hall of Flowers — Exhibitor Manual".

**Step 6: Create homepage**

Landing page that lists active conferences. This is the conference picker entry point. For now, a simple page that queries active conferences from Sanity and links to `/[conference-slug]/`.

**Step 7: Verify dev server starts**

```bash
bun run dev
```

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: set up next.js app structure with tailwind and fumadocs"
```

---

### Task 4: Set up Sanity client and environment

**Files:**
- Create: `.env.local.example`
- Create: `sanity/env.ts` (public env vars)
- Create: `sanity/lib/client.ts` (Sanity client)
- Create: `sanity/lib/image.ts` (image URL builder)
- Create: `sanity/lib/queries.ts` (GROQ queries)

**Step 1: Create .env.local.example**

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-04-03
SANITY_API_READ_TOKEN=
```

**Step 2: Create sanity/env.ts**

Export typed public env vars from `process.env`.

**Step 3: Create sanity/lib/client.ts**

Initialize `@sanity/client` with CDN enabled. Read-only — no studio, no stega/visual editing (that's on the marketing site).

**Step 4: Create sanity/lib/image.ts**

Image URL builder helper using `@sanity/image-url`.

**Step 5: Create sanity/lib/queries.ts**

GROQ queries:
- `ACTIVE_CONFERENCES_QUERY` — all conferences with status "active"
- `CONFERENCE_BY_SLUG_QUERY` — single conference by slug with contacts expanded
- `DOCS_FOR_CONFERENCE_QUERY` — all exhibitor docs for a conference, ordered by category + sortOrder
- `DOC_PAGE_QUERY` — single doc by slug + conference, with body and TOC headings
- `BOOTHS_FOR_CONFERENCE_QUERY` — booth types for a conference
- `FAQS_FOR_CONFERENCE_QUERY` — FAQs for a conference (audience: exhibitor or both)
- `DOCS_SEARCH_QUERY` — search docs by title within a conference

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: set up sanity client, queries, and environment config"
```

---

### Task 5: Create Sanity schemas

**Files:**
- Create: `sanity/schemaTypes/blockContent.ts`
- Create: `sanity/schemaTypes/conference.ts`
- Create: `sanity/schemaTypes/staff.ts`
- Create: `sanity/schemaTypes/exhibitorDoc.ts`
- Create: `sanity/schemaTypes/boothType.ts`
- Create: `sanity/schemaTypes/faq.ts`
- Create: `sanity/schemaTypes/index.ts` (schema registry)

These schemas are the source of truth for the Sanity dataset. They'll be used by both this site and the marketing site. See Part 2 for full field definitions.

Key relationships:
- `conference.contacts` → references `staff[]`
- `exhibitorDoc.conference` → references `conference`
- `boothType.conference` → references `conference`
- `faq.conference` → references `conference`

**Step 1:** Create each schema file per the definitions in Part 2.

**Step 2:** Create index.ts that exports all schema types as an array.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add sanity schemas for conference, exhibitor docs, booths, faq, staff"
```

---

### Task 6: Build conference-scoped docs pages

**Files:**
- Create: `app/[conference]/layout.tsx` (DocsLayout with sidebar from Sanity, scoped to conference)
- Create: `app/[conference]/page.tsx` (docs index for a conference)
- Create: `app/[conference]/[slug]/page.tsx` (individual doc page)
- Create: `app/[conference]/[slug]/renderer.tsx` (Portable Text → fumadocs components)
- Create: `components/code.tsx` (code block with Shiki highlighting)

**Step 1: Create Portable Text renderer**

Map Sanity block types to fumadocs components:
- Headings → fumadocs `Heading` (with IDs for TOC)
- Images → responsive images via Sanity image URL builder
- Code → Shiki-highlighted code blocks
- Callouts → fumadocs `Callout` component

**Step 2: Create conference docs layout**

Use fumadocs `DocsLayout` with sidebar navigation built from Sanity query results for the current conference. Categories as sections: Show Info, Booth Types, Cannabis Guidelines, Video Guides.

**Step 3: Create docs index page**

List all documentation pages for this conference, grouped by category.

**Step 4: Create individual doc page**

Fetch doc by slug + conference, render with fumadocs `DocsPage`, `DocsBody`, auto-generate TOC from headings.

**Step 5: Create code component**

Shiki syntax highlighting with light/dark theme support.

**Step 6: Verify pages render**

```bash
bun run dev
```

Navigate to `/nyc-fall-2026/` — should see layout (empty content until Sanity has data).

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: build conference-scoped docs pages with fumadocs layout"
```

---

### Task 7: Add search functionality

**Files:**
- Create: `app/api/search/route.ts` (search API endpoint)
- Modify: `app/layout.config.tsx` (enable search in nav)

**Step 1: Create search API route**

Endpoint that accepts a query string + conference slug, queries Sanity with `DOCS_SEARCH_QUERY`, and returns results in fumadocs search format.

**Step 2: Enable search in layout config**

Configure fumadocs search dialog to hit the API route with the current conference context.

**Step 3: Verify search works**

```bash
bun run dev
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add conference-scoped search via sanity"
```

---

### Task 8: Final verification

**Step 1: Run biome check**

```bash
bun run lint
bun run format
```

**Step 2: Verify build succeeds**

```bash
bun run build
```

**Step 3: Verify dev server works end-to-end**

```bash
bun run dev
```

- `/` — conference picker / landing page loads
- `/[conference-slug]/` — docs layout renders
- `/[conference-slug]/[doc-slug]` — individual doc renders

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: final cleanup and verification"
```

---

## Content Structure (for Sanity Studio)

Once the site is running, create these categories of content in Sanity:

| Category | Example Pages |
|---|---|
| Show Info | Rules & Regulations, Insurance Requirements, Exhibitor Passes, Solicitor Licenses, Pricing Updates |
| Booth Types | Craft Stands, Boutiques, Arenas, Outdoor Exhibitions |
| Cannabis Guidelines | Compliance, Product Display Rules, Sampling Policies |
| Video Guides | Setup Instructions, Teardown, Operations |
| FAQs | Common exhibitor questions |

Staff contacts are managed in the master staff list and assigned per conference.

## Environment Setup

Before running, you need to:
1. Create a Sanity project at sanity.io/manage (or reuse the one from the marketing site)
2. Copy `.env.local.example` to `.env.local`
3. Fill in `NEXT_PUBLIC_SANITY_PROJECT_ID` and `SANITY_API_READ_TOKEN`
4. Run `bun run dev`
