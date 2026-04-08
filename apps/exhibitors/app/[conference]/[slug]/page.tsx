import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import { notFound } from "next/navigation";

import { getDocPage } from "@/lib/data";
import { extractTableOfContents, PortableTextContent } from "@/lib/portable-text";

export default async function ConferenceDocPage({
	params,
}: {
	params: Promise<{ conference: string; slug: string }>;
}) {
	const { conference, slug } = await params;
	const doc = await getDocPage(conference, slug);

	if (!doc) notFound();

	return (
		<DocsPage toc={extractTableOfContents(doc.body)}>
			<DocsTitle>{doc.title}</DocsTitle>
			{doc.description ? <DocsDescription>{doc.description}</DocsDescription> : null}
			<DocsBody>
				<PortableTextContent value={doc.body} />
			</DocsBody>
		</DocsPage>
	);
}
