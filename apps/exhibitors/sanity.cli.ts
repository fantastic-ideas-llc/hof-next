import { defineCliConfig } from "sanity/cli";

import { sanityEnv } from "./lib/sanity/env";

export default defineCliConfig({
	api: {
		dataset: sanityEnv.dataset,
		projectId: sanityEnv.projectId,
	},
});
