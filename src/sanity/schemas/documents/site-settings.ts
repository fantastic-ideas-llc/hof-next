import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "homepage",
      title: "Homepage",
      type: "reference",
      to: [{ type: "page" }],
      description:
        "The page that renders at /. Swap this reference to change the homepage.",
    }),
    defineField({
      name: "activeConference",
      title: "Active Conference",
      type: "reference",
      to: [{ type: "conference" }],
      description:
        "The primary conference — drives the nav badge, exhibitor portal, and default conference context.",
    }),
    defineField({
      name: "secondaryConference",
      title: "Secondary Conference",
      type: "reference",
      to: [{ type: "conference" }],
      description:
        "Optional. When set, indicates a second conference is being promoted (e.g. pre-sale).",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
    }),
    defineField({
      name: "logoMark",
      title: "Logo Mark",
      type: "image",
      description: "Icon-only logo variant",
    }),
    defineField({
      name: "showSubscriptionModal",
      title: "Show Subscription Modal",
      type: "boolean",
      description: "Show the newsletter subscription modal on homepage load",
      initialValue: false,
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "seoFields",
      description: "Fallback SEO metadata when pages don't define their own",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
