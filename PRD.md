# Hall of Flowers — Product Requirements Document

## Overview

Hall of Flowers is the world's premier cannabis trade show. Since 2018, they've hosted events across California and internationally. The show rotates between recurring cities — currently Ventura, Santa Rosa, and New York City — with multiple shows per year.

The digital presence consists of two primary surfaces:

1. **Marketing Site** (`hallofflowers.com`) — public-facing brand site with pages for multiple audiences: exhibitors, retailers, media, and general attendees
2. **Exhibitor Portal** (`exhibitors.hallofflowers.com`) — operational information hub for exhibitors, scoped per conference/location

Both sites share a single Sanity CMS workspace with a unified content model. The architecture replaces the current Webflow site, allowing content editors to manage all conference data from one place, toggle which conference is "active," and reuse historical data when a conference returns to a familiar city.

### Current Site Structure (Webflow — being replaced)

From the live site at hallofflowers.com:

**Marketing site pages:**
- Homepage — hero focused on primary conference, lists all upcoming shows (Ventura Mar 18-19, Santa Rosa Sep 10-11, NYC Oct 8-9)
- `/exhibitors` — exhibitor application info
- `/retailers` — retailer application + confirmed retailer list (licensed buyers get free tickets)
- `/bp` (BLUEPRINT) — dedicated manufacturing/equipment sub-program on the show floor
- `/media` — press pass application + event photo gallery
- `/subscribe` — newsletter signup with location-based preference (All, California, NY)
- `/venturatickets` — conference-specific ticket page

**Exhibitor portal pages (per conference):**
- Homepage — "new this season" callouts, key dates, load-in schedule
- Show Info (rules, insurance, exhibitor passes, solicitors licenses, marketing/PR)
- Booth Types (Craft Stands, Boutiques/Boutique Plus, Arenas/Mini Arenas, Outdoor Exhibitions)
- Video Guide (per booth type)
- Cannabis Guidelines
- Navigating Cannabis Sales
- FAQs (6 categories: payment, booth setup, passes, tradeshow, cannabis, misc)
- Contact directory organized by department (Retail Relations, Marketing, Cannabis Guidelines, Exhibitor Sales, Onboarding)

