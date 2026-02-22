/**
 * Seed script: Populates Sanity with content from the live hallofflowers.com site.
 *
 * Run: node scripts/seed.mjs
 */

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "dxevsfa3",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

// ─── Helpers ──────────────────────────────────────────────────────

function generateKey() {
  return Math.random().toString(36).substring(2, 10);
}

function textBlock(text) {
  return {
    _type: "block",
    _key: generateKey(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: generateKey(), text, marks: [] }],
  };
}

function headingBlock(text, level = "h2") {
  return {
    _type: "block",
    _key: generateKey(),
    style: level,
    markDefs: [],
    children: [{ _type: "span", _key: generateKey(), text, marks: [] }],
  };
}

// ─── Venues ───────────────────────────────────────────────────────

const venues = [
  {
    _id: "venue-ventura",
    _type: "venue",
    name: "Ventura County Fairgrounds",
    city: "Ventura",
    state: "CA",
    address: "10 E Harbor Blvd, Ventura, CA 93001",
  },
  {
    _id: "venue-santa-rosa",
    _type: "venue",
    name: "Sonoma County Fairgrounds",
    city: "Santa Rosa",
    state: "CA",
    address: "1350 Bennett Valley Rd, Santa Rosa, CA 95404",
  },
  {
    _id: "venue-nyc",
    _type: "venue",
    name: "New York City Venue",
    city: "New York City",
    state: "NY",
    address: "",
  },
];

// ─── Contacts ─────────────────────────────────────────────────────

const contacts = [
  {
    _id: "contact-alix",
    _type: "contact",
    name: "Alix Volsansky",
    department: "retail-relations",
    email: "alix@hallofflowers.com",
  },
  {
    _id: "contact-linda",
    _type: "contact",
    name: "Linda Florez",
    department: "retail-relations",
    email: "retail@hallofflowers.com",
  },
  {
    _id: "contact-rama",
    _type: "contact",
    name: "Rama Mayo",
    department: "marketing",
    email: "rama@hallofflowers.com",
  },
  {
    _id: "contact-chris",
    _type: "contact",
    name: "Chris Gonzalez",
    department: "marketing",
    email: "chris@hallofflowers.com",
  },
  {
    _id: "contact-spenta",
    _type: "contact",
    name: "Spenta Mehraban",
    department: "cannabis-guidelines",
    email: "ops@hallofflowers.com",
  },
  {
    _id: "contact-eric",
    _type: "contact",
    name: "Eric Bello",
    department: "exhibitor-sales",
    email: "eric@hallofflowers.com",
  },
  {
    _id: "contact-spenta-sales",
    _type: "contact",
    name: "Spenta Mehraban",
    role: "Exhibitor Sales",
    department: "exhibitor-sales",
    email: "spenta@hallofflowers.com",
  },
  {
    _id: "contact-dave",
    _type: "contact",
    name: "Dave Bacon",
    department: "exhibitor-sales",
    email: "dave@hallofflowers.com",
  },
  {
    _id: "contact-kelsey",
    _type: "contact",
    name: "Kelsey Castro",
    department: "onboarding",
    email: "kelsey@hallofflowers.com",
  },
];

// ─── Conferences ──────────────────────────────────────────────────

const conferences = [
  {
    _id: "conf-ventura-2026",
    _type: "conference",
    title: "Hall of Flowers Ventura 2026",
    slug: { _type: "slug", current: "ventura-2026" },
    location: { _type: "reference", _ref: "venue-ventura" },
    startDate: "2026-03-18",
    endDate: "2026-03-19",
    status: "active",
    tagline: "A Revolutionary Experience",
    description: [
      headingBlock("Hall of Flowers Ventura", "h2"),
      textBlock(
        "Hall of Flowers is the world's premier Cannabis trade show, operating since 2018. Join us for a revolutionary experience with all business in the front on Day 1 and consumer festival activities on Day 2."
      ),
      textBlock(
        "We achieved a world record for the most Cannabis sales ever in one place. Hall of Flowers optimizes the buying process — fewer distractions means more time and the perfect headspace for buying and trying."
      ),
    ],
    showSchedule: [
      {
        _key: generateKey(),
        _type: "dateRange",
        label: "Day 1 — Trade Show",
        startDate: "2026-03-18T10:00:00",
        endDate: "2026-03-18T17:00:00",
      },
      {
        _key: generateKey(),
        _type: "dateRange",
        label: "Day 2 — Consumer Day",
        startDate: "2026-03-19T10:00:00",
        endDate: "2026-03-19T17:00:00",
      },
    ],
    contacts: [
      { _type: "reference", _ref: "contact-alix", _key: generateKey() },
      { _type: "reference", _ref: "contact-linda", _key: generateKey() },
      { _type: "reference", _ref: "contact-rama", _key: generateKey() },
      { _type: "reference", _ref: "contact-chris", _key: generateKey() },
      { _type: "reference", _ref: "contact-spenta", _key: generateKey() },
      { _type: "reference", _ref: "contact-eric", _key: generateKey() },
      { _type: "reference", _ref: "contact-dave", _key: generateKey() },
      { _type: "reference", _ref: "contact-kelsey", _key: generateKey() },
    ],
  },
  {
    _id: "conf-santa-rosa-2026",
    _type: "conference",
    title: "Hall of Flowers Santa Rosa 2026",
    slug: { _type: "slug", current: "santa-rosa-2026" },
    location: { _type: "reference", _ref: "venue-santa-rosa" },
    startDate: "2026-09-10",
    endDate: "2026-09-11",
    status: "upcoming",
    tagline: "California's Premier Cannabis Event",
  },
  {
    _id: "conf-nyc-2026",
    _type: "conference",
    title: "Hall of Flowers New York City 2026",
    slug: { _type: "slug", current: "nyc-2026" },
    location: { _type: "reference", _ref: "venue-nyc" },
    startDate: "2026-10-08",
    endDate: "2026-10-09",
    status: "upcoming",
    tagline: "The East Coast Cannabis Experience",
    urlPrefix: { _type: "slug", current: "ny" },
  },
];

