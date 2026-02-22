import { defineField, defineType } from "sanity";

export const conferenceCards = defineType({
  name: "conferenceCards",
  title: "Conference Cards",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "conferences",
      title: "Conferences",
      type: "array",
      of: [{ type: "reference", to: [{ type: "conference" }] }],
      validation: (rule) => rule.min(1).max(4),
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Side by Side", value: "side-by-side" },
          { title: "Stacked", value: "stacked" },
        ],
        layout: "radio",
      },
      initialValue: "side-by-side",
    }),
    defineField({
      name: "cardStyle",
      title: "Card Style",
      type: "string",
      options: {
        list: [
          { title: "Full (large hero-style)", value: "full" },
          { title: "Compact (key details)", value: "compact" },
        ],
        layout: "radio",
      },
      initialValue: "full",
    }),
  ],
  preview: {
    select: { heading: "heading", conferences: "conferences" },
    prepare({ heading, conferences }) {
      return {
        title: heading || "Conference Cards",
        subtitle: `${conferences?.length || 0} conferences`,
      };
    },
  },
});
