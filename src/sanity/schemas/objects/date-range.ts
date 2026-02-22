import { defineField, defineType } from "sanity";

export const dateRange = defineType({
  name: "dateRange",
  title: "Date Range",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: 'e.g. "Day 1 — Setup", "Show Day 1"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "label", start: "startDate" },
    prepare({ title, start }) {
      return {
        title,
        subtitle: start
          ? new Date(start).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : undefined,
      };
    },
  },
});
