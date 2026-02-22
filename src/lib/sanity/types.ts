// ─── Sanity TypeScript Types ────────────────────────────────────
// Manual types until Sanity TypeGen is configured in Phase 3.

import type { PortableTextBlock } from "@portabletext/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SanityImage = any;

// ─── Shared Object Types ────────────────────────────────────────

export interface CTA {
  _key: string;
  label: string;
  url: string;
  variant: "primary" | "secondary";
}

export interface SeoFields {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SanityImage;
}

export interface DateRange {
  _key: string;
  label: string;
  startDate: string;
  endDate: string;
}

// ─── Core Documents ─────────────────────────────────────────────

export interface Venue {
  _id: string;
  _type: "venue";
  name: string;
  city: string;
  state: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
  image?: SanityImage;
}

export interface Contact {
  _id: string;
  _type: "contact";
  name: string;
  role?: string;
  department:
    | "retail-relations"
    | "marketing"
    | "cannabis-guidelines"
    | "exhibitor-sales"
    | "onboarding"
    | "operations"
    | "general";
  email: string;
  phone?: string;
  image?: SanityImage;
}

export interface Conference {
  _id: string;
  _type: "conference";
  title: string;
  slug: { current: string };
  location?: Venue;
  startDate: string;
  endDate: string;
  status: "draft" | "upcoming" | "active" | "completed";
  tagline?: string;
  description?: PortableTextBlock[];
  heroImage?: SanityImage;
  loadInSchedule?: DateRange[];
  showSchedule?: DateRange[];
  contacts?: Contact[];
  urlPrefix?: { current: string };
}

export interface ParticipantList {
  _id: string;
  _type: "participantList";
  title: string;
  conference?: Conference;
  listType: "retailer" | "exhibitor";
  entries?: { _key: string; name: string }[];
}

// ─── Page Builder Component Types ───────────────────────────────

export interface HeroComponent {
  _type: "hero";
  _key: string;
  backgroundType: "image" | "video";
  backgroundImage?: SanityImage;
  backgroundVideo?: { asset: { url: string } };
  backgroundVideoPoster?: SanityImage;
  overlayStrength: "none" | "light" | "medium" | "heavy";
  body?: PortableTextBlock[];
  textAlignment: "left" | "center";
  ctas?: CTA[];
}

export interface CopyBlockComponent {
  _type: "copyBlock";
  _key: string;
  body: PortableTextBlock[];
  width: "narrow" | "medium" | "wide" | "full";
  textAlignment: "left" | "center";
}

export interface MediaEmbedComponent {
  _type: "mediaEmbed";
  _key: string;
  mediaType: "youtube" | "upload";
  youtubeUrl?: string;
  videoFile?: { asset: { url: string } };
  posterImage?: SanityImage;
  caption?: string;
  width: "medium" | "wide" | "full";
}

export interface TwoUpComponent {
  _type: "twoUp";
  _key: string;
  image: SanityImage;
  imagePosition: "left" | "right";
  body: PortableTextBlock[];
  ctas?: CTA[];
  tone: "neutral" | "subtle" | "bold" | "brand";
}

export interface GalleryComponent {
  _type: "gallery";
  _key: string;
  heading?: string;
  images: (SanityImage & { alt: string; caption?: string })[];
  columns: number;
}

export interface ConferenceCardsComponent {
  _type: "conferenceCards";
  _key: string;
  heading?: string;
  conferences: Conference[];
  layout: "side-by-side" | "stacked";
  cardStyle: "full" | "compact";
}

export interface ConferenceInfoBlockComponent {
  _type: "conferenceInfoBlock";
  _key: string;
  conference?: Conference;
  showFields?: string[];
  showExhibitorPages?: string[];
  displayMode: "summary" | "inline";
}

export interface ContactListComponent {
  _type: "contactList";
  _key: string;
  heading?: string;
  conference?: Conference;
  filterByDepartment?: string[];
  layout: "grid" | "list";
}

export interface ParticipantDirectoryComponent {
  _type: "participantDirectory";
  _key: string;
  participantList?: ParticipantList;
}

export interface FormSectionComponent {
  _type: "formSection";
  _key: string;
  heading?: string;
  description?: PortableTextBlock[];
  formSource: "embed" | "zohoApi";
  embedCode?: string;
  zohoFormId?: string;
}

export interface NewsletterSignupComponent {
  _type: "newsletterSignup";
  _key: string;
  heading?: string;
  description?: PortableTextBlock[];
  interestOptions?: { _key: string; label: string; value: string }[];
  successMessage?: string;
}

export type PageBuilderComponent =
  | HeroComponent
  | CopyBlockComponent
  | MediaEmbedComponent
  | TwoUpComponent
  | GalleryComponent
  | ConferenceCardsComponent
  | ConferenceInfoBlockComponent
  | ContactListComponent
  | ParticipantDirectoryComponent
  | FormSectionComponent
  | NewsletterSignupComponent;

// ─── Page Documents ─────────────────────────────────────────────

export interface Page {
  _id: string;
  _type: "page";
  title: string;
  slug: { current: string };
  conference?: Conference;
  seo?: SeoFields;
  content?: PageBuilderComponent[];
}

export interface ExhibitorPage {
  _id: string;
  _type: "exhibitorPage";
  title: string;
  slug: { current: string };
  conference?: Conference;
  category?: string;
  seo?: SeoFields;
  content?: PageBuilderComponent[];
}

// ─── Navigation & Footer ────────────────────────────────────────

export interface NavItem {
  _key: string;
  label: string;
  link: string;
  children?: NavItem[];
}

export interface SocialLink {
  _key: string;
  platform: string;
  url: string;
}

export interface Navigation {
  items?: NavItem[];
  ctaButtons?: CTA[];
  socialLinks?: SocialLink[];
  showConferenceDates?: boolean;
}

export interface FooterColumn {
  _key: string;
  heading: string;
  links: { _key: string; label: string; url: string }[];
}

export interface Footer {
  columns?: FooterColumn[];
  socialLinks?: SocialLink[];
  legalText?: PortableTextBlock[];
}

// ─── Site Settings ──────────────────────────────────────────────

export interface SiteSettings {
  homepage?: Page;
  activeConference?: Conference;
  secondaryConference?: Conference;
  logo?: SanityImage;
  logoMark?: SanityImage;
  showSubscriptionModal?: boolean;
  defaultSeo?: SeoFields;
}

// ─── Redirect ───────────────────────────────────────────────────

export interface Redirect {
  source: string;
  destination: string;
  permanent: boolean;
}