// ─── Pages ────────────────────────────────────────────────────────

const pages = [
  {
    _id: "page-homepage",
    _type: "page",
    title: "Homepage — Ventura Focus",
    slug: { _type: "slug", current: "home" },
    conference: { _type: "reference", _ref: "conf-ventura-2026" },
    seo: {
      _type: "seoFields",
      metaTitle: "Hall of Flowers | The World's Premier Cannabis Trade Show",
      metaDescription:
        "Hall of Flowers is the world's premier cannabis trade show. Join us in Ventura, CA — March 18 & 19, 2026.",
    },
    content: [
      {
        _type: "hero",
        _key: generateKey(),
        backgroundType: "image",
        overlayStrength: "medium",
        textAlignment: "center",
        body: [
          headingBlock("Hall of Flowers", "h1"),
          textBlock("Ventura — March 18 & 19, 2026"),
        ],
        ctas: [
          {
            _key: generateKey(),
            _type: "cta",
            label: "Get Tickets",
            url: "/tickets",
            variant: "primary",
          },
          {
            _key: generateKey(),
            _type: "cta",
            label: "Exhibitor Application",
            url: "/exhibitors",
            variant: "secondary",
          },
        ],
      },
      {
        _type: "twoUp",
        _key: generateKey(),
        imagePosition: "right",
        tone: "neutral",
        body: [
          headingBlock("A Revolutionary Experience", "h2"),
          textBlock(
            "Hall of Flowers is the world's premier Cannabis trade show. All business in the front on Day 1, with a consumer festival on Day 2. We achieved a world record for the most Cannabis sales ever in one place."
          ),
          textBlock(
            "Hall of Flowers optimizes the buying process. Fewer distractions means more time and the perfect headspace for buying and trying."
          ),
        ],
        ctas: [
          {
            _key: generateKey(),
            _type: "cta",
            label: "Learn More",
            url: "/exhibitors",
            variant: "primary",
          },
        ],
      },
      {
        _type: "conferenceCards",
        _key: generateKey(),
        heading: "Upcoming Shows",
        conferences: [
          { _type: "reference", _ref: "conf-ventura-2026", _key: generateKey() },
          { _type: "reference", _ref: "conf-santa-rosa-2026", _key: generateKey() },
          { _type: "reference", _ref: "conf-nyc-2026", _key: generateKey() },
        ],
        layout: "side-by-side",
        cardStyle: "compact",
      },
      {
        _type: "newsletterSignup",
        _key: generateKey(),
        heading: "The Industry Standard Newsletter",
        description: [
          textBlock(
            "Subscribe for the highest impact stories in the cannabis industry and culture sent directly to your inbox."
          ),
        ],
        interestOptions: [
          { _key: generateKey(), label: "All News & Info", value: "all" },
          {
            _key: generateKey(),
            label: "California News & Info",
            value: "california",
          },
          {
            _key: generateKey(),
            label: "New York News & Info",
            value: "new-york",
          },
        ],
        successMessage: "Thanks! You're on the list.",
      },
    ],
  },
  {
    _id: "page-tickets",
    _type: "page",
    title: "Tickets",
    slug: { _type: "slug", current: "tickets" },
    conference: { _type: "reference", _ref: "conf-ventura-2026" },
    seo: {
      _type: "seoFields",
      metaTitle: "Tickets | Hall of Flowers Ventura 2026",
      metaDescription:
        "Get your tickets for Hall of Flowers Ventura — March 18 & 19, 2026 at the Ventura County Fairgrounds.",
    },
    content: [
      {
        _type: "hero",
        _key: generateKey(),
        backgroundType: "image",
        overlayStrength: "medium",
        textAlignment: "center",
        body: [
          headingBlock("Ventura Tickets", "h1"),
          textBlock("March 18 & 19, 2026 — Ventura County Fairgrounds"),
        ],
        ctas: [
          {
            _key: generateKey(),
            _type: "cta",
            label: "Buy Tickets",
            url: "/venturatickets",
            variant: "primary",
          },
        ],
      },
    ],
  },
  {
    _id: "page-retailers",
    _type: "page",
    title: "Retailers",
    slug: { _type: "slug", current: "retailers" },
    seo: {
      _type: "seoFields",
      metaTitle:
        "Dispensary Retailer Access | Cannabis Trade Show CA & NY",
      metaDescription:
        "Licensed retail buyers attend Hall of Flowers for free. Apply for complimentary tickets to the premier cannabis trade show.",
    },
    content: [
      {
        _type: "hero",
        _key: generateKey(),
        backgroundType: "image",
        overlayStrength: "medium",
        textAlignment: "center",
        body: [
          headingBlock("Retailers Attend Free!", "h1"),
          textBlock(
            "Licensed retail buyers are granted complimentary tickets, subject to a vetting process."
          ),
        ],
        ctas: [
          {
            _key: generateKey(),
            _type: "cta",
            label: "Apply Here",
            url: "#application",
            variant: "primary",
          },
          {
            _key: generateKey(),
            _type: "cta",
            label: "Confirmed Retailer List",
            url: "/ventura-retailer-list",
            variant: "secondary",
          },
        ],
      },
      {
        _type: "copyBlock",
        _key: generateKey(),
        width: "medium",
        textAlignment: "left",
        body: [
          headingBlock("Retail Buyer Application", "h2"),
          textBlock(
            "Hall of Flowers is a must-attend event for Cannabis retailers seeking brand connections and quality products. Attendance costs nothing for licensed retailers."
          ),
          textBlock(
            "We optimize the buying process. Fewer distractions means more time and the perfect headspace for buying and trying. Renew relationships and make real connections."
          ),
          textBlock(
            "Applicants must possess an active retail license. Those planning to open soon require a building permit and city approval documentation. Incomplete applications will be disregarded."
          ),
        ],
      },
      {
        _type: "formSection",
        _key: generateKey(),
        heading: "Retailer Application",
        formSource: "embed",
        embedCode:
          '<div style="text-align:center;padding:40px;background:#f9fafb;border-radius:8px;"><p style="color:#71717a;">Retailer application form embed placeholder</p></div>',
      },
    ],
  },
  {
    _id: "page-exhibitors",
    _type: "page",
    title: "Exhibitors",
    slug: { _type: "slug", current: "exhibitors" },
    seo: {
      _type: "seoFields",
      metaTitle:
        "Exhibit at Hall of Flowers | Cannabis Trade Shows CA & NY",
      metaDescription:
        "Exhibit at the premier cannabis trade show. A highly curated exhibitor process connecting licensed cannabis brands with verified retailers.",
    },
    content: [
      {
        _type: "hero",
        _key: generateKey(),
        backgroundType: "image",
        overlayStrength: "medium",
        textAlignment: "center",
        body: [
          headingBlock("Exhibiting at Hall of Flowers", "h1"),
          textBlock(
            "A highly curated trade show with a selective exhibitor process designed to connect licensed cannabis brands and ancillary businesses with verified retailers."
          ),
        ],
        ctas: [
          {
            _key: generateKey(),
            _type: "cta",
            label: "Apply Here",
            url: "#application",
            variant: "primary",
          },
          {
            _key: generateKey(),
            _type: "cta",
            label: "Confirmed Exhibitor List",
            url: "/ventura-exhibitor-list",
            variant: "secondary",
          },
        ],
      },
      {
        _type: "twoUp",
        _key: generateKey(),
        imagePosition: "left",
        tone: "subtle",
        body: [
          headingBlock(
            "How does Hall of Flowers attract the industry's most respected retailers?",
            "h2"
          ),
          textBlock(
            "Our dedicated retail-relations team brings buyers from every reputable, licensed Cannabis retail shop with complimentary tickets and a promise that the industry's best products and people will all be together in one place."
          ),
        ],
      },
      {
        _type: "copyBlock",
        _key: generateKey(),
        width: "medium",
        textAlignment: "left",
        body: [
          headingBlock("What are the booth options?", "h2"),
          textBlock(
            "Hall of Flowers has booth options to suit every brand and every budget."
          ),
        ],
      },
      {
        _type: "formSection",
        _key: generateKey(),
        heading: "Exhibitor Application",
        formSource: "embed",
        embedCode:
          '<div style="text-align:center;padding:40px;background:#f9fafb;border-radius:8px;"><p style="color:#71717a;">Exhibitor application form embed placeholder</p></div>',
      },
    ],
  },
  {
    _id: "page-blueprint",
    _type: "page",
    title: "BLUEPRINT",
    slug: { _type: "slug", current: "bp" },
    seo: {
      _type: "seoFields",
      metaTitle: "BLUEPRINT | Hall of Flowers",
      metaDescription:
        "BLUEPRINT is a dedicated hub on the show floor for Cannabis manufacturing, consumables, supplies, equipment and co-packing.",
    },
    content: [
      {
        _type: "hero",
        _key: generateKey(),
        backgroundType: "image",
        overlayStrength: "medium",
        textAlignment: "center",
        body: [headingBlock("BLUEPRINT", "h1")],
      },
      {
        _type: "copyBlock",
        _key: generateKey(),
        width: "medium",
        textAlignment: "left",
        body: [
          textBlock(
            "BLUEPRINT is a dedicated hub on the show floor for Cannabis manufacturing, consumables, supplies, equipment and co-packing."
          ),
          textBlock(
            "Labs, processors, cultivators, co-packers and MSO production and cultivation teams come to evaluate new materials, machinery and automation in one place."
          ),
          textBlock(
            "Exhibiting in Blueprint places your brand in front of production and cultivation teams actively sourcing solutions. Applications undergo review to maintain a focused, high-quality exhibitor mix."
          ),
        ],
      },
      {
        _type: "formSection",
        _key: generateKey(),
        heading: "BLUEPRINT Exhibitor Application",
        formSource: "embed",
        embedCode:
          '<div style="text-align:center;padding:40px;background:#f9fafb;border-radius:8px;"><p style="color:#71717a;">BLUEPRINT application form embed placeholder</p></div>',
      },
    ],
  },
  {
    _id: "page-media",
    _type: "page",
    title: "Media",
    slug: { _type: "slug", current: "media" },
    seo: {
      _type: "seoFields",
      metaTitle: "Media Passes | Hall of Flowers",
      metaDescription:
        "Apply for media passes to Hall of Flowers events. Credentialed media and freelancers on assignment welcome.",
    },
    content: [
      {
        _type: "hero",
        _key: generateKey(),
        backgroundType: "image",
        overlayStrength: "medium",
        textAlignment: "center",
        body: [headingBlock("Media Passes", "h1")],
      },
      {
        _type: "copyBlock",
        _key: generateKey(),
        width: "medium",
        textAlignment: "left",
        body: [
          textBlock(
            "Hall of Flowers invites credentialed media and freelancers on assignment to apply for media passes to our events. Please provide as much detail as possible."
          ),
          textBlock(
            "If you have questions regarding the event, or are interested in speaking with a Hall of Flowers representative as part of advance coverage, please contact us via email at info@hallofflowers.com."
          ),
        ],
      },
      {
        _type: "gallery",
        _key: generateKey(),
        heading: "Gallery",
        columns: 3,
        images: [],
      },
    ],
  },
  {
    _id: "page-subscribe",
    _type: "page",
    title: "Subscribe",
    slug: { _type: "slug", current: "subscribe" },
    seo: {
      _type: "seoFields",
      metaTitle: "Subscribe | Hall of Flowers Newsletter",
      metaDescription:
        "Subscribe to the Hall of Flowers newsletter for the highest impact stories in the cannabis industry.",
    },
    content: [
      {
        _type: "newsletterSignup",
        _key: generateKey(),
        heading: "The Industry Standard Newsletter",
        description: [
          textBlock(
            "Subscribe for the highest impact stories in the cannabis industry and culture sent directly to your inbox."
          ),
        ],
        interestOptions: [
          { _key: generateKey(), label: "All News & Info", value: "all" },
          {
            _key: generateKey(),
            label: "California News & Info",
            value: "california",
          },
          {
            _key: generateKey(),
            label: "New York News & Info",
            value: "new-york",
          },
        ],
        successMessage: "Thanks! You're on the list.",
      },
    ],
  },
];

