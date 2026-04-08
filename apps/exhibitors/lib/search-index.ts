import { categoryLabels } from "@hof/sanity";
import type { ConferenceBundle } from "./data";

interface StructuredDataHeading {
	id: string;
	content: string;
}

interface StructuredDataContent {
	heading: string | undefined;
	content: string;
}

interface StructuredData {
	headings: StructuredDataHeading[];
	contents: StructuredDataContent[];
}

interface SearchIndex {
	id: string;
	title: string;
	description?: string;
	breadcrumbs?: string[];
	structuredData: StructuredData;
	url: string;
}

type Block = {
	_type?: string;
	body?: string;
	children?: { text?: string }[];
	style?: string;
	title?: string;
};

function slugify(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}

function extractText(blocks: unknown[]): StructuredData {
	const headings: StructuredDataHeading[] = [];
	const sections: Map<string | undefined, string[]> = new Map();
	let currentHeading: string | undefined;

	for (const item of blocks) {
		const block = item as Block;

		if (block._type === "block") {
			const text = (block.children ?? []).map((c) => c.text ?? "").join("");
			if (!text) continue;

			const style = block.style ?? "normal";
			if (["h2", "h3", "h4"].includes(style)) {
				const id = slugify(text);
				headings.push({ id, content: text });
				currentHeading = id;
			} else {
				const existing = sections.get(currentHeading) ?? [];
				existing.push(text);
				sections.set(currentHeading, existing);
			}
		} else if (block._type === "callout") {
			const text = [block.title, block.body].filter(Boolean).join(": ");
			if (text) {
				const existing = sections.get(currentHeading) ?? [];
				existing.push(text);
				sections.set(currentHeading, existing);
			}
		} else if (block._type === "stepsBlock") {
			const steps = (block as { steps?: { title?: string; body?: string }[] }).steps ?? [];
			const text = steps.map((s) => [s.title, s.body].filter(Boolean).join(": ")).join(" ");
			if (text) {
				const existing = sections.get(currentHeading) ?? [];
				existing.push(text);
				sections.set(currentHeading, existing);
			}
		} else if (block._type === "tabsBlock") {
			const tabs = (block as { tabs?: { label?: string; body?: string }[] }).tabs ?? [];
			const text = tabs.map((t) => [t.label, t.body].filter(Boolean).join(": ")).join(" ");
			if (text) {
				const existing = sections.get(currentHeading) ?? [];
				existing.push(text);
				sections.set(currentHeading, existing);
			}
		} else if (block._type === "accordionBlock") {
			const items = (block as { items?: { title?: string; body?: string }[] }).items ?? [];
			const text = items.map((a) => [a.title, a.body].filter(Boolean).join(": ")).join(" ");
			if (text) {
				const existing = sections.get(currentHeading) ?? [];
				existing.push(text);
				sections.set(currentHeading, existing);
			}
		} else if (block._type === "cardGrid") {
			const cards = (block as { cards?: { title?: string; description?: string }[] }).cards ?? [];
			const text = cards.map((c) => [c.title, c.description].filter(Boolean).join(": ")).join(" ");
			if (text) {
				const existing = sections.get(currentHeading) ?? [];
				existing.push(text);
				sections.set(currentHeading, existing);
			}
		} else if (block._type === "bannerBlock") {
			const content = (block as { content?: string }).content;
			if (content) {
				const existing = sections.get(currentHeading) ?? [];
				existing.push(content);
				sections.set(currentHeading, existing);
			}
		}
	}

	const contents: StructuredDataContent[] = [];
	for (const [heading, paragraphs] of sections) {
		contents.push({ heading, content: paragraphs.join(" ") });
	}

	return { headings, contents };
}

export function buildConferenceSearchIndex(
	conferenceSlug: string,
	bundle: ConferenceBundle,
): SearchIndex[] {
	const indexes: SearchIndex[] = [];

	for (const doc of bundle.docs) {
		indexes.push({
			id: `doc-${doc._id}`,
			title: doc.title,
			description: doc.description,
			breadcrumbs: ["Docs", categoryLabels[doc.category]],
			structuredData: { headings: [], contents: [] },
			url: `/${conferenceSlug}/${doc.slug}`,
		});
	}

	for (const booth of bundle.booths) {
		const desc = [booth.description, booth.dimensions, booth.includes?.join(", ")]
			.filter(Boolean)
			.join(". ");
		indexes.push({
			id: `booth-${booth._id}`,
			title: booth.name,
			description: desc || undefined,
			breadcrumbs: ["Booth types"],
			structuredData: { headings: [], contents: [] },
			url: `/${conferenceSlug}/booths/${booth.slug}`,
		});
	}

	for (const faq of bundle.faqs) {
		indexes.push({
			id: `faq-${faq._id}`,
			title: faq.question,
			breadcrumbs: ["Exhibitor FAQs"],
			structuredData: { headings: [], contents: [] },
			url: `/${conferenceSlug}/faqs/${faq.slug}`,
		});
	}

	return indexes;
}

export async function buildFullSearchIndex(
	conferenceSlug: string,
	bundle: ConferenceBundle,
	fetchDocBody: (slug: string) => Promise<{ body: unknown[] } | null>,
	fetchBoothSpecs: (slug: string) => Promise<{ specs?: unknown[] } | null>,
	fetchFaqAnswer: (slug: string) => Promise<{ answer: unknown[] } | null>,
): Promise<SearchIndex[]> {
	const indexes: SearchIndex[] = [];

	const [docPages, boothPages, faqPages] = await Promise.all([
		Promise.all(bundle.docs.map((d) => fetchDocBody(d.slug))),
		Promise.all(bundle.booths.map((b) => fetchBoothSpecs(b.slug))),
		Promise.all(bundle.faqs.map((f) => fetchFaqAnswer(f.slug))),
	]);

	for (let i = 0; i < bundle.docs.length; i++) {
		const doc = bundle.docs[i];
		const page = docPages[i];
		indexes.push({
			id: `doc-${doc._id}`,
			title: doc.title,
			description: doc.description,
			breadcrumbs: ["Docs", categoryLabels[doc.category]],
			structuredData: page?.body ? extractText(page.body) : { headings: [], contents: [] },
			url: `/${conferenceSlug}/${doc.slug}`,
		});
	}

	for (let i = 0; i < bundle.booths.length; i++) {
		const booth = bundle.booths[i];
		const page = boothPages[i];
		const desc = [booth.description, booth.dimensions, booth.includes?.join(", ")]
			.filter(Boolean)
			.join(". ");
		indexes.push({
			id: `booth-${booth._id}`,
			title: booth.name,
			description: desc || undefined,
			breadcrumbs: ["Booth types"],
			structuredData: page?.specs ? extractText(page.specs) : { headings: [], contents: [] },
			url: `/${conferenceSlug}/booths/${booth.slug}`,
		});
	}

	for (let i = 0; i < bundle.faqs.length; i++) {
		const faq = bundle.faqs[i];
		const page = faqPages[i];
		indexes.push({
			id: `faq-${faq._id}`,
			title: faq.question,
			breadcrumbs: ["Exhibitor FAQs"],
			structuredData: page?.answer ? extractText(page.answer) : { headings: [], contents: [] },
			url: `/${conferenceSlug}/faqs/${faq.slug}`,
		});
	}

	return indexes;
}
