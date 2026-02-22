import { defineField, defineType } from "sanity";
import { LinkIcon } from "@sanity/icons";

export const redirect = defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "source",
      title: "Source Path",
      type: "string",
      description: "Old path without leading slash (e.g. ny/tickets)",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "destination",
      title: "Destination Path",
      type: "string",
      description: "New path without leading slash (e.g. tickets)",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "permanent",
      title: "Permanent (301)",
      type: "boolean",
      description: "301 for permanent, 302 for temporary",
      initialValue: true,
    }),
  ],
  preview: {
    select: { source: "source", destination: "destination", permanent: "permanent" },
    prepare({ source, destination, permanent }) {
      return {
        title: `/${source} → /${destination}`,
        subtitle: permanent ? "301 Permanent" : "302 Temporary",
      };
    },
  },
});