// ─── Participant Lists ────────────────────────────────────────────

const retailerNames = `22 West Co.
420 Central
420 Kingdom
7 Stars Holistic Healing Center
A Green Alternative
Abide
AHHS
Airfield Supply Company - San Jose
All Natural
Alpaca Club
The Artist Tree
Arts District Cannabis DTLA
ATC Delivery
Atrium
Backpack Boyz
Backpack Boyz - San Bernadino
The Bakery
The Bakery - Atwater
Banyan Tree
Basa Collective
Berkeley Patients Group
Better Daze
Beyond Rooted
Bishop Boyz Dispensary
Blazed Utopia
Bleu Diamond Cannabis Co
Bleu Diamond Co - Ventura County
Blissful Moments Healing Center
Blue Fire
Blue Mountain Collective
Bonafide LA
The Bract House
Brentwood Greens
The Bright Spot
Broccoli Cannabis
Bubblegum Dispensary
Bud & Beyond by MHPC
BUTA Cannabis Delivery
C.R.A.F.T.
The Cake House
The Cake House - Encinitas
Caliva Stores
Caliwee Delivery
CALMA
CAM Delivery
Cana Harbor
Canna Junction
Canna-Car
CANNA-COURIERS
Cannabis Buyers Club of Berkeley
Cannabis Feels Good
Cannagram
Canopy Club
Catalyst Cannabis Co
The Chronic
Chronic LB
The Circle LBC
Club 11
Club 420
The Coachella Releaf
Coast to Coast Collective
Coastal Collective
Connected Cannabis Co.
Cookies Coalinga
Cookies Mendocino
Cornerstone Wellness
Crescent City Cannabis Company
Crystal Nugs
Culture Cannabis Club
Culture LA
Curbside PCH
Dank City Delivery
DC Collective
Delta Boyz
Diverse
Doobie Nights
Dope Sugar - LA
Dope Sugar Melrose
Double Eye
Dr Green Rx
Dr. Greenthumb's - Fresno
Dr. Greenthumb's - West LA
Dr. Greenthumbs - Canoga Park
DTPG By The Cure Company
Dubs Green Garden Delivery
Dune Delivery
Eaze
ELECTRIC AVENUE
Element 7
Elevate - Woodland Hills
Elevate Lompoc
Elevated SF
Eleven 11 Delivery
Embarc
Embr
Emerald Perspective
Emerald Triangle Cannabis
Erb & Arbor
Erba - Culver City
Erba - Sawtelle
Erba - Venice
Erba - West LA
Erba Catalina
Essential Torrance
Eureka Sky
Evergreen
EVOLV Cannabis
Farmacy - Santa Barbara
Farmacy - Santa Ynez
Farmacy Berkeley
Farmacy Isla Vista
Farmacy Santa Ana
Fig Trees
Fire House
Firefly Delivery
FIREHAUS
Flavor Farm Dispensary
Flavors
The Flore Store
Flower Company
Foreign LA
Fresh Flower Daily
Fridaze
From The Earth
The Ganjery
Garden State Nectar
Gas Station LA
GOAT GLOBAL - Eureka
Golden State Canna
Golden State Greens
Grass Valley Provisions
The Green Chamber
Green Earth Collective
The Green Giant Delivery
The Green Goddess
Green Gold Cultivators
Green Gold Delivery
Green Qween
Green Solutions
The Green Spot Santa Cruz
Greenhouse Herbal Center
Ha Ha Organics
Harborside/ Urbn Leaf
Harvest Corner
HERB'N VIBES
Herba Regalis
Herbal Remedies Caregivers
Herban Kulture
HerbNJoy
High Seas
High Sierra
High Way
High Way - Antelope Valley Wellness
High-Land Cannabis
Higher Level - Hollister
Higher Level - Seaside
The Highlands
Highway Caregivers
HiKei
Hollywood Walk of Weed
Hoover House
HotBox - Lancaster
Humble Root
HYRBA
ILLA Canna
Ivy Hill
IYKYK Club
Jaxx Cannabis
Jet Room
Jungle Boys - San Diego
Juva
Kanna Oak
Kannabis Works
King's Crew
Kolas
Kravings
Kure Wellness
Kush Alley
Kushology
La Brea Collective
Leaf Dispensary
Leaf Dispensary - Thousand Oaks
Legendary Organics
Levels
Liberty Cannabis
Little Trees
Local Cannabis Co
Loopy Sanchez Dispensary
MainStage
Malibu Community Collective
Mammoth Roots
Marin Gardens Delivery
Marina Greens
Markt
Mary Alice
Mecca Mid City
MediThrive
MedMen
Megan's Organic Market
Metro 1996
Mission Organic Center
MJ Direct
MMD Shops
MOCA Humboldt
Moe Greens
Mr. Humboldt
Mr. Nice Guy
Nasha Delivery
Native Garden
Natrl Hi
The Natural Cannabis Company
Natural Healing Center
Nature's Spot
Nature's Story
Nectar Cannabis
Nu Cannabis Delivery
Obsidian SF
Off The Charts
Off The Charts - Palm Springs
Off The Charts - Ramona
Off The Charts - SF
Off The Charts - Vista
Off The Charts - Winterhaven
OG Nation
Ojai Cannabis Company
Ojai Greens
One Plant
Organic Greens Collective
Originals - San Diego
Osos Flower
Outco/SoCal Cannabis Depot
Oxnard Holistics
Packs
Packs - OC
Packs - San Bernardino
Packs - Stockton
Padre Mu Delivery
Pal's Cannabis Shop
The Palm Springs Dispensary
Patient Care First
PAUWELS CANNABIS CO.
Perfect Union
Phenos
Planet 13
The Plant
Plant Galaxy
PlantShop
Platinum Connection
Posh Green Collective
POSITIVE GREEN
The Pottery
The Premier Group
Premium Blossom
Presidio Cannabis Collective
The Prime Leaf
Project Cannabis - NOHO
PUFF N' LUFF
Puff-N-Dash
Pure Life Collective
Purple Lotus
Purple Star
Quality Life
Rare Earth Botica
Redbud Apothecary
Redwood Herbal Alliance
REEFER MADNESS
Releaf
Releaf on Vine
Remedy Room
REUP By Exclusive
RISE Pasadena
Rising Tide Delivery
Roots
Rose Collective
Royal Healing Emporium
Sacred Roots
Santa Cruz Flavors
Seaweed SF
Secret Garden
Sensi Retail
Serenity of Lathrop
Sessions by the Bay
Showcase
Showgrow - Long Beach
Siesta Life Encinitas
SLOCAL Roots
Smartweed
Smooth Elevations
The Source
Sparc
Stash Dash
The Station Fresno
Status Dispensary
Stealthee Delivery
Stiiizy
Sublime Delivery
Supply
Sweet Flower
Swish Cannabis
Tall Tree Society Delivery
THCSD
Thornwood Distribution LLC
Three Trees Delivery
Tioga Green
Toasty
Token Farms
Tradecraft Farms
Traditional
Tree Hopper
Trees of Knowledge
TRP
True Deliveries
Two Rivers Wellness
United Growers
Urbana
Valencia Cannabis Co/ Brother Hempire
Valley Health Options
Valley Pure
Valley Verde
Velvet
Wakery Bakery Delivery
The WEED
Weed Shop Hollywood
Wellgreens
West Coast Cannabis Club
West Valley Patients Center
Westside CLLCTV
Westwood Cannabis Stop
Wheelhouse
Wonderbrett
Woodland Cannabis Dispensary
The Woods
Zen Garden - Daly City
Zen Garden - Sacramento
Zen Garden - Stockton
Zenganic Delivery
ZZFlux DTLA`.split("\n").filter(Boolean);

