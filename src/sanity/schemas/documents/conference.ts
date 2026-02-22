import { defineField, defineType } from "sanity";
import { CalendarIcon } from "@sanity/icons";

export const conference = defineType({
  name: "conference",
  title: "Conference",
  type: "document",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: 'e.g. "Hall of Flowers Ventura 2026"',
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
      name: "location",
      title: "Venue",
      type: "reference",
      to: [{ type: "venue" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Upcoming", value: "upcoming" },
          { title: "Active", value: "active" },
          { title: "Completed", value: "completed" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "Short promotional line",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      description: "Primary promotional image for this conference",
    }),
    defineField({
      name: "loadInSchedule",
      title: "Load-In Schedule",
      type: "array",
      of: [{ type: "dateRange" }],
    }),
    defineField({
      name: "showSchedule",
      title: "Show Schedule",
      type: "array",
      of: [{ type: "dateRange" }],
    }),
    defineField({
      name: "contacts",
      title: "Show Contacts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "contact" }] }],
    }),
    defineField({
      name: "urlPrefix",
      title: "URL Prefix",
      type: "slug",
      description:
        'Short city prefix for pre-sale mode URLs (e.g. "ny", "santa-rosa")',
    }),
  ],
  preview: {
    select: {
      title: "title",
      status: "status",
      city: "location.city",
      startDate: "startDate",
    },
    prepare({ title, status, city, startDate }) {
      const date = startDate
        ? new Date(startDate).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
        : "";
      return {
        title,
        subtitle: [city, date, status?.toUpperCase()].filter(Boolean).join(" · "),
      };
    },
  },
});
