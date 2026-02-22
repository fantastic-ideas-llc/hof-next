import { defineField, defineType } from "sanity";
import { DocumentsIcon } from "@sanity/icons";
import { pageBuilderComponents } from "../components";

export const exhibitorPage = defineType({
  name: "exhibitorPage",
  title: "Exhibitor Page",
  type: "document",
  icon: DocumentsIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
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
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Show Info", value: "show-info" },
          { title: "Rules", value: "rules" },
          { title: "Insurance", value: "insurance" },
          { title: "Passes", value: "passes" },
          { title: "Solicitors License", value: "solicitors-license" },
          { title: "Marketing / PR", value: "marketing-pr" },
          { title: "Booth Info", value: "booth-info" },
          { title: "Video Guide", value: "video-guide" },
          { title: "Cannabis Guidelines", value: "cannabis-guidelines" },
          { title: "Cannabis Sales", value: "cannabis-sales" },
          { title: "FAQ", value: "faq" },
          { title: "General", value: "general" },
        ],
      },
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoFields",
    }),
    defineField({
      name: "content",
      title: "Page Content",
      type: "array",
      of: pageBuilderComponents,
    }),
  ],
  preview: {
    select: {
      title: "title",
      conference: "conference.title",
      category: "category",
    },
    prepare({ title, conference, category }) {
      return {
        title,
        subtitle: [conference, category].filter(Boolean).join(" — "),
      };
    },
  },
});