const exhibitorNames = `3 Bros
8 Bit
ABCDE Brands
Abstrax
ABX
Accubanker
Accuvita
Aether Fields
Aims Horticulture
All Seasons
AMORETTI
Anresco Labs
Artrix Innovation Inc.
Bank of Dank
BatchNav
Bay-Labs
BDSA
Beeswax Tips
Big Tree
BLAZE
Blazy Susan
blendz
Boldtbags
Bosky Genetics
BOUTIQ
Bright Lights
Bubba's Cannabis
BUD-E-BENEFITS
BulkMarket
CALEAF TECH
Cali Roots
Camino
Canix
Canna Brand Solutions
Canna Valley
Cannabis Business Banking
CannaCard
Cannapresso
Care By Design
Casaverde Express
CGO
Chico Verde
Claybourne Co.
Clipper
Clone Goddess
Coastal Sun
Creme de Canna
Crumbz
Daze Off
Decibel Enterprise
Dee Thai
DeepUnion
Delighted
Detroit Dispensing Solutions
Dispensary ATM Services
Dispensify
Distru
Dompen
Dutchie
E10 Labs
Eighth Brother
Eleven11 Distro
Emerald Bay Extracts
Emerald Sky
Encore labs
Errl Hill
Farmer and the Felon
Fig Farms
Finished Goods
Flowhub
Forte
Fresh Drip
Froot
FundCanna
G Pen
GALAXY
GANJEEZ
Gelato
GEMZ PREMIUM
GLEAF GROUP
Globs
Golden State Cannabis
Good Vibes Cali
Gramlin
Grasshoppers
Gravity
Green Earth Pharmacy
Green Leaf Payroll
Green Life Business Group
Green Rebates
Greenline
Grow Pros
Grown Womxn Good Weed
Habitat
Halara
Hara Brands
Hara Supply
Hard Eighth
Have Hash
Heady Heads
High 90's
High Art Studios
High Desert Pure
High Glimmer
High Gorgeous
High Grade Distribution
High Rise Agency
Honey king
Humboldt Terp Council
Humo
HYROAD
ICED
Infinite Chemical Analysis Labs
International Horticultural Technologies
Jade hall
James so
Jeeter
Kali gold
Kiva
Koa
Kush Cart
Kushie Brand
Lagunitas Hi-Fi Sessions
LAX PACKS
Leafbuyer Technologies
Lost Farm
Loud+Clear
Lucky
Luigi Oil
Lyfe Sauce
Mary's Medicinals
Master makers
Maven Genetics
Meadow
Mendocino Natural Farms
Miss Grass
Mohave Cannabis Co.
Moon Valley
Mr. Zips
Natura
Nature Based Technologies
Noah's Premium
Noble Pacific
Oakfruitland
Ocean Deep Extraction Labs
OG Cannabis Insurance
ONGROK
ORIGINAL DUNKZ
Pacific Cultivation
Paradym
Paybotic
Phenohunt
Phinest Cannabis
PLANEJANE
Poppy's
Preroll Distro.com
Pressure
Pretty Dope
Prime Cut Nursery
PRO-MIX
Profile Products
Proper Rolling Papers
Pure cannalyst Labs
Pureflower
Purpl Scientific
Pusha
Queso Exotics
Quiet Kings
Range Marketing
Raw Garden
ReadyPaid
Redwood Medical Supply
RELEAFY
Rose Garden Cannabis
Rosin Tech Labs
Sacred Stoned
Safe Care Packaging inc
Sattva
Selfies
Sense
SEO Aesthetic
She's Baked
Sherbinskis
Shooters
Sky Gardens
Slimmies
Sluggers
Snowtill Organics
Softrim
SPACE GEM
SPARC
Sparkiez
SparkPlug
Status
Sticky
Stretch n smoke
Studio la Gorgona
Sunset Connect
Surfside
SWEED
Synfinite Labs
Terpy's
Terra
That Good Good Farm
THC Label Solutions
The Bohemian Chemist
The Elevens
The Luxury Kind Tech Co
The Packaging Company
The Plant
Tikun Olam
Treeform Packaging
Treez
Uncle Arnie's
UpNorth
Vader
Valley
Vangst
Vertis
Vlex
Wave Rider
Wavvy
WDSTS
We Grow
West Coast Exotics
Willow Creekside
Willys Garden
Willys selects
Wood Wide
Xiaomi Packaging
Xylem
Yummi Karma
Zig-Zag
ZZZ's Rolling`.split("\n").filter(Boolean);

