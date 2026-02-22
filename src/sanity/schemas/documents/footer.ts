import { defineField, defineType } from "sanity";
import { BlockContentIcon } from "@sanity/icons";

export const footer = defineType({
  name: "footer",
  title: "Footer",
  type: "document",
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: "site",
      title: "Site",
      type: "string",
      options: {
        list: [
          { title: "Marketing", value: "marketing" },
          { title: "Exhibitor", value: "exhibitor" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "columns",
      title: "Link Columns",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "heading",
              title: "Column Heading",
              type: "string",
            }),
            defineField({
              name: "links",
              title: "Links",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({
                      name: "label",
                      title: "Label",
                      type: "string",
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "url",
                      title: "URL",
                      type: "string",
                      validation: (rule) => rule.required(),
                    }),
                  ],
                  preview: {
                    select: { title: "label", subtitle: "url" },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { title: "heading" },
          },
        },
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "Instagram", value: "instagram" },
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "X (Twitter)", value: "x" },
                  { title: "YouTube", value: "youtube" },
                  { title: "Facebook", value: "facebook" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "platform" },
          },
        },
      ],
    }),
    defineField({
      name: "legalText",
      title: "Legal Text",
      type: "blockContent",
      description: "Copyright, disclaimers, license numbers",
    }),
  ],
  preview: {
    select: { site: "site" },
    prepare({ site }) {
      return {
        title: `Footer — ${site === "marketing" ? "Marketing" : "Exhibitor"}`,
      };
    },
  },
});
