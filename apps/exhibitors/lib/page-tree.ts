import {
	type BoothTypeSummary,
	type Conference,
	categoryLabels,
	type ExhibitorDocSummary,
	type FaqSummary,
} from "@hof/sanity";
import type { Root } from "fumadocs-core/page-tree";

export function createConferenceTree(input: {
	booths: BoothTypeSummary[];
	conference: Pick<Conference, "name" | "slug">;
	docs: ExhibitorDocSummary[];
	faqs: FaqSummary[];
}): Root {
	const children: Root["children"] = [
		{
			name: "Overview",
			type: "page",
			url: `/${input.conference.slug}`,
		},
	];

	for (const [category, label] of Object.entries(categoryLabels)) {
		const docsForCategory = input.docs.filter((doc) => doc.category === category);
		if (docsForCategory.length === 0) continue;

		children.push({
			children: docsForCategory.map((doc) => ({
				description: doc.description,
				name: doc.title,
				type: "page",
				url: `/${input.conference.slug}/${doc.slug}`,
			})),
			defaultOpen: true,
			name: label,
			type: "folder",
		});
	}

	if (input.booths.length > 0) {
		children.push({
			children: input.booths.map((booth) => ({
				description: booth.description,
				name: booth.name,
				type: "page",
				url: `/${input.conference.slug}/booths/${booth.slug}`,
			})),
			defaultOpen: true,
			name: "Booth types",
			type: "folder",
		});
	}

	if (input.faqs.length > 0) {
		children.push({
			children: input.faqs.map((faq) => ({
				name: faq.question,
				type: "page",
				url: `/${input.conference.slug}/faqs/${faq.slug}`,
			})),
			defaultOpen: true,
			name: "FAQs",
			type: "folder",
		});
	}

	return {
		children,
		name: input.conference.name,
	};
}