const participantLists = [
  {
    _id: "list-ventura-retailers",
    _type: "participantList",
    title: "Confirmed Retailers for Ventura 2026",
    conference: { _type: "reference", _ref: "conf-ventura-2026" },
    listType: "retailer",
    entries: retailerNames.map((name) => ({
      _key: generateKey(),
      name: name.trim(),
    })),
  },
  {
    _id: "list-ventura-exhibitors",
    _type: "participantList",
    title: "Confirmed Exhibitors for Ventura 2026",
    conference: { _type: "reference", _ref: "conf-ventura-2026" },
    listType: "exhibitor",
    entries: exhibitorNames.map((name) => ({
      _key: generateKey(),
      name: name.trim(),
    })),
  },
];

// ─── Retailer List + Exhibitor List Pages ─────────────────────────

const listPages = [
  {
    _id: "page-retailer-list",
    _type: "page",
    title: "Confirmed Retailer List",
    slug: { _type: "slug", current: "ventura-retailer-list" },
    conference: { _type: "reference", _ref: "conf-ventura-2026" },
    content: [
      {
        _type: "participantDirectory",
        _key: generateKey(),
        participantList: {
          _type: "reference",
          _ref: "list-ventura-retailers",
        },
      },
    ],
  },
  {
    _id: "page-exhibitor-list",
    _type: "page",
    title: "Confirmed Exhibitor List",
    slug: { _type: "slug", current: "ventura-exhibitor-list" },
    conference: { _type: "reference", _ref: "conf-ventura-2026" },
    content: [
      {
        _type: "participantDirectory",
        _key: generateKey(),
        participantList: {
          _type: "reference",
          _ref: "list-ventura-exhibitors",
        },
      },
    ],
  },
];

