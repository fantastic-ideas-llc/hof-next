import { defineField, defineType } from "sanity";

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "backgroundType",
      title: "Background Type",
      type: "string",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
        ],
        layout: "radio",
      },
      initialValue: "image",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.backgroundType !== "image",
    }),
    defineField({
      name: "backgroundVideo",
      title: "Background Video",
      type: "file",
      options: { accept: "video/mp4" },
      hidden: ({ parent }) => parent?.backgroundType !== "video",
    }),
    defineField({
      name: "backgroundVideoPoster",
      title: "Video Poster Image",
      type: "image",
      options: { hotspot: true },
      description: "Fallback frame shown before video loads",
      hidden: ({ parent }) => parent?.backgroundType !== "video",
    }),
    defineField({
      name: "overlayStrength",
      title: "Overlay Strength",
      type: "string",
      options: {
        list: [
          { title: "None", value: "none" },
          { title: "Light", value: "light" },
          { title: "Medium", value: "medium" },
          { title: "Heavy", value: "heavy" },
        ],
      },
      initialValue: "medium",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
    defineField({
      name: "textAlignment",
      title: "Text Alignment",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
        ],
        layout: "radio",
      },
      initialValue: "center",
    }),
    defineField({
      name: "ctas",
      title: "Call to Actions",
      type: "array",
      of: [{ type: "cta" }],
      validation: (rule) => rule.max(2),
    }),
  ],
  preview: {
    select: { backgroundType: "backgroundType" },
    prepare({ backgroundType }) {
      return {
        title: "Hero",
        subtitle: `Background: ${backgroundType || "image"}`,
      };
    },
  },
});
