import { defineArrayMember, defineField, defineType } from "sanity";

export const venueType = defineType({
	name: "venue",
	title: "Venue",
	type: "object",
	fields: [
		defineField({
			name: "name",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "address",
			type: "text",
			rows: 3,
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "city",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "state",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "zip",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "mapUrl",
			type: "url",
			validation: (rule) => rule.uri({ scheme: ["http", "https"] }).warning("Use a full map URL."),
		}),
	],
});

export const conferenceHoursType = defineType({
	name: "conferenceHours",
	title: "Conference hours",
	type: "object",
	fields: [
		defineField({
			name: "day",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "open",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "close",
			type: "string",
			validation: (rule) => rule.required(),
		}),
	],
	preview: {
		select: {
			close: "close",
			day: "day",
			open: "open",
		},
		prepare({ close, day, open }) {
			return {
				title: day,
				subtitle: `${open} - ${close}`,
			};
		},
	},
});

export const calloutType = defineType({
	name: "callout",
	title: "Callout",
	type: "object",
	fields: [
		defineField({
			name: "tone",
			type: "string",
			initialValue: "info",
			options: {
				list: [
					{ title: "Info", value: "info" },
					{ title: "Warning", value: "warning" },
					{ title: "Error", value: "error" },
					{ title: "Success", value: "success" },
					{ title: "Idea", value: "idea" },
				],
				layout: "radio",
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "title",
			type: "string",
		}),
		defineField({
			name: "body",
			type: "text",
			rows: 4,
			validation: (rule) => rule.required(),
		}),
	],
	preview: {
		select: {
			body: "body",
			title: "title",
			tone: "tone",
		},
		prepare({ body, title, tone }) {
			return {
				title: title || "Callout",
				subtitle: `[${tone}] ${body}`,
			};
		},
	},
});

export const codeBlockType = defineType({
	name: "codeBlock",
	title: "Code block",
	type: "object",
	fields: [
		defineField({
			name: "filename",
			type: "string",
		}),
		defineField({
			name: "language",
			type: "string",
			initialValue: "bash",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "code",
			type: "text",
			rows: 12,
			validation: (rule) => rule.required(),
		}),
	],
	preview: {
		select: {
			filename: "filename",
			language: "language",
		},
		prepare({ filename, language }) {
			return {
				title: filename || "Code block",
				subtitle: language,
			};
		},
	},
});

export const blockContentType = defineType({
	name: "blockContent",
	title: "Rich content",
	type: "array",
	of: [
		defineArrayMember({
			type: "block",
			styles: [
				{ title: "Normal", value: "normal" },
				{ title: "H2", value: "h2" },
				{ title: "H3", value: "h3" },
				{ title: "H4", value: "h4" },
				{ title: "Quote", value: "blockquote" },
			],
			lists: [{ title: "Bullet", value: "bullet" }],
			marks: {
				decorators: [
					{ title: "Strong", value: "strong" },
					{ title: "Emphasis", value: "em" },
					{ title: "Code", value: "code" },
				],
				annotations: [
					defineArrayMember({
						name: "link",
						title: "Link",
						type: "object",
						fields: [
							defineField({
								name: "href",
								type: "url",
								validation: (rule) =>
									rule.required().uri({ scheme: ["http", "https", "mailto", "tel"] }),
							}),
						],
					}),
				],
			},
		}),
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
		defineArrayMember({ type: "callout" }),
		defineArrayMember({ type: "codeBlock" }),
		defineArrayMember({ type: "stepsBlock" }),
		defineArrayMember({ type: "tabsBlock" }),
		defineArrayMember({ type: "accordionBlock" }),
		defineArrayMember({ type: "cardGrid" }),
		defineArrayMember({ type: "bannerBlock" }),
		defineArrayMember({ type: "imageZoom" }),
		defineArrayMember({ type: "filesBlock" }),
	],
});
