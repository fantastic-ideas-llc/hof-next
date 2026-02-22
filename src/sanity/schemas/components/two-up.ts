import { defineField, defineType } from "sanity";

export const twoUp = defineType({
  name: "twoUp",
  title: "Two-Up (Split Content)",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "imagePosition",
      title: "Image Position",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "left",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
    defineField({
      name: "ctas",
      title: "Call to Actions",
      type: "array",
      of: [{ type: "cta" }],
      validation: (rule) => rule.max(2),
    }),
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      options: {
        list: [
          { title: "Neutral", value: "neutral" },
          { title: "Subtle", value: "subtle" },
          { title: "Bold", value: "bold" },
          { title: "Brand", value: "brand" },
        ],
      },
      initialValue: "neutral",
    }),
  ],
  preview: {
    select: { imagePosition: "imagePosition" },
    prepare({ imagePosition }) {
      return {
        title: "Two-Up",
        subtitle: `Image ${imagePosition || "left"}`,
      };
    },
  },
});
