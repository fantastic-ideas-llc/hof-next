import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import { notFound } from "next/navigation";

import { getBoothPage } from "@/lib/data";
import { extractTableOfContents, PortableTextContent } from "@/lib/portable-text";

export default async function BoothPage({
	params,
}: {
	params: Promise<{ conference: string; slug: string }>;
}) {
	const { conference, slug } = await params;
	const booth = await getBoothPage(conference, slug);

	if (!booth) notFound();

	return (
		<DocsPage toc={extractTableOfContents(booth.specs ?? [])}>
			<DocsTitle>{booth.name}</DocsTitle>
			<DocsDescription>
				{booth.description}
				{booth.dimensions ? ` ${booth.dimensions}.` : ""}
				{typeof booth.price === "number" ? ` Starting at $${booth.price.toLocaleString()}.` : ""}
			</DocsDescription>
			<DocsBody>
				{booth.includes && booth.includes.length > 0 ? (
					<ul className="mb-8 list-disc space-y-2 pl-6 text-sm leading-7">
						{booth.includes.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				) : null}
				{booth.specs ? <PortableTextContent value={booth.specs} /> : null}
			</DocsBody>
		</DocsPage>
	);
}
