import { groq } from "next-sanity";

// ─── Site Settings ──────────────────────────────────────────────
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    homepage->{
      _id,
      title,
      slug,
      seo,
      content[]{
        ...,
        _type == "conferenceCards" => {
          ...,
          conferences[]->{
            _id, title, slug, startDate, endDate, status, tagline,
            heroImage, location->{city, state, name}
          }
        },
        _type == "conferenceInfoBlock" => {
          ...,
          conference->{...}
        },
        _type == "contactList" => {
          ...,
          conference->{
            ...,
            contacts[]->{...}
          }
        },
        _type == "participantDirectory" => {
          ...,
          participantList->{...}
        }
      }
    },
    activeConference->{
      _id, title, slug, startDate, endDate, status, tagline,
      location->{city, state, name, address}
    },
    secondaryConference->{
      _id, title, slug, startDate, endDate, status, tagline,
      location->{city, state, name}
    },
    logo,
    logoMark,
    showSubscriptionModal,
    defaultSeo
  }
`;

// ─── Navigation ─────────────────────────────────────────────────
export const navigationQuery = groq`
  *[_type == "navigation" && site == $site][0]{
    items,
    ctaButtons,
    socialLinks,
    showConferenceDates
  }
`;

// ─── Footer ─────────────────────────────────────────────────────
export const footerQuery = groq`
  *[_type == "footer" && site == $site][0]{
    columns,
    socialLinks,
    legalText
  }
`;

// ─── Pages ──────────────────────────────────────────────────────
export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    seo,
    conference->{_id, title, slug},
    content[]{
      ...,
      _type == "conferenceCards" => {
        ...,
        conferences[]->{
          _id, title, slug, startDate, endDate, status, tagline,
          heroImage, location->{city, state, name}
        }
      },
      _type == "conferenceInfoBlock" => {
        ...,
        conference->{...}
      },
      _type == "contactList" => {
        ...,
        conference->{
          ...,
          contacts[]->{...}
        }
      },
      _type == "participantDirectory" => {
        ...,
        participantList->{...}
      }
    }
  }
`;

export const allPageSlugsQuery = groq`
  *[_type == "page" && defined(slug.current)]{
    "slug": slug.current
  }
`;

// ─── Exhibitor Pages ────────────────────────────────────────────
export const exhibitorPageBySlugQuery = groq`
  *[_type == "exhibitorPage" && slug.current == $slug && conference._ref == $conferenceId][0]{
    _id,
    title,
    slug,
    category,
    seo,
    conference->{_id, title, slug},
    content[]{
      ...,
      _type == "conferenceInfoBlock" => {
        ...,
        conference->{...}
      },
      _type == "contactList" => {
        ...,
        conference->{
          ...,
          contacts[]->{...}
        }
      }
    }
  }
`;

export const exhibitorNavQuery = groq`
  *[_type == "exhibitorPage" && conference._ref == $conferenceId] | order(title asc) {
    _id, title, slug, category
  }
`;

// ─── Conferences ────────────────────────────────────────────────
export const upcomingConferencesQuery = groq`
  *[_type == "conference" && status in ["upcoming", "active"]] | order(startDate asc) {
    _id, title, slug, startDate, endDate, status,
    location->{city, state, name}
  }
`;

// ─── Redirects ──────────────────────────────────────────────────
export const allRedirectsQuery = groq`
  *[_type == "redirect"]{
    source,
    destination,
    permanent
  }
`;
