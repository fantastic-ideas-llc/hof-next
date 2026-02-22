import { defineField, defineType } from "sanity";

export const mediaEmbed = defineType({
  name: "mediaEmbed",
  title: "Media Embed",
  type: "object",
  fields: [
    defineField({
      name: "mediaType",
      title: "Media Type",
      type: "string",
      options: {
        list: [
          { title: "YouTube", value: "youtube" },
          { title: "Upload", value: "upload" },
        ],
        layout: "radio",
      },
      initialValue: "youtube",
    }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube URL",
      type: "url",
      hidden: ({ parent }) => parent?.mediaType !== "youtube",
    }),
    defineField({
      name: "videoFile",
      title: "Video File",
      type: "file",
      options: { accept: "video/mp4" },
      hidden: ({ parent }) => parent?.mediaType !== "upload",
    }),
    defineField({
      name: "posterImage",
      title: "Poster Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
    defineField({
      name: "width",
      title: "Width",
      type: "string",
      options: {
        list: [
          { title: "Medium", value: "medium" },
          { title: "Wide", value: "wide" },
          { title: "Full", value: "full" },
        ],
      },
      initialValue: "wide",
    }),
  ],
  preview: {
    select: { mediaType: "mediaType", caption: "caption" },
    prepare({ mediaType, caption }) {
      return {
        title: "Media Embed",
        subtitle: caption || mediaType || "Video",
      };
    },
  },
});
