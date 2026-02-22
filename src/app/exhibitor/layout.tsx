import { sanityClient } from "@/lib/sanity/client";
import {
  navigationQuery,
  footerQuery,
  siteSettingsQuery,
  exhibitorNavQuery,
} from "@/lib/sanity/queries";
import type {
  Navigation,
  Footer,
  SiteSettings,
  ExhibitorPage,
} from "@/lib/sanity/types";
import { ExhibitorNav } from "@/components/nav/ExhibitorNav";
import { SiteFooter } from "@/components/footer/Footer";

async function getLayoutData() {
  const settings = await sanityClient.fetch<SiteSettings>(siteSettingsQuery);
  const conferenceId = settings?.activeConference?._id;

  const [navigation, footer, exhibitorPages] = await Promise.all([
    sanityClient.fetch<Navigation>(navigationQuery, { site: "exhibitor" }),
    sanityClient.fetch<Footer>(footerQuery, { site: "exhibitor" }),
    conferenceId
      ? sanityClient.fetch<Pick<ExhibitorPage, "_id" | "title" | "slug" | "category">[]>(
          exhibitorNavQuery,
          { conferenceId }
        )
      : Promise.resolve([]),
  ]);

  return {
    navigation,
    footer,
    settings,
    exhibitorPages,
  };
}

export default async function ExhibitorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { navigation, footer, settings, exhibitorPages } =
    await getLayoutData();

  return (
    <div className="flex min-h-screen">
      <ExhibitorNav
        navigation={navigation}
        exhibitorPages={exhibitorPages}
        activeConference={settings?.activeConference}
        logo={settings?.logo}
      />
      <div className="flex flex-1 flex-col">
        <main className="flex-1">{children}</main>
        <SiteFooter footer={footer} />
      </div>
    </div>
  );
}
