import { deskStructure } from "@hof/sanity";
import { schemaTypes } from "@hof/sanity/studio";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { studioEnv } from "./lib/sanity-env";

export default defineConfig({
	basePath: "/cms",
	dataset: studioEnv.dataset,
	name: "hall-of-flowers-studio",
	// biome-ignore lint/suspicious/noExplicitAny: Bun hoists duplicate sanity copies with incompatible types
	plugins: [structureTool({ structure: deskStructure as any }), visionTool()],
	projectId: studioEnv.projectId,
	schema: {
		types: schemaTypes,
	},
	title: "Hall of Flowers Studio",
});
