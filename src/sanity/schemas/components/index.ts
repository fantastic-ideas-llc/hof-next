import { hero } from "./hero";
import { copyBlock } from "./copy-block";
import { mediaEmbed } from "./media-embed";
import { twoUp } from "./two-up";
import { gallery } from "./gallery";
import { formSection } from "./form-section";
import { conferenceCards } from "./conference-cards";
import { conferenceInfoBlock } from "./conference-info-block";
import { contactList } from "./contact-list";
import { participantDirectory } from "./participant-directory";
import { newsletterSignup } from "./newsletter-signup";

/**
 * All page builder component schemas.
 * These are registered as schema types AND used in the page/exhibitorPage content array.
 */
export const componentSchemas = [
  hero,
  copyBlock,
  mediaEmbed,
  twoUp,
  gallery,
  formSection,
  conferenceCards,
  conferenceInfoBlock,
  contactList,
  participantDirectory,
  newsletterSignup,
];

/**
 * Array members for the page builder `content` field.
 * Used in both `page` and `exhibitorPage` schemas.
 */
export const pageBuilderComponents = [
  { type: "hero" },
  { type: "copyBlock" },
  { type: "mediaEmbed" },
  { type: "twoUp" },
  { type: "gallery" },
  { type: "formSection" },
  { type: "conferenceCards" },
  { type: "conferenceInfoBlock" },
  { type: "contactList" },
  { type: "participantDirectory" },
  { type: "newsletterSignup" },
];
