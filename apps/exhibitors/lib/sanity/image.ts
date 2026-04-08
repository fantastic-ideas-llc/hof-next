import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { sanityClient } from "./client";

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function buildImageUrl(source: SanityImageSource) {
	if (!builder) return null;

	return builder.image(source);
}