**Design language:** Orange accent (#ff914d), clean sans-serif typography (Helvetica Neue), light theme, professional B2B aesthetic. Subscription modal on homepage load.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| CMS | Sanity (v3, hosted Studio) |
| Hosting | Vercel (two deployments — one per subdomain) |
| Language | TypeScript |
| Forms | Zoho CRM (Phase 1: embed, Phase 2: API integration) |

---

## Content Modeling Principles

The following principles from structured content modeling are applied throughout this document:

1. **Content is data, not pages** — Field names describe meaning, not appearance. The frontend decides how to render.
2. **Single source of truth** — Shared content (venues, contacts, CTAs) is referenced, not duplicated.
3. **Reference over embedding** — Content with its own lifecycle or reuse potential gets its own document type.
4. **Shared object types** — Repeated structures (CTAs, SEO fields) are defined once and reused across schemas.
5. **Avoid mega-documents** — Large documents with many unrelated fields are split into focused document types.

---

## Content Model (Sanity)

### Shared Object Types

These are reusable object type definitions used across multiple document types and components.

#### `cta` (object type)
Reusable call-to-action. Used in Hero, Two-Up, Copy Block, and anywhere a button is needed.

| Field | Type | Notes |
|-------|------|-------|
| `label` | string | Button text |
| `url` | string | Destination URL (internal path or external link) |
| `variant` | string (enum) | `primary`, `secondary` — semantic intent, not visual style |

#### `seoFields` (object type)
Shared SEO metadata. Embedded in `page`, `exhibitorPage`, and any routable document.

| Field | Type | Notes |
|-------|------|-------|
| `metaTitle` | string | Page title for search engines |
| `metaDescription` | text | Page description for search engines |
| `ogImage` | image | Open Graph share image |

#### `dateRange` (object type)
Reusable labeled date range for schedules.

| Field | Type | Notes |
|-------|------|-------|
| `label` | string | e.g. "Day 1 — Setup" |
| `startDate` | datetime | |
| `endDate` | datetime | |

### Core Documents

#### `conference`
The central hub document. Contains core identity and scheduling data for a conference. Detailed exhibitor content (rules, FAQ, booth info, etc.) lives in `exhibitorPage` documents that reference this conference — not embedded here.

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | e.g. "Hall of Flowers Ventura 2026" |
| `slug` | slug | URL-friendly identifier |
| `location` | reference → `venue` | The venue/city for this conference |
| `startDate` | date | Show start |
| `endDate` | date | Show end |
| `status` | string (enum) | `draft`, `upcoming`, `active`, `completed` — lifecycle state of this conference |
| `tagline` | string | Short promotional line (e.g. "California's Premier Cannabis Event") |
| `description` | portableText | Overview copy about this conference |
| `heroImage` | image | Primary promotional image for this conference |
| `loadInSchedule` | array of `dateRange` | Pre-show load-in schedule |
| `showSchedule` | array of `dateRange` | Show week schedule with callouts |
| `contacts` | array of reference → `contact` | Show-specific contacts |
| `urlPrefix` | slug | Short city prefix for when this conference is in secondary/pre-sale mode (e.g. `ny`, `santa-rosa`). Used to generate prefixed page slugs. |

**Why exhibitor details are NOT embedded here:** Rules, insurance, guidelines, FAQ, booth types, and passes are all substantial content blocks that change independently, benefit from rich editing (page builder), and would bloat this document. They live as `exhibitorPage` documents scoped to this conference, giving editors focused editing contexts and enabling the page builder for layout flexibility. The Conference Info Block component (see below) can still pull structured data from these pages.

#### `venue`
Reusable location records. When a conference returns to a city, it references the same venue.

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | e.g. "Ventura County Fairgrounds" |
| `city` | string | e.g. "Ventura" |
| `state` | string | e.g. "CA" |
| `address` | string | Full street address |
| `coordinates` | geopoint | For maps if needed |
| `image` | image | Venue photo |

#### `contact`
Reusable contact records shared across conferences. On the current site, the exhibitor portal lists contacts by department (Retail Relations, Marketing, Cannabis Guidelines, Exhibitor Sales, Onboarding).

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Full name |
| `role` | string | e.g. "Show Manager" |
| `department` | string (enum) | `retail-relations`, `marketing`, `cannabis-guidelines`, `exhibitor-sales`, `onboarding`, `operations`, `general` |
| `email` | string | |
| `phone` | string | Optional |
| `image` | image | Headshot (optional) |

#### `participantList`
A confirmed list of retailers or exhibitors for a specific conference. Stored as a standalone document so editors can manage these lists independently — they change frequently as new participants get confirmed and can have hundreds of entries.

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | e.g. "Confirmed Retailers for Ventura 2026" |
| `conference` | reference → `conference` | Which conference this list belongs to |
| `listType` | string (enum) | `retailer`, `exhibitor` |
| `entries` | array of `{ name: string }` | Business names. Frontend sorts and groups alphabetically — editors don't need to worry about ordering. |

**Why a standalone document instead of embedding in the conference:** These lists can have hundreds of entries, get updated frequently as confirmations come in, and are rendered on a single page. Keeping them as their own document means editors have a focused editing context and the conference document stays lean. One document per list per conference.

In Sanity Studio, these can be organized under the conference in the desk structure: `Ventura 2026 → Confirmed Retailers / Confirmed Exhibitors`.

#### `page`
Page-builder document for the marketing site. Pages can optionally be scoped to a conference for organizational purposes in Sanity, but URL structure is driven by the slug — not the conference reference.

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Internal page name |
| `slug` | slug | Full URL path. Generic pages: `tickets`, `retailers`. Pre-sale pages: `ny/tickets`, `ny/pre-sale`. |
| `conference` | reference → `conference` | **Optional.** Used for organizing/filtering pages in Sanity Studio (e.g. "show me all pages for Ventura 2026"). Does NOT affect the URL — the slug controls that. |
| `seo` | `seoFields` | Shared SEO metadata object |
| `content` | array of page builder components | See Page Builder Components below |

**URL strategy (generic by default, prefix only for secondary conference):**
- Primary conference pages live at root-level generic URLs: `/tickets`, `/retailers`, `/exhibitors`
- These accumulate SEO authority over time — Google sees `/tickets` consistently updated, ranking for "hall of flowers tickets" permanently
- Secondary/pre-sale conference pages use a short city prefix: `/ny/tickets`, `/ny/pre-sale`, `/santa-rosa/schedule`
- When a secondary conference becomes primary, 301 redirect its prefixed URLs to the root (e.g. `/ny/tickets` → `/tickets`) to transfer SEO value
- General site pages (about, media, subscribe) are always at the root: `/about`, `/media`, `/subscribe`

#### `exhibitorPage`
Page-builder document for the exhibitor portal. Scoped to a conference. This is where exhibitor-specific content lives — rules, insurance, FAQ, booth types, guidelines, passes. Each is its own page with the full page builder, rather than being crammed into the conference document.

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Internal page name |
| `slug` | slug | URL path within exhibitor site |
| `conference` | reference → `conference` | Which conference this page belongs to |
| `category` | string (enum) | Semantic tag for page type: `show-info`, `rules`, `insurance`, `passes`, `solicitors-license`, `marketing-pr`, `booth-info`, `video-guide`, `cannabis-guidelines`, `cannabis-sales`, `faq`, `general`. Matches current exhibitor portal structure. Enables the Conference Info Block to query specific pages by category. |
| `seo` | `seoFields` | Shared SEO metadata object |
| `content` | array of page builder components | Same component library as marketing site |

#### `navigation`
Site navigation configuration. The marketing nav currently shows nav links, social icons, a conference date bar, and multiple CTA buttons. The exhibitor nav shows a categorized sidebar with sub-pages.

| Field | Type | Notes |
|-------|------|-------|
| `site` | string (enum) | `marketing` or `exhibitor` |
| `items` | array of nav items | `{ label, link, children[] }` — supports one level of nesting |
| `ctaButtons` | array of `cta` | Multiple CTA buttons in nav (e.g. Tickets, Retailer App, Exhibitor App) |
| `socialLinks` | array of `{ platform: string, url: string }` | Social media icons in nav (Instagram, LinkedIn, X, YouTube) |
| `showConferenceDates` | boolean | Whether to display the upcoming conference date bar in the nav |

#### `footer`
Footer configuration.

| Field | Type | Notes |
|-------|------|-------|
| `site` | string (enum) | `marketing` or `exhibitor` |
| `columns` | array of `{ heading: string, links: array of { label, url } }` | Footer link columns |
| `socialLinks` | array of `{ platform: string, url: string }` | Social media links |
| `legalText` | portableText | Copyright, disclaimers |

#### `siteSettings`
Global settings singleton. This is the "control panel" for editors to switch what the site is focused on.

| Field | Type | Notes |
|-------|------|-------|
| `homepage` | reference → `page` | **The page that renders at `/`.** Editors swap this reference to change the homepage. Could point to a single-conference hero page, a dual-conference split page, or a generic brand page. |
| `activeConference` | reference → `conference` | The primary conference — drives the nav badge, exhibitor portal, and default conference context. |
| `secondaryConference` | reference → `conference` | Optional. When set, indicates a second conference is being promoted (e.g. pre-sale). Components can reference this. |
| `logo` | image | Site logo |
| `logoMark` | image | Icon-only logo variant |
| `defaultSeo` | `seoFields` | Fallback SEO metadata (shared object type) |

**How the homepage swap works:**

The editor creates multiple page documents — for example:
- "Homepage — Ventura Focus" (hero with Ventura video, Ventura CTAs)
- "Homepage — Dual Show" (split hero promoting both Ventura + New York)
- "Homepage — Generic Brand" (evergreen brand page)

To change the homepage, the editor just updates the `homepage` reference in `siteSettings` to point to a different page. The old page still exists and can be swapped back at any time. This is a single-field change — no rebuilding pages, no content loss.

**Nav behavior with dual conferences:**

When `secondaryConference` is set, the nav can display both:
```
[Logo] [Nav Items...] [Ventura · Jun 15-17] [NY Pre-Sale →] [CTA]
```
The secondary conference shows as a subtle callout or link. When only one conference is active, the nav simplifies to just the primary badge.

---

## Page Builder Components

These components are available in the `content` array of both `page` and `exhibitorPage` documents. All components share an optional `componentId` field for anchor linking.

### 1. Hero

Full-width hero section with media background.

| Field | Type | Notes |
|-------|------|-------|
| `backgroundType` | string (enum) | `image`, `video` |
| `backgroundImage` | image | Used when `backgroundType` is `image` |
| `backgroundVideo` | file (mp4) | Used when `backgroundType` is `video` |
| `backgroundVideoPoster` | image | Fallback frame for video |
| `overlayStrength` | string (enum) | `none`, `light`, `medium`, `heavy` — controls text legibility over media (frontend maps to opacity) |
| `body` | portableText | Headline, subtext — supports H1, bold, italic, links |
| `textAlignment` | string (enum) | `left`, `center` |
| `ctas` | array (max 2) of `cta` | Call-to-action buttons (uses shared CTA object type) |

**Frontend behavior:** Background video autoplays muted with loop. Falls back to poster image on mobile or slow connections. Portable text renders as the main content block above CTAs.

### 2. Copy Block

General-purpose rich text section.

| Field | Type | Notes |
|-------|------|-------|
| `body` | portableText | Full rich text — headings, lists, links, bold, italic, images inline |
| `width` | string (enum) | `narrow`, `medium`, `wide`, `full` — semantic content width (frontend maps to breakpoints) |
| `textAlignment` | string (enum) | `left`, `center` |

### 3. Media Embed

Video content — supports both YouTube and uploaded video files.

| Field | Type | Notes |
|-------|------|-------|
| `mediaType` | string (enum) | `youtube`, `upload` |
| `youtubeUrl` | url | YouTube URL (when `mediaType` is `youtube`) |
| `videoFile` | file (mp4) | Uploaded video (when `mediaType` is `upload`) |
| `posterImage` | image | Thumbnail/poster |
| `caption` | string | Optional caption below video |
| `width` | string (enum) | `medium`, `wide`, `full` — semantic content width |

### 4. Two-Up (Split Content)

Side-by-side layout with image on one side and rich text on the other.

| Field | Type | Notes |
|-------|------|-------|
| `image` | image | The media side |
| `imagePosition` | string (enum) | `left`, `right` |
| `body` | portableText | Rich text content — headings, body, links, bold/italic |
| `ctas` | array (max 2) of `cta` | Optional CTA buttons (uses shared CTA object type) |
| `tone` | string (enum) | `neutral`, `subtle`, `bold`, `brand` — semantic section tone (frontend maps to background/text colors) |

**Frontend behavior:** Stacks vertically on mobile (image on top). On desktop, splits 50/50 with the image on the configured side.

### 5. Form Section

Embeddable form with contextual copy above it.

| Field | Type | Notes |
|-------|------|-------|
| `heading` | string | Section title above the form |
| `description` | portableText | Descriptive text between heading and form |
| `formSource` | string (enum) | `embed`, `zohoApi` |
| `embedCode` | text | Raw embed HTML/iframe (when `formSource` is `embed`) |
| `zohoFormId` | string | Zoho form identifier (when `formSource` is `zohoApi`, Phase 2) |
| `formFields` | array of field definitions | For API-driven rendering (Phase 2) |

**Phase 1:** Render the form via iframe embed. The heading and description are native components above the embed.

**Phase 2 (Zoho API):** Fetch form schema from Zoho API, render native form fields styled with Tailwind, submit via API. Benefits: full style control, no iframe jank, better mobile experience, form analytics.

### 6. Gallery

Masonry image grid.

| Field | Type | Notes |
|-------|------|-------|
| `heading` | string | Section title |
| `images` | array of image | Each image has `alt` text and optional `caption` |
| `columns` | number (2–4) | Column count on desktop (defaults to 3) |

**Frontend behavior:** CSS masonry grid (or JS masonry library fallback). Responsive: collapses to 2 columns on tablet, 1 on mobile. Images open in a lightbox on click.

### 7. Conference Info Block

Pulls structured data from a conference and its related exhibitor pages. Useful on both sites for displaying conference details without duplicating content.

| Field | Type | Notes |
|-------|------|-------|
| `conference` | reference → `conference` | Defaults to active conference if not set |
| `showFields` | array (multiselect enum) | Which conference fields to display: `schedule`, `loadIn`, `contacts`, `description` |
| `showExhibitorPages` | array (multiselect enum) | Which exhibitor page categories to surface: `rules`, `faq`, `booth-info`, `insurance`, `passes`, `guidelines` — renders links or inline summaries |
| `displayMode` | string (enum) | `summary` (show titles + links to full pages), `inline` (render full content inline) |

**Frontend behavior:** For conference fields (`showFields`), renders the data directly from the conference document. For exhibitor page categories (`showExhibitorPages`), queries `exhibitorPage` documents matching that conference + category. In `summary` mode, shows titles linking to the full pages. In `inline` mode, renders the page content directly. This avoids duplicating content while keeping the conference document lean.

### 8. Conference Cards

Promotional cards linking to one or more conferences. Designed for the dual-show homepage or any page that needs to promote upcoming conferences.

| Field | Type | Notes |
|-------|------|-------|
| `heading` | string | Optional section heading (e.g. "Upcoming Shows") |
| `conferences` | array of reference → `conference` | Which conferences to feature (1-4) |
| `layout` | string (enum) | `side-by-side`, `stacked` |
| `cardStyle` | string (enum) | `full` (large hero-style cards), `compact` (smaller with key details) |

**Frontend behavior:** Each card auto-populates from the referenced conference: venue image, city, dates, status badge (e.g. "Pre-Sale", "Tickets Available"). Cards link to the conference's landing page. On the dual-show homepage, this component in `side-by-side` + `full` layout creates two large, equal cards promoting both conferences.

### 9. Newsletter Signup

Inline newsletter subscription form. On the current site this appears as a modal on homepage load and as a dedicated `/subscribe` page.

| Field | Type | Notes |
|-------|------|-------|
| `heading` | string | e.g. "The Industry Standard Newsletter" |
| `description` | portableText | Promotional copy above the form |
| `interestOptions` | array of `{ label: string, value: string }` | Location-based preferences (e.g. "All News", "California", "New York") |
| `successMessage` | string | Confirmation text after signup (e.g. "Thanks! You're on the list.") |

**Frontend behavior:** Renders first name, last name, email, and interest dropdown. Submits to newsletter provider API (Mailchimp, ConvertKit, or whatever they use — TBD). Can also be triggered as a modal via `siteSettings` flag.

### 10. Contact List

Renders contacts from a conference, optionally filtered by department. Used on the exhibitor portal to show the departmental contact directory.

| Field | Type | Notes |
|-------|------|-------|
| `heading` | string | e.g. "Show Contacts" |
| `conference` | reference → `conference` | Which conference's contacts to display. Defaults to active conference. |
| `filterByDepartment` | array of string (enum) | Optional. If set, only show contacts from these departments. If empty, show all. |
| `layout` | string (enum) | `grid`, `list` |

**Frontend behavior:** Queries contacts referenced by the specified conference, optionally filtered by department. Renders name, role, department, and email. On the current exhibitor portal, contacts are grouped by department (Retail Relations, Marketing, Cannabis Guidelines, Exhibitor Sales, Onboarding).

### 11. Participant Directory

Renders a confirmed retailer or exhibitor list, grouped alphabetically by first letter. Used on the marketing site (e.g. `/retailers` page shows "Confirmed Retailers for Ventura").

| Field | Type | Notes |
|-------|------|-------|
| `participantList` | reference → `participantList` | Which list to render. The component pulls the title and all entries from this document. |

**Frontend behavior:** Fetches the referenced `participantList`, sorts entries alphabetically by name, groups by first character, and renders with letter headings (A, B, C... with `#` for entries starting with numbers). Matches the current site's layout: bold letter heading, bullet-separated names beneath. The heading auto-generates from the list's title (e.g. "Confirmed Retailers for Ventura").

---

## Site Architecture

### Marketing Site (`hallofflowers.com`)

```
Single-show mode:
/                           → Homepage (siteSettings.homepage)
/tickets                    → Ticket page for primary conference
/retailers                  → Retailer application + confirmed list
/exhibitors                 → Exhibitor application
/blueprint                  → BLUEPRINT manufacturing program
/media                      → Press pass application + photo gallery
/subscribe                  → Newsletter signup

Dual mode (primary = Ventura, secondary = NY pre-sale):
/                           → Dual-show homepage (Conference Cards + hero)
/tickets                    → Ventura tickets (primary keeps root)
/ny                         → NY landing page
/ny/tickets                 → NY pre-sale tickets
/ny/schedule                → NY schedule

After Ventura completes → NY promoted to primary:
/tickets                    → Now serves NY tickets
/ny/tickets                 → 301 redirects to /tickets
```

**Routing logic:**
1. `/` — Fetch `siteSettings.homepage` reference, render that page
2. `/[...slug]` — Catch-all route. Look up `page` by full slug path (handles both `/tickets` and `/ny/tickets`). The slug field stores the full path.

This is intentionally simple — one catch-all dynamic route. The slug in Sanity IS the URL. No conference-slug parsing needed.

**Nav bar** (matches current site pattern):
- Logo (left)
- Nav items: Exhibitors, Retailers, BLUEPRINT, Media, Contact, Subscribe
- Social icons: Instagram, LinkedIn, X, YouTube
- Conference date badges showing all upcoming shows (e.g. "Ventura, CA · Mar 18-19 | Santa Rosa · Sep 10-11 | NYC · Oct 8-9")
- CTA buttons: Tickets, Retailer App, Exhibitor App

**Footer:**
- Contact email (info@hallofflowers.com)
- Nav links: Exhibitors, Retailers, Media
- Social links
- Privacy policy link
- License number (CEO14-0000002-LIC)
- Legal text / copyright

### Exhibitor Portal (`exhibitors.hallofflowers.com`)

```
/                     → Exhibitor homepage for active conference
/[slug]               → Dynamic exhibitor pages (rules, faq, booth-types, etc.)
```

The exhibitor portal automatically scopes all content to the active conference set in `siteSettings`. Content editors create `exhibitorPage` documents tied to a specific `conference` — the frontend filters to only show pages for the active conference.

When a conference returns to a previous city, editors can either:
1. **Clone** the previous conference's exhibitor pages and update them
2. **Reference** the same venue and reuse contact records, only updating what changed

### Deployment Architecture

```
┌──────────────────────────────────────────┐
│              Sanity Studio                │
│         (studio.hallofflowers.com)        │
│    Manages all content for both sites     │
└──────────────┬───────────────────────────┘
               │ Content API + Webhooks
               ▼
┌─────────────────────┐  ┌─────────────────────┐
│   Marketing Site     │  │  Exhibitor Portal    │
│  hallofflowers.com   │  │ exhibitors.hof.com   │
│                      │  │                      │
│  Vercel Project #1   │  │  Vercel Project #2   │
│  Next.js App Router  │  │  Next.js App Router  │
└─────────────────────┘  └─────────────────────┘
```

Both Vercel projects share the same Git repo (monorepo) or are separate deployments from the same repo using Vercel's directory-scoped projects.

**Recommended approach:** Single Next.js app with middleware-based routing. The middleware inspects the `Host` header and routes to different route groups:

```
src/
  app/
    (marketing)/                        → hallofflowers.com routes
      page.tsx                          → Homepage (renders siteSettings.homepage)
      [...slug]/page.tsx                → Catch-all: /tickets, /retailers, /ny/tickets, etc.
      layout.tsx                        → Marketing nav + footer
    (exhibitor)/                        → exhibitors.hallofflowers.com routes
      page.tsx                          → Exhibitor homepage for active conference
      [...slug]/page.tsx                → Catch-all: /rules, /faq, /booth-type, etc.
      layout.tsx                        → Exhibitor nav + footer (sidebar navigation)
    layout.tsx                          → Root layout (fonts, globals)
  middleware.ts                         → Host-based subdomain routing
  components/
    page-builder/                       → Page builder component renderers
      Hero.tsx
      CopyBlock.tsx
      MediaEmbed.tsx
      TwoUp.tsx
      FormSection.tsx
      Gallery.tsx
      ConferenceInfoBlock.tsx
      ConferenceCards.tsx
      NewsletterSignup.tsx
      ContactList.tsx
      ParticipantDirectory.tsx
    nav/
      MarketingNav.tsx
      ExhibitorNav.tsx
    footer/
      Footer.tsx
  lib/
    sanity/
      client.ts                         → Sanity client config
      queries.ts                        → GROQ queries
      types.ts                          → Generated TypeScript types (Sanity TypeGen)
```

This keeps a single deployment on Vercel with both domains pointed at it. The middleware rewrites requests based on subdomain.

---

## Data Flow: Conference Lifecycle

```
1. SETUP       → Editor creates new `conference` document
                  - References existing `venue` (or creates new one)
                  - Adds contacts, schedule, booth types, etc.
                  - Creates conference-scoped `page` docs (landing page, tickets, etc.)
                  - Creates `exhibitorPage` documents for this conference
                  - If returning to a past city: clone previous conference's pages as starting point

2. PROMOTE     → Editor sets conference as `upcoming` in status
                  - Optionally sets as `secondaryConference` in siteSettings
                  - Conference pages are now live at /conference-slug/*
                  - Nav picks up secondary conference badge automatically

3. ACTIVATE    → Editor sets conference as `active`
                  - Sets as `activeConference` in siteSettings
                  - Swaps `siteSettings.homepage` to the conference-focused homepage
                    (or to a dual-show page if two conferences are being promoted)
                  - Marketing site nav updates automatically
                  - Exhibitor portal switches to show this conference's pages

4. DUAL MODE   → Two conferences active simultaneously
                  - Primary conference = `activeConference` (the imminent show)
                  - Secondary conference = `secondaryConference` (pre-sale / early marketing)
                  - Editor swaps `homepage` to a "dual show" page that promotes both
                  - Both conferences have their own page trees (/ventura-2026/*, /new-york-2026/*)
                  - Nav shows both conferences

5. COMPLETE    → Editor sets conference status to `completed`
                  - Clears `secondaryConference` if it was this show
                  - Data persists — pages, exhibitor content, conference details all saved
                  - Swaps `homepage` to the next show's focused page
                  - Next conference gets promoted to `activeConference`

6. PROMOTE SECONDARY → When secondary conference becomes primary:
                  - Editor updates page slugs: `/ny/tickets` → `/tickets` (bulk slug update)
                  - Creates redirect entries: `/ny/tickets` → `/tickets` (301)
                  - Old primary's pages get archived or updated for next occurrence
                  - OR: Editor simply updates the content of `/tickets` to reference the new conference
                    (simpler, avoids slug juggling — just edit the page builder components)
```

### URL Promotion: How Redirects Work

When a secondary conference becomes the primary, editors have two approaches:

**Approach A: Content swap (simpler, recommended)**
The page at `/tickets` is edited — swap out the Ventura hero/CTAs for NY content. The URL never changes. This is the same pattern as the homepage swap but at the page content level. Works great because the page builder makes this easy.

**Approach B: Slug promotion (for dedicated pages)**
If the secondary had its own pages at `/ny/tickets`, `/ny/schedule`, etc., and those should now become the primary:
1. Archive or delete the old primary's pages
2. Update the secondary's page slugs from `ny/tickets` → `tickets`
3. Add redirect rules: `ny/tickets` → `tickets` (301)

A `redirect` document type in Sanity handles this:

| Field | Type | Notes |
|-------|------|-------|
| `source` | string | Old path (e.g. `ny/tickets`) |
| `destination` | string | New path (e.g. `tickets`) |
| `permanent` | boolean | `true` for 301, `false` for 302 |

Next.js middleware reads these and applies redirects before page routing.

### Example: Typical Year Flow

```
January    → Ventura is active, homepage = "Ventura Hero Page"
             /tickets → Ventura tickets
             Site feels fully focused on Ventura.

March      → Ventura still active, but NY pre-sale opens.
             Set NY as secondaryConference.
             Swap homepage → "Dual Show Page" (promotes both).
             Create NY pages: /ny, /ny/tickets, /ny/pre-sale.
             Nav now shows both conference dates.

April      → Ventura show happens. Mark Ventura as completed.
             Option A: Edit /tickets content to be about NY (simple content swap).
             Option B: Rename ny/tickets → tickets, add 301 redirect.
             Swap homepage → "NY Hero Page".
             NY becomes activeConference. Nav updates.

July       → NY show happens. Mark completed.
             Swap homepage → generic brand page or next show teaser.
             Start prepping Santa Rosa pages at /santa-rosa/*.
```

---

## Phases

### Phase 1 — Foundation + Marketing Site
- Sanity schema: all core document types (`conference`, `venue`, `contact`, `page`, `siteSettings`, `navigation`, `footer`, `redirect`)
- Sanity Studio configuration with custom desk structure (pages grouped by conference, exhibitor pages grouped by conference + category)
- Next.js project setup with middleware-based subdomain routing + redirect handling
- Page builder framework with component rendering
- Components: Hero, Copy Block, Two-Up, Media Embed, Gallery, Conference Cards
- Marketing site: catch-all dynamic routing, nav with conference date bar + multiple CTAs, footer
- TypeScript types generated from Sanity schemas (Sanity TypeGen)
- Vercel deployment with both domains configured

### Phase 2 — Exhibitor Portal + Remaining Components
- Sanity schema: `exhibitorPage` with categories
- Conference Info Block + Contact List components
- Exhibitor portal layout (sidebar nav, footer, catch-all routing scoped to active conference)
- Form Section component (iframe embed)
- Newsletter Signup component
- Homepage subscription modal (triggered from siteSettings flag)

### Phase 3 — Polish & Integrations
- Zoho API form integration (native form rendering)
- Newsletter provider integration (Mailchimp/ConvertKit/TBD)
- SEO: metadata, Open Graph, sitemap generation, 301 redirect management
- Performance: image optimization (Sanity image pipeline + Next.js Image), ISR/on-demand revalidation via Sanity webhooks
- Analytics integration
- Lighthouse / Core Web Vitals audit
- Accessibility audit (WCAG 2.1 AA)
- Content migration from Webflow → Sanity

---

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Lighthouse Performance | > 90 |
| Lighthouse Accessibility | > 95 |
| Time to Interactive | < 3s on 3G |
| CMS Preview | Sanity Visual Editing / Live Preview in Next.js |
| Caching | ISR with on-demand revalidation via Sanity webhooks |
| Image delivery | Sanity CDN with auto-format (WebP/AVIF) + responsive srcset |
| Mobile | Fully responsive, mobile-first design |

---

## Content Modeling Audit

Decisions made based on structured content modeling best practices:

| Principle | Issue Found | Resolution |
|-----------|-------------|------------|
| **Avoid mega-documents** | `conference` had rules, insurance, FAQ, booth types, guidelines, passes all embedded — 6+ rich text fields unrelated to core conference identity | Moved to `exhibitorPage` documents scoped to the conference. Each gets its own editor, page builder, and URL. Conference doc stays focused on identity + scheduling. |
| **Separation of content & presentation** | `backgroundColor: white/light/dark/brand` is visual | Renamed to `tone: neutral/subtle/bold/brand` — semantic intent, frontend maps to colors |
| **Separation of content & presentation** | `overlayOpacity: 0-100` is a CSS value | Replaced with `overlayStrength: none/light/medium/heavy` — semantic scale |
| **Separation of content & presentation** | `maxWidth: narrow (640px)` embeds pixel values in content | Changed to `width: narrow/medium/wide/full` — no pixel values, frontend decides |
| **Single source of truth** | `isPrimary`/`isSecondary` booleans on conference duplicated state from `siteSettings` | Removed. Primary/secondary status lives only in `siteSettings` references |
| **Shared object types** | CTA `{ label, url, style }` repeated across 3+ components | Extracted to shared `cta` object type, referenced everywhere |
| **Shared object types** | SEO fields `{ metaTitle, metaDescription, ogImage }` repeated | Extracted to shared `seoFields` object type |
| **Reference vs embedding** | `contact` as reference — correct (reused across conferences) | Kept as-is |
| **Reference vs embedding** | `venue` as reference — correct (reused when conference returns to city) | Kept as-is |
| **Reference vs embedding** | SEO as embedded object — correct (page-specific, no reuse) | Kept as-is |
| **Taxonomy** | `exhibitorPage.category` needed for Conference Info Block queries | Added enum field: `rules`, `faq`, `booth-info`, etc. Flat taxonomy, appropriate for this use case |

---

## Open Questions

1. **Design system / brand assets** — Do we have Figma files, or should we extract the design system from the current Webflow site? Current: orange accent (#ff914d), Helvetica Neue, light theme.
2. **Zoho specifics** — Which Zoho product handles the forms (Zoho Forms, Zoho CRM web forms, etc.)? Do we have API access?
3. **Newsletter provider** — What handles the current email subscription? Mailchimp? ConvertKit? Need API credentials for the signup component.
4. **Authentication** — Does the exhibitor portal need any gated/login-protected content, or is it all public?
5. **BLUEPRINT sub-program** — Is BLUEPRINT always tied to a specific conference (Ventura only), or does it appear at multiple shows? Does it need its own page builder pages or is it a simple landing page?
6. **Confirmed Exhibitor/Retailer Lists** — The retailer page links to a "Confirmed Retailer List." Is this a manually curated list or pulled from a CRM? Should these be managed in Sanity as content?
7. **Existing domain setup** — Current DNS and hosting provider for hallofflowers.com and exhibitors.hallofflowers.com? Who manages DNS?
8. **Content migration** — How much content from the current Webflow site needs to be migrated vs recreated? Are there assets (images, videos) that need to be moved to Sanity?
9. **Video guides** — The exhibitor portal has "Video Guide" pages per booth type. Are these YouTube embeds or self-hosted? Existing or will new ones be created?
10. **Subscription modal** — The current site shows a newsletter modal on homepage load. Should this be preserved? Configurable per page or global?
