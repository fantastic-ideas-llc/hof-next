import { defineArrayMember, defineField, defineType } from "sanity";

import { createSlugField, isSlugUniqueWithinConference } from "./helpers";

export const boothType = defineType({
	name: "boothType",
	title: "Booth type",
	type: "document",
	fields: [
		defineField({
			name: "name",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		createSlugField("name", "Slug", isSlugUniqueWithinConference("boothType")),
		defineField({
			name: "conference",
			type: "reference",
			to: [{ type: "conference" }],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "description",
			type: "text",
			rows: 4,
		}),
		defineField({
			name: "dimensions",
			type: "string",
		}),
		defineField({
			name: "price",
			type: "number",
		}),
		defineField({
			name: "includes",
			type: "array",
			of: [defineArrayMember({ type: "string" })],
			validation: (rule) => rule.unique(),
		}),
		defineField({
			name: "images",
			type: "array",
			of: [
				defineArrayMember({
					type: "image",
					options: { hotspot: true },
					fields: [
						defineField({
							name: "alt",
							type: "string",
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "caption",
							type: "string",
						}),
					],
				}),
			],
		}),
		defineField({
			name: "specs",
			type: "blockContent",
		}),
	],
	preview: {
		select: {
			conference: "conference.name",
			title: "name",
		},
		prepare({ conference, title }) {
			return {
				title,
				subtitle: conference,
			};
		},
	},
});
