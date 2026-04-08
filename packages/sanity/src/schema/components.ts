import { defineArrayMember, defineField, defineType } from "sanity";

export const stepItemType = defineType({
	name: "stepItem",
	title: "Step",
	type: "object",
	fields: [
		defineField({
			name: "title",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "body",
			type: "text",
			rows: 4,
		}),
	],
	preview: {
		select: { title: "title" },
	},
});

export const stepsBlockType = defineType({
	name: "stepsBlock",
	title: "Steps",
	type: "object",
	fields: [
		defineField({
			name: "steps",
			type: "array",
			of: [defineArrayMember({ type: "stepItem" })],
			validation: (rule) => rule.required().min(1),
		}),
	],
	preview: {
		select: { first: "steps.0.title" },
		prepare({ first }) {
			return { title: "Steps", subtitle: first };
		},
	},
});

export const tabItemType = defineType({
	name: "tabItem",
	title: "Tab",
	type: "object",
	fields: [
		defineField({
			name: "label",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "body",
			type: "text",
			rows: 6,
		}),
	],
	preview: {
		select: { title: "label" },
	},
});

export const tabsBlockType = defineType({
	name: "tabsBlock",
	title: "Tabs",
	type: "object",
	fields: [
		defineField({
			name: "tabs",
			type: "array",
			of: [defineArrayMember({ type: "tabItem" })],
			validation: (rule) => rule.required().min(2),
		}),
	],
	preview: {
		select: { first: "tabs.0.label", second: "tabs.1.label" },
		prepare({ first, second }) {
			return { title: "Tabs", subtitle: [first, second].filter(Boolean).join(" | ") };
		},
	},
});

export const accordionItemType = defineType({
	name: "accordionItem",
	title: "Accordion item",
	type: "object",
	fields: [
		defineField({
			name: "title",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "body",
			type: "text",
			rows: 4,
			validation: (rule) => rule.required(),
		}),
	],
	preview: {
		select: { title: "title" },
	},
});

export const accordionBlockType = defineType({
	name: "accordionBlock",
	title: "Accordion",
	type: "object",
	fields: [
		defineField({
			name: "items",
			type: "array",
			of: [defineArrayMember({ type: "accordionItem" })],
			validation: (rule) => rule.required().min(1),
		}),
	],
	preview: {
		select: { first: "items.0.title" },
		prepare({ first }) {
			return { title: "Accordion", subtitle: first };
		},
	},
});

export const cardItemType = defineType({
	name: "cardItem",
	title: "Card",
	type: "object",
	fields: [
		defineField({
			name: "title",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "description",
			type: "text",
			rows: 3,
		}),
		defineField({
			name: "href",
			type: "url",
			validation: (rule) => rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto"] }),
		}),
	],
	preview: {
		select: { title: "title", subtitle: "href" },
	},
});

export const cardGridType = defineType({
	name: "cardGrid",
	title: "Card grid",
	type: "object",
	fields: [
		defineField({
			name: "cards",
			type: "array",
			of: [defineArrayMember({ type: "cardItem" })],
			validation: (rule) => rule.required().min(1),
		}),
	],
	preview: {
		select: { first: "cards.0.title" },
		prepare({ first }) {
			return { title: "Card grid", subtitle: first };
		},
	},
});

export const bannerBlockType = defineType({
	name: "bannerBlock",
	title: "Banner",
	type: "object",
	fields: [
		defineField({
			name: "content",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "variant",
			type: "string",
			initialValue: "normal",
			options: {
				list: [
					{ title: "Normal", value: "normal" },
					{ title: "Rainbow", value: "rainbow" },
				],
				layout: "radio",
			},
		}),
		defineField({
			name: "changeLayout",
			title: "Sticky",
			type: "boolean",
			initialValue: false,
		}),
	],
	preview: {
		select: { title: "content", variant: "variant" },
		prepare({ title, variant }) {
			return { title: title || "Banner", subtitle: variant };
		},
	},
});

export const imageZoomType = defineType({
	name: "imageZoom",
	title: "Zoomable image",
	type: "object",
	fields: [
		defineField({
			name: "image",
			type: "image",
			options: { hotspot: true },
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "alt",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "caption",
			type: "string",
		}),
		defineField({
			name: "width",
			type: "number",
			initialValue: 1600,
		}),
		defineField({
			name: "height",
			type: "number",
			initialValue: 900,
		}),
	],
	preview: {
		select: { title: "alt", media: "image" },
	},
});

export const fileItemType = defineType({
	name: "fileItem",
	title: "File or folder",
	type: "object",
	fields: [
		defineField({
			name: "name",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "isFolder",
			title: "Is a folder?",
			type: "boolean",
			initialValue: false,
		}),
		defineField({
			name: "children",
			type: "array",
			of: [defineArrayMember({ type: "fileItem" })],
			hidden: ({ parent }) => !parent?.isFolder,
		}),
	],
	preview: {
		select: { title: "name", isFolder: "isFolder" },
		prepare({ title, isFolder }) {
			return { title: `${isFolder ? "📁" : "📄"} ${title}` };
		},
	},
});

export const filesBlockType = defineType({
	name: "filesBlock",
	title: "File tree",
	type: "object",
	fields: [
		defineField({
			name: "files",
			type: "array",
			of: [defineArrayMember({ type: "fileItem" })],
			validation: (rule) => rule.required().min(1),
		}),
	],
	preview: {
		prepare() {
			return { title: "File tree" };
		},
	},
});
