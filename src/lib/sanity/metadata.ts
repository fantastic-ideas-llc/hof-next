import type { Metadata } from "next";
import { sanityClient } from "./client";
import { urlFor } from "./client";
import { siteSettingsQuery } from "./queries";
import type { SeoFields, SiteSettings } from "./types";

/**
 * Build Next.js Metadata from page SEO fields with site-wide fallback.
 *
 * Priority: page ogImage → siteSettings.defaultSeo.ogImage → none
 */
export async function buildMetadata(
  title: string | undefined,
  seo: SeoFields | undefined
): Promise<Metadata> {
  const resolvedTitle = seo?.metaTitle || title;

  // Get OG image — page-level first, then site-wide default
  let ogImageUrl: string | undefined;
  if (seo?.ogImage) {
    ogImageUrl = urlFor(seo.ogImage).width(1200).height(630).url();
  } else {
    const settings = await sanityClient.fetch<SiteSettings>(siteSettingsQuery);
    if (settings?.defaultSeo?.ogImage) {
      ogImageUrl = urlFor(settings.defaultSeo.ogImage)
        .width(1200)
        .height(630)
        .url();
    }
  }

  return {
    title: resolvedTitle,
    description: seo?.metaDescription,
    openGraph: ogImageUrl
      ? {
          title: resolvedTitle,
          description: seo?.metaDescription || undefined,
          images: [{ url: ogImageUrl, width: 1200, height: 630 }],
        }
      : undefined,
    twitter: ogImageUrl
      ? {
          card: "summary_large_image",
          title: resolvedTitle,
          description: seo?.metaDescription || undefined,
          images: [ogImageUrl],
        }
      : undefined,
  };
}
