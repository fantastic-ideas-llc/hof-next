import { SANITY_API_VERSION } from "@hof/sanity";

const configuredApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? SANITY_API_VERSION;

export const sanityEnv = {
	apiVersion: configuredApiVersion,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
	readToken: process.env.SANITY_API_READ_TOKEN,
} as const;

export const hasSanityEnv = sanityEnv.projectId.length > 0;
