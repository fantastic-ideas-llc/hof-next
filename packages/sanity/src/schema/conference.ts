import { defineArrayMember, defineField, defineType } from "sanity";

import { conferenceStatuses } from "../constants";
import { createSlugField } from "./helpers";

export const conferenceType = defineType({
	name: "conference",
	title: "Conference",
	type: "document",
	groups: [
		{
			name: "exhibitorManual",
			title: "Exhibitor Manual",
			default: true,
		},
		{
			name: "core",
			title: "Core",
		},
	],
	fields: [
		defineField({
			name: "name",
			type: "string",
			group: "core",
			validation: (rule) => rule.required(),
		}),
		{
			...createSlugField("name"),
			group: "core",
		},
		defineField({
			name: "status",
			type: "string",
			group: "core",
			initialValue: "draft",
			options: {
				list: conferenceStatuses.map((value) => ({
					title: value[0].toUpperCase() + value.slice(1),
					value,
				})),
				layout: "radio",
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "startDate",
			type: "datetime",
			group: "core",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "endDate",
			type: "datetime",
			group: "core",
			validation: (rule) =>
				rule.required().custom((value, context) => {
					const startDate = context.document?.startDate;
					if (typeof startDate !== "string" || typeof value !== "string") return true;

					return new Date(value) >= new Date(startDate)
						? true
						: "End date must be after the start date.";
				}),
		}),
		defineField({
			name: "venue",
			type: "venue",
			group: "core",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "hours",
			type: "array",
			group: "exhibitorManual",
			of: [defineArrayMember({ type: "conferenceHours" })],
			validation: (rule) => rule.min(1).warning("Add at least one hours entry."),
		}),
		defineField({
			name: "contacts",
			type: "array",
			group: "exhibitorManual",
			of: [
				defineArrayMember({
					type: "reference",
					to: [{ type: "staff" }],
				}),
			],
			validation: (rule) => rule.unique(),
		}),
		defineField({
			name: "description",
			type: "blockContent",
			group: "exhibitorManual",
		}),
		defineField({
			name: "timelineSections",
			title: "Timeline sections",
			type: "array",
			group: "exhibitorManual",
			of: [
				defineArrayMember({
					name: "timelineSection",
					title: "Timeline section",
					type: "object",
					fields: [
						defineField({
							name: "title",
							type: "string",
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "entries",
							type: "array",
							of: [
								defineArrayMember({
									name: "timelineEntry",
									title: "Timeline entry",
									type: "object",
									fields: [
										defineField({
											name: "date",
											type: "date",
											validation: (rule) => rule.required(),
										}),
										defineField({
											name: "relativeLabel",
											type: "string",
										}),
										defineField({
											name: "deliverables",
											type: "array",
											of: [
												defineArrayMember({
													name: "timelineDeliverable",
													title: "Deliverable",
													type: "object",
													fields: [
														defineField({
															name: "label",
															type: "string",
															validation: (rule) => rule.required(),
														}),
														defineField({
															name: "timeRange",
															title: "Time range",
															type: "string",
														}),
													],
													preview: {
														select: {
															label: "label",
															timeRange: "timeRange",
														},
														prepare({ label, timeRange }) {
															return {
																title: label,
																subtitle: timeRange,
															};
														},
													},
												}),
											],
											validation: (rule) => rule.required().min(1),
										}),
										defineField({
											name: "note",
											type: "string",
										}),
									],
									preview: {
										select: {
											date: "date",
											note: "note",
											firstDeliverable: "deliverables.0.label",
										},
										prepare({ date, firstDeliverable, note }) {
											const title =
												typeof date === "string"
													? new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
															month: "short",
															day: "numeric",
															year: "numeric",
														})
													: "No date";

											return {
												title,
												subtitle: [firstDeliverable, note].filter(Boolean).join(" | "),
											};
										},
									},
								}),
							],
							validation: (rule) => rule.required().min(1),
						}),
					],
					preview: {
						select: {
							entryCount: "entries.length",
							title: "title",
						},
						prepare({ entryCount, title }) {
							return {
								title,
								subtitle: `${entryCount ?? 0} timeline item${entryCount === 1 ? "" : "s"}`,
							};
						},
					},
				}),
			],
		}),
	],
	preview: {
		select: {
			name: "name",
			startDate: "startDate",
			status: "status",
		},
		prepare({ name, startDate, status }) {
			return {
				title: name,
				subtitle: `${status} - ${startDate ?? "No start date"}`,
			};
		},
	},
});
