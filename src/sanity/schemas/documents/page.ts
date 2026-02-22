import { defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { pageBuilderComponents } from "../components";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Internal page name",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      description:
        "Full URL path. Generic pages: tickets, retailers. Pre-sale pages: ny/tickets",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "conference",
      title: "Conference",
      type: "reference",
      to: [{ type: "conference" }],
      description:
        "Optional. Used for organizing/filtering in Studio. Does NOT affect the URL.",
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
      slug: "slug.current",
      conference: "conference.title",
    },
    prepare({ title, slug, conference }) {
      return {
        title,
        subtitle: [conference, `/${slug}`].filter(Boolean).join(" — "),
      };
    },
  },
});
