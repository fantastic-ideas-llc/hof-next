import { defineField, defineType } from "sanity";

export const copyBlock = defineType({
  name: "copyBlock",
  title: "Copy Block",
  type: "object",
  fields: [
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
    defineField({
      name: "width",
      title: "Width",
      type: "string",
      options: {
        list: [
          { title: "Narrow", value: "narrow" },
          { title: "Medium", value: "medium" },
          { title: "Wide", value: "wide" },
          { title: "Full", value: "full" },
        ],
      },
      initialValue: "medium",
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
      initialValue: "left",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Copy Block" };
    },
  },
});
