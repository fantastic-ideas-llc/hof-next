// Shared object types
import { cta } from "./objects/cta";
import { seoFields } from "./objects/seo-fields";
import { dateRange } from "./objects/date-range";
import { blockContent } from "./objects/block-content";

// Document types
import { conference } from "./documents/conference";
import { venue } from "./documents/venue";
import { contact } from "./documents/contact";
import { page } from "./documents/page";
import { exhibitorPage } from "./documents/exhibitor-page";
import { participantList } from "./documents/participant-list";
import { navigation } from "./documents/navigation";
import { footer } from "./documents/footer";
import { redirect } from "./documents/redirect";
import { siteSettings } from "./documents/site-settings";

// Page builder components
import { componentSchemas } from "./components";

export const schemaTypes = [
  // Object types
  cta,
  seoFields,
  dateRange,
  blockContent,

  // Documents
  conference,
  venue,
  contact,
  page,
  exhibitorPage,
  participantList,
  navigation,
  footer,
  redirect,
  siteSettings,

  // Page builder components
  ...componentSchemas,
];
