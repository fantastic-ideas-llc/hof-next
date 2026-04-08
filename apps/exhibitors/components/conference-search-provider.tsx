"use client";

import DefaultSearchDialog from "fumadocs-ui/components/dialog/search-default";
import { SearchProvider } from "fumadocs-ui/contexts/search";

export function ConferenceSearchProvider({
	children,
	conferenceSlug,
}: {
	children: React.ReactNode;
	conferenceSlug: string;
}) {
	return (
		<SearchProvider
			SearchDialog={DefaultSearchDialog}
			options={{
				api: `/api/search?conference=${conferenceSlug}`,
			}}
		>
			{children}
		</SearchProvider>
	);
}
