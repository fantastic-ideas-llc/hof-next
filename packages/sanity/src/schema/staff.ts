import { defineField, defineType } from "sanity";

export const staffType = defineType({
	name: "staff",
	title: "Member",
	type: "document",
	fields: [
		defineField({
			name: "name",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "roles",
			type: "array",
			of: [
				{
					type: "reference",
					to: [{ type: "staffRole" }],
				},
			],
			validation: (rule) =>
				rule.custom((roles, context) => {
					const document = context.document as { role?: unknown } | undefined;

					if (Array.isArray(roles) && roles.length > 0) return true;
					if (document?.role) return true;

					return "At least one role is required";
				}),
		}),
		defineField({
			name: "role",
			type: "reference",
			to: [{ type: "staffRole" }],
			hidden: true,
		}),
		defineField({
			name: "email",
			type: "string",
			validation: (rule) => rule.required().email(),
		}),
	],
	preview: {
		select: {
			title: "name",
			roleOne: "roles.0.title",
			roleTwo: "roles.1.title",
			roleThree: "roles.2.title",
			roleLegacy: "role.title",
		},
		prepare({ roleLegacy, roleOne, roleThree, roleTwo, title }) {
			const roles = [roleOne, roleTwo, roleThree].filter(Boolean);

			return {
				title,
				subtitle: roles.length > 0 ? roles.join(", ") : roleLegacy,
			};
		},
	},
});
