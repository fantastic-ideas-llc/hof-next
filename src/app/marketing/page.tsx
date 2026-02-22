import { sanityClient } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import type { SiteSettings } from "@/lib/sanity/types";
import { PageBuilder } from "@/components/page-builder/PageBuilder";
import type { Metadata } from "next";

export const revalidate = 60;

async function getHomepage() {
  const settings = await sanityClient.fetch<SiteSettings>(siteSettingsQuery);
  return settings?.homepage;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomepage();
  if (!page) return {};

  const seo = page.seo;
  return {
    title: seo?.metaTitle || page.title,
    description: seo?.metaDescription,
  };
}

export default async function HomePage() {
  const page = await getHomepage();

  if (!page) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg text-zinc-500">
          No homepage configured. Set a homepage in Site Settings.
        </p>
      </div>
    );
  }

  return <PageBuilder components={page.content} />;
}
