import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity/client";
import {
  siteSettingsQuery,
  exhibitorPageBySlugQuery,
  exhibitorNavQuery,
} from "@/lib/sanity/queries";
import type { SiteSettings, ExhibitorPage } from "@/lib/sanity/types";
import { PageBuilder } from "@/components/page-builder/PageBuilder";
import { buildMetadata } from "@/lib/sanity/metadata";
import type { Metadata } from "next";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

async function getExhibitorPage(
  slug: string
): Promise<ExhibitorPage | null> {
  const settings = await sanityClient.fetch<SiteSettings>(siteSettingsQuery);
  const conferenceId = settings?.activeConference?._id;
  if (!conferenceId) return null;

  return sanityClient.fetch<ExhibitorPage | null>(exhibitorPageBySlugQuery, {
    slug,
    conferenceId,
  });
}

export async function generateStaticParams() {
  const settings = await sanityClient.fetch<SiteSettings>(siteSettingsQuery);
  const conferenceId = settings?.activeConference?._id;
  if (!conferenceId) return [];

  const pages = await sanityClient.fetch<{ slug: { current: string } }[]>(
    exhibitorNavQuery,
    { conferenceId }
  );

  return pages
    .filter((p) => p.slug?.current && p.slug.current !== "index")
    .map((p) => ({
      slug: p.slug.current.split("/"),
    }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug.join("/");
  const page = await getExhibitorPage(slug);

  if (!page) return {};

  return buildMetadata(page.title, page.seo);
}

export default async function ExhibitorCatchAllPage(props: PageProps) {
  const params = await props.params;
  const slug = params.slug.join("/");
  const page = await getExhibitorPage(slug);

  if (!page) {
    notFound();
  }

  return <PageBuilder components={page.content} />;
}
