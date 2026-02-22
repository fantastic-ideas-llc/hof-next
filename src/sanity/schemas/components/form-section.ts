import { defineField, defineType } from "sanity";

export const formSection = defineType({
  name: "formSection",
  title: "Form Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
    }),
    defineField({
      name: "formSource",
      title: "Form Source",
      type: "string",
      options: {
        list: [
          { title: "Embed (iframe)", value: "embed" },
          { title: "Zoho API (Phase 2)", value: "zohoApi" },
        ],
        layout: "radio",
      },
      initialValue: "embed",
    }),
    defineField({
      name: "embedCode",
      title: "Embed Code",
      type: "text",
      rows: 6,
      description: "Raw HTML/iframe embed code",
      hidden: ({ parent }) => parent?.formSource !== "embed",
    }),
    defineField({
      name: "zohoFormId",
      title: "Zoho Form ID",
      type: "string",
      description: "Phase 2 — Zoho form identifier",
      hidden: ({ parent }) => parent?.formSource !== "zohoApi",
    }),
  ],
  preview: {
    select: { heading: "heading", formSource: "formSource" },
    prepare({ heading, formSource }) {
      return {
        title: heading || "Form Section",
        subtitle: formSource === "embed" ? "Iframe embed" : "Zoho API",
      };
    },
  },
});
