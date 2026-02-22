import { defineField, defineType } from "sanity";

export const contactList = defineType({
  name: "contactList",
  title: "Contact List",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "conference",
      title: "Conference",
      type: "reference",
      to: [{ type: "conference" }],
      description: "Which conference's contacts to display. Defaults to active.",
    }),
    defineField({
      name: "filterByDepartment",
      title: "Filter by Department",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Retail Relations", value: "retail-relations" },
          { title: "Marketing", value: "marketing" },
          { title: "Cannabis Guidelines", value: "cannabis-guidelines" },
          { title: "Exhibitor Sales", value: "exhibitor-sales" },
          { title: "Onboarding", value: "onboarding" },
          { title: "Operations", value: "operations" },
        ],
      },
      description: "Leave empty to show all contacts",
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Grid", value: "grid" },
          { title: "List", value: "list" },
        ],
        layout: "radio",
      },
      initialValue: "grid",
    }),
  ],
  preview: {
    select: { heading: "heading" },
    prepare({ heading }) {
      return { title: heading || "Contact List" };
    },
  },
});
