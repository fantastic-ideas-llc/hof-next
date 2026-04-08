export const SANITY_API_VERSION = "2026-04-03";

export const conferenceStatuses = ["draft", "active", "archived"] as const;
export type ConferenceStatus = (typeof conferenceStatuses)[number];

export const docCategories = [
	"show-info",
	"booth-types",
	"cannabis-guidelines",
	"video-guides",
] as const;
export type DocCategory = (typeof docCategories)[number];

export const faqAudiences = ["exhibitor", "attendee", "both"] as const;
export type FaqAudience = (typeof faqAudiences)[number];

export const categoryLabels: Record<DocCategory, string> = {
	"show-info": "Show info",
	"booth-types": "Booth types",
	"cannabis-guidelines": "Cannabis guidelines",
	"video-guides": "Video guides",
};
