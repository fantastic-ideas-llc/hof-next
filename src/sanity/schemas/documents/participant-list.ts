import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

export const participantList = defineType({
  name: "participantList",
  title: "Participant List",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: 'e.g. "Confirmed Retailers for Ventura 2026"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "conference",
      title: "Conference",
      type: "reference",
      to: [{ type: "conference" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "listType",
      title: "List Type",
      type: "string",
      options: {
        list: [
          { title: "Retailer", value: "retailer" },
          { title: "Exhibitor", value: "exhibitor" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "entries",
      title: "Entries",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Business Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "name" },
          },
        },
      ],
      description:
        "Business names. The frontend sorts and groups alphabetically — no need to worry about order here.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      listType: "listType",
      conference: "conference.title",
    },
    prepare({ title, listType, conference }) {
      return {
        title,
        subtitle: [conference, listType].filter(Boolean).join(" — "),
      };
    },
  },
});
