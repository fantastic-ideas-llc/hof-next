import { defineField, defineType } from "sanity";

export const gallery = defineType({
  name: "gallery",
  title: "Gallery",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alt Text",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "caption",
              type: "string",
              title: "Caption",
            }),
          ],
        },
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "columns",
      title: "Columns",
      type: "number",
      description: "Number of columns on desktop (2-4)",
      validation: (rule) => rule.min(2).max(4),
      initialValue: 3,
    }),
  ],
  preview: {
    select: { heading: "heading", images: "images" },
    prepare({ heading, images }) {
      return {
        title: heading || "Gallery",
        subtitle: `${images?.length || 0} images`,
      };
    },
  },
});