// ─── Navigation ───────────────────────────────────────────────────

const navigation = [
  {
    _id: "nav-marketing",
    _type: "navigation",
    site: "marketing",
    showConferenceDates: true,
    items: [
      { _key: generateKey(), label: "Exhibitors", link: "/exhibitors" },
      { _key: generateKey(), label: "Retailers", link: "/retailers" },
      { _key: generateKey(), label: "BLUEPRINT", link: "/bp" },
      { _key: generateKey(), label: "Media", link: "/media" },
      {
        _key: generateKey(),
        label: "Contact",
        link: "mailto:info@hallofflowers.com",
      },
      { _key: generateKey(), label: "Subscribe", link: "/subscribe" },
    ],
    ctaButtons: [
      {
        _key: generateKey(),
        _type: "cta",
        label: "Tickets",
        url: "/tickets",
        variant: "primary",
      },
      {
        _key: generateKey(),
        _type: "cta",
        label: "Retailer Application",
        url: "/retailers",
        variant: "secondary",
      },
      {
        _key: generateKey(),
        _type: "cta",
        label: "Exhibitor Application",
        url: "/exhibitors",
        variant: "secondary",
      },
    ],
    socialLinks: [
      {
        _key: generateKey(),
        platform: "Instagram",
        url: "https://www.instagram.com/hallofflowers/",
      },
      {
        _key: generateKey(),
        platform: "LinkedIn",
        url: "https://www.linkedin.com/company/hallofflowers/",
      },
      {
        _key: generateKey(),
        platform: "X",
        url: "https://x.com/hallofflowers",
      },
      {
        _key: generateKey(),
        platform: "YouTube",
        url: "https://www.youtube.com/@hallofflowers",
      },
    ],
  },
  {
    _id: "nav-exhibitor",
    _type: "navigation",
    site: "exhibitor",
    showConferenceDates: false,
    items: [
      { _key: generateKey(), label: "Show Info", link: "/show-info" },
      { _key: generateKey(), label: "Rules and Regulations", link: "/rules" },
      { _key: generateKey(), label: "Certificate of Insurance", link: "/insurance" },
      { _key: generateKey(), label: "Exhibitor Passes", link: "/passes" },
      { _key: generateKey(), label: "Solicitors License", link: "/solicitors-license" },
      { _key: generateKey(), label: "Marketing & PR", link: "/marketing-pr" },
      { _key: generateKey(), label: "Booth Types", link: "/booth-types" },
      { _key: generateKey(), label: "Video Guide", link: "/video-guide" },
      { _key: generateKey(), label: "Cannabis Guidelines", link: "/cannabis-guidelines" },
      { _key: generateKey(), label: "FAQs", link: "/faq" },
    ],
    socialLinks: [],
    ctaButtons: [],
  },
];

