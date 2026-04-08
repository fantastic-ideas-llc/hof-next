import { createSearchAPI } from "fumadocs-core/search/server";
import type { NextRequest } from "next/server";

import { getBoothPage, getConferenceBundle, getDocPage, getFaqPage } from "@/lib/data";
import { buildFullSearchIndex } from "@/lib/search-index";

export async function GET(request: NextRequest) {
	const conferenceSlug = request.nextUrl.searchParams.get("conference");

	if (!conferenceSlug) {
		return Response.json([]);
	}

	const bundle = await getConferenceBundle(conferenceSlug);
	if (!bundle) {
		return Response.json([]);
	}

	const indexes = await buildFullSearchIndex(
		conferenceSlug,
		bundle,
		(slug) => getDocPage(conferenceSlug, slug),
		(slug) => getBoothPage(conferenceSlug, slug),
		(slug) => getFaqPage(conferenceSlug, slug),
	);

	const { GET: searchGET } = createSearchAPI("advanced", {
		indexes,
	});

	// Forward the query param to the fumadocs search handler
	const searchUrl = new URL(request.url);
	searchUrl.searchParams.delete("conference");
	const searchRequest = new Request(searchUrl, request);

	return searchGET(searchRequest);
}
