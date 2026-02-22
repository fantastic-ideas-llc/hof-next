import { sanityClient } from "@/lib/sanity/client";
import { siteSettingsQuery, exhibitorPageBySlugQuery } from "@/lib/sanity/queries";
import type { SiteSettings, ExhibitorPage } from "@/lib/sanity/types";
import { PageBuilder } from "@/components/page-builder/PageBuilder";
import { buildMetadata } from "@/lib/sanity/metadata";
import type { Metadata } from "next";

export const revalidate = 60;

async function getExhibitorHomepage(): Promise<ExhibitorPage | null> {
  const settings = await sanityClient.fetch<SiteSettings>(siteSettingsQuery);
  const conferenceId = settings?.activeConference?._id;
  if (!conferenceId) return null;

  return sanityClient.fetch<ExhibitorPage | null>(
    exhibitorPageBySlugQuery,
    { slug: "index", conferenceId }
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getExhibitorHomepage();
  if (!page) return { title: "Exhibitor Portal" };

  return buildMetadata(page.title, page.seo);
}

export default async function ExhibitorHomePage() {
  const page = await getExhibitorHomepage();

  if (!page) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8">
        <p className="text-lg text-zinc-500">
          No exhibitor homepage configured for the active conference.
        </p>
      </div>
    );
  }

  return <PageBuilder components={page.content} />;
}
