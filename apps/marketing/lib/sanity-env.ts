export const studioEnv = {
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "missing-project-id",
};

export const hasStudioEnv =
	studioEnv.projectId.length > 0 && studioEnv.projectId !== "missing-project-id";
