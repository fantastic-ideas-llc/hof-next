import { defineField, defineType } from "sanity";
import { MenuIcon } from "@sanity/icons";

const navItem = {
  type: "object",
  name: "navItem",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "string",
      description: "Internal path (e.g. /retailers) or external URL",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "children",
      title: "Sub-items",
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
              name: "link",
              title: "Link",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "link" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "link" },
  },
};

export const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  icon: MenuIcon,
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
      name: "items",
      title: "Nav Items",
      type: "array",
      of: [navItem],
    }),
    defineField({
      name: "ctaButtons",
      title: "CTA Buttons",
      type: "array",
      of: [{ type: "cta" }],
      description: "CTA buttons shown in the navigation",
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
            select: { title: "platform", subtitle: "url" },
          },
        },
      ],
    }),
    defineField({
      name: "showConferenceDates",
      title: "Show Conference Dates",
      type: "boolean",
      description: "Display upcoming conference date bar in the nav",
      initialValue: true,
    }),
  ],
  preview: {
    select: { site: "site" },
    prepare({ site }) {
      return {
        title: `Navigation — ${site === "marketing" ? "Marketing" : "Exhibitor"}`,
      };
    },
  },
});
