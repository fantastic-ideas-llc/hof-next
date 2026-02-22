import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

export const contact = defineType({
  name: "contact",
  title: "Contact",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: 'e.g. "Show Manager", "Sales Director"',
    }),
    defineField({
      name: "department",
      title: "Department",
      type: "string",
      options: {
        list: [
          { title: "Retail Relations", value: "retail-relations" },
          { title: "Marketing", value: "marketing" },
          { title: "Cannabis Guidelines", value: "cannabis-guidelines" },
          { title: "Exhibitor Sales", value: "exhibitor-sales" },
          { title: "Onboarding", value: "onboarding" },
          { title: "Operations", value: "operations" },
          { title: "General", value: "general" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Headshot",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "department" },
  },
});
