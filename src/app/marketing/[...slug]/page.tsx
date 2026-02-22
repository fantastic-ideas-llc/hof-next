import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity/client";
import { pageBySlugQuery, allPageSlugsQuery } from "@/lib/sanity/queries";
import type { Page } from "@/lib/sanity/types";
import { PageBuilder } from "@/components/page-builder/PageBuilder";
import { buildMetadata } from "@/lib/sanity/metadata";
import type { Metadata } from "next";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

async function getPage(slug: string): Promise<Page | null> {
  return sanityClient.fetch<Page | null>(pageBySlugQuery, { slug });
}

export async function generateStaticParams() {
  const pages = await sanityClient.fetch<{ slug: string }[]>(
    allPageSlugsQuery
  );
  return pages.map((page) => ({
    slug: page.slug.split("/"),
  }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug.join("/");
  const page = await getPage(slug);

  if (!page) return {};

  return buildMetadata(page.title, page.seo);
}

export default async function CatchAllPage(props: PageProps) {
  const params = await props.params;
  const slug = params.slug.join("/");
  const page = await getPage(slug);

  if (!page) {
    notFound();
  }

  return <PageBuilder components={page.content} />;
}
