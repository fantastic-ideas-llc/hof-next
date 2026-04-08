import { DocsLayout } from "fumadocs-ui/layouts/docs";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ConferenceSearchProvider } from "@/components/conference-search-provider";
import { getConferenceBundle } from "@/lib/data";
import { createConferenceTree } from "@/lib/page-tree";

export default async function ConferenceLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ conference: string }>;
}>) {
	const { conference: conferenceSlug } = await params;
	const bundle = await getConferenceBundle(conferenceSlug);

	if (!bundle) notFound();

	const tree = createConferenceTree(bundle);

	return (
		<ConferenceSearchProvider conferenceSlug={conferenceSlug}>
			<DocsLayout
				nav={{
					title: (
						<div className="flex items-center gap-3">
							<Image alt="Hall of Flowers" height={48} src="/hof-logo.svg" width={35} />
							<div className="flex flex-col">
								<span className="text-sm font-semibold leading-tight">Exhibitor Manual</span>
								{bundle.conference.venue?.city && (
									<span className="text-xs leading-tight text-[var(--muted-foreground)]">
										{bundle.conference.venue.city}
									</span>
								)}
								{bundle.conference.startDate && (
									<span className="text-xs leading-tight text-[var(--muted-foreground)]">
										{(() => {
											const fmt = (d: string) =>
												new Date(d).toLocaleDateString("en-US", {
													month: "short",
													day: "numeric",
												});
											return bundle.conference.endDate &&
												bundle.conference.endDate !== bundle.conference.startDate
												? `${fmt(bundle.conference.startDate)} – ${fmt(bundle.conference.endDate)}`
												: fmt(bundle.conference.startDate);
										})()}
									</span>
								)}
							</div>
						</div>
					),
				}}
				sidebar={{
					enabled: true,
				}}
				themeSwitch={{
					enabled: false,
				}}
				tree={tree}
			>
				{children}
			</DocsLayout>
		</ConferenceSearchProvider>
	);
}
