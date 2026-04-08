import { defineField, defineType } from "sanity";

export const staffRoleType = defineType({
	name: "staffRole",
	title: "Role",
	type: "document",
	fields: [
		defineField({
			name: "title",
			type: "string",
			validation: (rule) => rule.required(),
		}),
	],
	preview: {
		select: {
			title: "title",
		},
	},
});
