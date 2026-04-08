import {
	ACTIVE_CONFERENCES_QUERY,
	BOOTH_PAGE_BY_SLUGS_QUERY,
	BOOTHS_FOR_CONFERENCE_QUERY,
	type BoothTypePage,
	type BoothTypeSummary,
	CONFERENCE_BY_SLUG_QUERY,
	CONFERENCE_SEARCH_QUERY,
	type Conference,
	type ConferenceSearchMatches,
	type ConferenceSummary,
	categoryLabels,
	DOC_PAGE_BY_SLUGS_QUERY,
	DOCS_FOR_CONFERENCE_QUERY,
	type ExhibitorDocPage,
	type ExhibitorDocSummary,
	FAQ_PAGE_BY_SLUGS_QUERY,
	FAQS_FOR_CONFERENCE_QUERY,
	type FaqPage,
	type FaqSummary,
} from "@hof/sanity";
import { cache } from "react";

import {
	getMockBoothPage,
	getMockConferenceBundle,
	getMockConferenceSummaries,
	getMockDocPage,
	getMockFaqPage,
	searchMockConference,
} from "./mock-data";
import { sanityFetch } from "./sanity/client";
import { hasSanityEnv } from "./sanity/env";

export interface ConferenceBundle {
	booths: BoothTypeSummary[];
	conference: Conference;
	docs: ExhibitorDocSummary[];
	faqs: FaqSummary[];
}

function normalizeConference(conference: Conference): Conference {
	return {
		...conference,
		contacts: conference.contacts ?? [],
		hours: conference.hours ?? [],
		timelineSections: conference.timelineSections ?? [],
	};
}

export const getActiveConferences = cache(async (): Promise<ConferenceSummary[]> => {
	if (!hasSanityEnv) return getMockConferenceSummaries();

	return sanityFetch<ConferenceSummary[]>(ACTIVE_CONFERENCES_QUERY);
});

export const getConferenceBundle = cache(
	async (conferenceSlug: string): Promise<ConferenceBundle | null> => {
		if (!hasSanityEnv) {
			return getMockConferenceBundle(conferenceSlug);
		}

		const conference = await sanityFetch<Conference | null>(CONFERENCE_BY_SLUG_QUERY, {
			conferenceSlug,
		});
		if (!conference) return null;

		const [docs, booths, faqs] = await Promise.all([
			sanityFetch<ExhibitorDocSummary[]>(DOCS_FOR_CONFERENCE_QUERY, {
				conferenceId: conference._id,
			}),
			sanityFetch<BoothTypeSummary[]>(BOOTHS_FOR_CONFERENCE_QUERY, {
				conferenceId: conference._id,
			}),
			sanityFetch<FaqSummary[]>(FAQS_FOR_CONFERENCE_QUERY, {
				conferenceId: conference._id,
			}),
		]);

		return {
			booths: booths ?? [],
			conference: normalizeConference(conference),
			docs: docs ?? [],
			faqs: faqs ?? [],
		};
	},
);

export const getDocPage = cache(
	async (conferenceSlug: string, slug: string): Promise<ExhibitorDocPage | null> => {
		if (!hasSanityEnv) return getMockDocPage(slug);

		return sanityFetch<ExhibitorDocPage | null>(DOC_PAGE_BY_SLUGS_QUERY, {
			conferenceSlug,
			slug,
		});
	},
);

export const getBoothPage = cache(
	async (conferenceSlug: string, slug: string): Promise<BoothTypePage | null> => {
		if (!hasSanityEnv) return getMockBoothPage(slug);

		return sanityFetch<BoothTypePage | null>(BOOTH_PAGE_BY_SLUGS_QUERY, {
			conferenceSlug,
			slug,
		});
	},
);

export const getFaqPage = cache(
	async (conferenceSlug: string, slug: string): Promise<FaqPage | null> => {
		if (!hasSanityEnv) return getMockFaqPage(slug);

		return sanityFetch<FaqPage | null>(FAQ_PAGE_BY_SLUGS_QUERY, {
			conferenceSlug,
			slug,
		});
	},
);

export async function searchConference(
	conferenceSlug: string,
	query: string,
): Promise<
	{
		breadcrumbs: string[];
		content: string;
		id: string;
		type: "page";
		url: string;
	}[]
> {
	const normalized = query.trim();
	if (!normalized) return [];

	if (!hasSanityEnv) {
		const mockResults = searchMockConference(normalized);
		return mapConferenceSearch(conferenceSlug, mockResults);
	}

	const conference = await getConferenceBundle(conferenceSlug);
	if (!conference) return [];

	const search = `*${normalized}*`;
	const results = await sanityFetch<ConferenceSearchMatches>(CONFERENCE_SEARCH_QUERY, {
		conferenceId: conference.conference._id,
		search,
	});

	return mapConferenceSearch(conferenceSlug, results);
}

function mapConferenceSearch(conferenceSlug: string, results: ConferenceSearchMatches) {
	return [
		...results.docs.map((doc) => ({
			breadcrumbs: ["Docs", categoryLabels[doc.category]],
			content: doc.title,
			id: `doc-${doc._id}`,
			type: "page" as const,
			url: `/${conferenceSlug}/${doc.slug}`,
		})),
		...results.booths.map((booth) => ({
			breadcrumbs: ["Booth types"],
			content: booth.name,
			id: `booth-${booth._id}`,
			type: "page" as const,
			url: `/${conferenceSlug}/booths/${booth.slug}`,
		})),
		...results.faqs.map((faq) => ({
			breadcrumbs: ["Exhibitor FAQs"],
			content: faq.question,
			id: `faq-${faq._id}`,
			type: "page" as const,
			url: `/${conferenceSlug}/faqs/${faq.slug}`,
		})),
	].slice(0, 12);
}
