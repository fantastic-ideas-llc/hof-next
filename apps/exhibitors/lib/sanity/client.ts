import { createClient } from "@sanity/client";

import { hasSanityEnv, sanityEnv } from "./env";

export const sanityClient = hasSanityEnv
	? createClient({
			apiVersion: sanityEnv.apiVersion,
			dataset: sanityEnv.dataset,
			projectId: sanityEnv.projectId,
			token: sanityEnv.readToken,
			useCdn: !sanityEnv.readToken,
		})
	: null;

export async function sanityFetch<QueryResult>(
	query: string,
	params: Record<string, unknown> = {},
) {
	if (!sanityClient) {
		throw new Error("Sanity client requested without configured environment variables.");
	}

	return sanityClient.fetch<QueryResult>(query, params);
}