// ─── Footer ───────────────────────────────────────────────────────

const footers = [
  {
    _id: "footer-marketing",
    _type: "footer",
    site: "marketing",
    columns: [
      {
        _key: generateKey(),
        heading: "Events",
        links: [
          { _key: generateKey(), label: "Exhibitors", url: "/exhibitors" },
          { _key: generateKey(), label: "Retailers", url: "/retailers" },
          { _key: generateKey(), label: "Media", url: "/media" },
          { _key: generateKey(), label: "BLUEPRINT", url: "/bp" },
        ],
      },
      {
        _key: generateKey(),
        heading: "Company",
        links: [
          { _key: generateKey(), label: "Subscribe", url: "/subscribe" },
          {
            _key: generateKey(),
            label: "Contact",
            url: "mailto:info@hallofflowers.com",
          },
          {
            _key: generateKey(),
            label: "Privacy Policy",
            url: "/privacy-policy",
          },
        ],
      },
    ],
    socialLinks: [
      {
        _key: generateKey(),
        platform: "Instagram",
        url: "https://www.instagram.com/hallofflowers/",
      },
      {
        _key: generateKey(),
        platform: "LinkedIn",
        url: "https://www.linkedin.com/company/hallofflowers/",
      },
      {
        _key: generateKey(),
        platform: "X",
        url: "https://x.com/hallofflowers",
      },
      {
        _key: generateKey(),
        platform: "YouTube",
        url: "https://www.youtube.com/@hallofflowers",
      },
    ],
    legalText: [
      textBlock("CEO14-0000002-LIC"),
      textBlock("© 2026 Hall of Flowers. All rights reserved."),
    ],
  },
];

