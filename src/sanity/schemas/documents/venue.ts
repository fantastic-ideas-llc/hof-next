import { defineField, defineType } from "sanity";
import { PinIcon } from "@sanity/icons";

export const venue = defineType({
  name: "venue",
  title: "Venue",
  type: "document",
  icon: PinIcon,
  fields: [
    defineField({
      name: "name",
      title: "Venue Name",
      type: "string",
      description: 'e.g. "Ventura County Fairgrounds"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "state",
      title: "State",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "address",
      title: "Full Address",
      type: "string",
    }),
    defineField({
      name: "coordinates",
      title: "Coordinates",
      type: "geopoint",
    }),
    defineField({
      name: "image",
      title: "Venue Image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "city" },
  },
});
