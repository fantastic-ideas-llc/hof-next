import { defineField, defineType } from "sanity";

export const conferenceInfoBlock = defineType({
  name: "conferenceInfoBlock",
  title: "Conference Info Block",
  type: "object",
  fields: [
    defineField({
      name: "conference",
      title: "Conference",
      type: "reference",
      to: [{ type: "conference" }],
      description: "Defaults to active conference if not set",
    }),
    defineField({
      name: "showFields",
      title: "Show Conference Fields",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Schedule", value: "schedule" },
          { title: "Load-In", value: "loadIn" },
          { title: "Contacts", value: "contacts" },
          { title: "Description", value: "description" },
        ],
      },
    }),
    defineField({
      name: "showExhibitorPages",
      title: "Show Exhibitor Page Categories",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Rules", value: "rules" },
          { title: "FAQ", value: "faq" },
          { title: "Booth Info", value: "booth-info" },
          { title: "Insurance", value: "insurance" },
          { title: "Passes", value: "passes" },
          { title: "Guidelines", value: "guidelines" },
        ],
      },
    }),
    defineField({
      name: "displayMode",
      title: "Display Mode",
      type: "string",
      options: {
        list: [
          { title: "Summary (links to pages)", value: "summary" },
          { title: "Inline (full content)", value: "inline" },
        ],
        layout: "radio",
      },
      initialValue: "summary",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Conference Info Block" };
    },
  },
});