// ─── Site Settings ────────────────────────────────────────────────

const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  homepage: { _type: "reference", _ref: "page-homepage" },
  activeConference: { _type: "reference", _ref: "conf-ventura-2026" },
  secondaryConference: undefined,
  showSubscriptionModal: true,
  defaultSeo: {
    _type: "seoFields",
    metaTitle: "Hall of Flowers | The World's Premier Cannabis Trade Show",
    metaDescription:
      "Hall of Flowers is the world's premier cannabis trade show connecting brands, retailers, and industry leaders since 2018.",
  },
};

// ─── Execute ──────────────────────────────────────────────────────

async function seed() {
  console.log("Starting Sanity seed...\n");

  const allDocs = [
    ...venues,
    ...contacts,
    ...conferences,
    ...participantLists,
    ...pages,
    ...listPages,
    ...navigation,
    ...footers,
    siteSettings,
  ];

  let transaction = client.transaction();

  for (const doc of allDocs) {
    transaction = transaction.createOrReplace(doc);
  }

  console.log(`Creating ${allDocs.length} documents...`);
  const result = await transaction.commit();
  console.log(`\n✅ Done! Created/updated ${result.documentIds.length} documents.`);

  // Summary
  console.log("\nDocuments created:");
  console.log(`  ${venues.length} venues`);
  console.log(`  ${contacts.length} contacts`);
  console.log(`  ${conferences.length} conferences`);
  console.log(`  ${participantLists.length} participant lists`);
  console.log(
    `  ${pages.length + listPages.length} pages`
  );
  console.log(`  ${navigation.length} navigation configs`);
  console.log(`  ${footers.length} footer configs`);
  console.log(`  1 site settings`);
  console.log(
    `\n  Retailers: ${retailerNames.length} entries`
  );
  console.log(
    `  Exhibitors: ${exhibitorNames.length} entries`
  );
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
