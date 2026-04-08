import { DocsBody, DocsPage, DocsTitle } from "fumadocs-ui/page";
import { notFound } from "next/navigation";

import { getFaqPage } from "@/lib/data";
import { extractTableOfContents, PortableTextContent } from "@/lib/portable-text";

export default async function FaqPage({
	params,
}: {
	params: Promise<{ conference: string; slug: string }>;
}) {
	const { conference, slug } = await params;
	const faq = await getFaqPage(conference, slug);

	if (!faq) notFound();

	return (
		<DocsPage toc={extractTableOfContents(faq.answer)}>
			<DocsTitle>{faq.question}</DocsTitle>
			<DocsBody>
				<PortableTextContent value={faq.answer} />
			</DocsBody>
		</DocsPage>
	);
}
