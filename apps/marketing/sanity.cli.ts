import { defineCliConfig } from "sanity/cli";

import { studioEnv } from "./lib/sanity-env";

export default defineCliConfig({
	api: {
		dataset: studioEnv.dataset,
		projectId: studioEnv.projectId,
	},
});
