import type { SlugIsUniqueValidator } from "sanity";
import { defineField } from "sanity";

import { SANITY_API_VERSION } from "../constants";

export function createSlugField(source: string, label = "Slug", isUnique?: SlugIsUniqueValidator) {
	return defineField({
		name: "slug",
		title: label,
		type: "slug",
		options: {
			source,
			maxLength: 96,
			isUnique,
		},
		validation: (rule) =>
			rule.required().custom((value) => {
				if (!value?.current) return "Slug is required.";
				if (!/^[a-z0-9-]+$/.test(value.current)) {
					return "Use lowercase letters, numbers, and hyphens only.";
				}

				return true;
			}),
	});
}

export function isSlugUniqueWithinConference(documentType: string): SlugIsUniqueValidator {
	return async (slug, context) => {
		const value = slug;
		if (!value) return true;

		const conferenceId = (context.document as { conference?: { _ref?: string } } | undefined)
			?.conference?._ref;
		if (!conferenceId) return true;

		const currentId = context.document?._id?.replace(/^drafts\./, "");
		if (!currentId) return true;

		const client = context.getClient({ apiVersion: SANITY_API_VERSION });
		const params = {
			conferenceId,
			currentId,
			draftId: `drafts.${currentId}`,
			slug: value,
		};
		const query = `
			count(*[
				_type == $documentType &&
				conference._ref == $conferenceId &&
				slug.current == $slug &&
				!(_id in [$currentId, $draftId])
			])
		`;
		const count = await client.fetch<number>(query, {
			...params,
			documentType,
		});

		return count === 0;
	};
}
