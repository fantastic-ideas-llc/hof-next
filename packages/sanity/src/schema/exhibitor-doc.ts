import { defineField, defineType } from "sanity";

import { categoryLabels, docCategories } from "../constants";
import { createSlugField, isSlugUniqueWithinConference } from "./helpers";

export const exhibitorDocType = defineType({
	name: "exhibitorDoc",
	title: "Exhibitor doc",
	type: "document",
	fields: [
		defineField({
			name: "title",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		createSlugField("title", "Slug", isSlugUniqueWithinConference("exhibitorDoc")),
		defineField({
			name: "description",
			type: "text",
			rows: 3,
			validation: (rule) => rule.max(180).warning("Keep this concise for cards and search."),
		}),
		defineField({
			name: "conference",
			type: "reference",
			to: [{ type: "conference" }],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "category",
			type: "string",
			options: {
				list: docCategories.map((value) => ({
					title: categoryLabels[value],
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
		defineField({
			name: "body",
			type: "blockContent",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "publishedAt",
			type: "datetime",
		}),
	],
	preview: {
		select: {
			category: "category",
			conference: "conference.name",
			title: "title",
		},
		prepare({ category, conference, title }) {
			return {
				title,
				subtitle: `${conference ?? "No conference"} - ${category ?? "uncategorized"}`,
			};
		},
	},
});
