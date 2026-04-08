import type { ConferenceStatus, DocCategory } from "./constants";

export interface ImageAssetRef {
	_ref?: string;
	_type?: "reference";
}

export interface ImageValue {
	_type?: "image";
	asset?: ImageAssetRef;
	alt?: string;
	caption?: string;
}

export interface StaffContact {
	_id: string;
	name: string;
	email: string;
	roles?: string[];
}

export interface ConferenceSummary {
	_id: string;
	name: string;
	slug: string;
	status: ConferenceStatus;
	startDate?: string;
	endDate?: string;
	city?: string;
	state?: string;
	description?: unknown[];
}

export interface ConferenceVenue {
	name?: string;
	address?: string;
	city?: string;
	state?: string;
	zip?: string;
	mapUrl?: string;
}

export interface ConferenceHours {
	_key?: string;
	day: string;
	open: string;
	close: string;
}

export interface ConferenceTimelineEntry {
	_key?: string;
	date: string;
	deliverables: Array<{
		_key?: string;
		label: string;
		timeRange?: string;
	}>;
	note?: string;
	relativeLabel?: string;
}

export interface ConferenceTimelineSection {
	_key?: string;
	entries: ConferenceTimelineEntry[];
	title: string;
}

export interface Conference extends ConferenceSummary {
	venue?: ConferenceVenue;
	hours?: ConferenceHours[];
	timelineSections?: ConferenceTimelineSection[];
	contacts: StaffContact[];
}

export interface ExhibitorDocSummary {
	_id: string;
	title: string;
	slug: string;
	category: DocCategory;
	description?: string;
	publishedAt?: string;
}

export interface ExhibitorDocPage extends ExhibitorDocSummary {
	body: unknown[];
}

export interface BoothTypeSummary {
	_id: string;
	name: string;
	slug: string;
	description?: string;
	dimensions?: string;
	price?: number;
	includes?: string[];
}

export interface BoothTypePage extends BoothTypeSummary {
	specs?: unknown[];
	images?: ImageValue[];
}

export interface FaqSummary {
	_id: string;
	question: string;
	slug: string;
}

export interface FaqPage extends FaqSummary {
	answer: unknown[];
}

export interface ConferenceSearchMatches {
	docs: ExhibitorDocSummary[];
	booths: BoothTypeSummary[];
	faqs: FaqSummary[];
}
