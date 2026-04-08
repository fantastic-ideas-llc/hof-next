import { defineField, defineType } from "sanity";

import { faqAudiences } from "../constants";
import { createSlugField, isSlugUniqueWithinConference } from "./helpers";

export const faqType = defineType({
	name: "faq",
	title: "FAQ",
	type: "document",
	fields: [
		defineField({
			name: "question",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		createSlugField("question", "Slug", isSlugUniqueWithinConference("faq")),
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
			name: "audience",
			type: "string",
			initialValue: "exhibitor",
			options: {
				list: faqAudiences.map((value) => ({
					title: value,
					value,
				})),
			},
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
			audience: "audience",
			conference: "conference.name",
			title: "question",
		},
		prepare({ audience, conference, title }) {
			return {
				title,
				subtitle: `${conference ?? "No conference"} - ${audience ?? "audience not set"}`,
			};
		},
	},
});
