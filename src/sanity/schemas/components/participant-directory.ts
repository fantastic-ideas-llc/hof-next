import { defineField, defineType } from "sanity";

export const participantDirectory = defineType({
  name: "participantDirectory",
  title: "Participant Directory",
  type: "object",
  fields: [
    defineField({
      name: "participantList",
      title: "Participant List",
      type: "reference",
      to: [{ type: "participantList" }],
      description: "The confirmed retailer or exhibitor list to render",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "participantList.title" },
    prepare({ title }) {
      return { title: title || "Participant Directory" };
    },
  },
});
