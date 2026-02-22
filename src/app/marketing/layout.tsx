import { sanityClient } from "@/lib/sanity/client";
import { navigationQuery, footerQuery, siteSettingsQuery } from "@/lib/sanity/queries";
import type { Navigation, Footer, SiteSettings } from "@/lib/sanity/types";
import { MarketingNav } from "@/components/nav/MarketingNav";
import { SiteFooter } from "@/components/footer/Footer";

async function getLayoutData() {
  const [navigation, footer, settings] = await Promise.all([
    sanityClient.fetch<Navigation>(navigationQuery, { site: "marketing" }),
    sanityClient.fetch<Footer>(footerQuery, { site: "marketing" }),
    sanityClient.fetch<SiteSettings>(siteSettingsQuery),
  ]);
  return { navigation, footer, settings };
}

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { navigation, footer, settings } = await getLayoutData();

  return (
    <>
      <MarketingNav
        navigation={navigation}
        activeConference={settings?.activeConference}
        secondaryConference={settings?.secondaryConference}
      />
      <main className="min-h-screen">{children}</main>
      <SiteFooter footer={footer} />
    </>
  );
}
