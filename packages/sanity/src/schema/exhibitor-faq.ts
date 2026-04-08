import { defineField, defineType } from "sanity";

import { createSlugField, isSlugUniqueWithinConference } from "./helpers";

export const exhibitorFaqType = defineType({
	name: "exhibitorFaq",
	title: "Exhibitor FAQ",
	type: "document",
	fields: [
		defineField({
			name: "question",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		createSlugField("question", "Slug", isSlugUniqueWithinConference("exhibitorFaq")),
		defineField({
			name: "answer",
			type: "blockContent",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "conference",
			type: "reference",
			to: [{ type: "conference" }],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "sortOrder",
			type: "number",
			initialValue: 100,
		}),
	],
	preview: {
		select: {
			conference: "conference.name",
			title: "question",
		},
		prepare({ conference, title }) {
			return {
				title,
				subtitle: conference ?? "No conference",
			};
		},
	},
});
