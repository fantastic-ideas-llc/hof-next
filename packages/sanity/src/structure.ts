import type { StructureResolver } from "sanity/structure";
import { categoryLabels, docCategories } from "./constants";

const docsByConference = (S: Parameters<StructureResolver>[0], conferenceId: string) =>
	S.list()
		.title("Docs")
		.items([
			S.listItem()
				.title("All docs")
				.child(
					S.documentList()
						.title("All exhibitor docs")
						.schemaType("exhibitorDoc")
						.filter('_type == "exhibitorDoc" && conference._ref == $conferenceId')
						.params({ conferenceId })
						.defaultOrdering([
							{ field: "category", direction: "asc" },
							{ field: "sortOrder", direction: "asc" },
							{ field: "title", direction: "asc" },
						]),
				),
			...docCategories.map((category) =>
				S.listItem()
					.title(categoryLabels[category])
					.child(
						S.documentList()
							.title(categoryLabels[category])
							.schemaType("exhibitorDoc")
							.filter(
								'_type == "exhibitorDoc" && conference._ref == $conferenceId && category == $category',
							)
							.params({ category, conferenceId })
							.defaultOrdering([
								{ field: "sortOrder", direction: "asc" },
								{ field: "title", direction: "asc" },
							]),
					),
			),
		]);

const exhibitorManualByConference = (S: Parameters<StructureResolver>[0]) =>
	S.documentTypeList("conference")
		.title("Exhibitor manual")
		.defaultOrdering([{ field: "startDate", direction: "desc" }])
		.child((conferenceId) =>
			S.list()
				.title("Exhibitor manual")
				.items([
					S.listItem()
						.title("Overview")
						.child(
							S.document().schemaType("conference").documentId(conferenceId).title("Overview"),
						),
					S.listItem().title("Docs").child(docsByConference(S, conferenceId)),
					S.listItem()
						.title("Booth types")
						.child(
							S.documentList()
								.title("Booth types")
								.schemaType("boothType")
								.filter('_type == "boothType" && conference._ref == $conferenceId')
								.params({ conferenceId })
								.defaultOrdering([{ field: "name", direction: "asc" }]),
						),
					S.listItem()
						.title("Exhibitor FAQs")
						.child(
							S.documentList()
								.title("Exhibitor FAQs")
								.schemaType("exhibitorFaq")
								.filter('_type == "exhibitorFaq" && conference._ref == $conferenceId')
								.params({ conferenceId })
								.defaultOrdering([
									{ field: "sortOrder", direction: "asc" },
									{ field: "question", direction: "asc" },
								]),
						),
				]),
		);

export const deskStructure: StructureResolver = (S) =>
	S.list()
		.title("Hall of Flowers")
		.items([
			S.documentTypeListItem("conference").title("Conferences"),
			S.listItem().title("Exhibitor manual").child(exhibitorManualByConference(S)),
			S.documentTypeListItem("faq").title("Shared FAQs"),
			S.listItem()
				.title("Staff")
				.child(
					S.list()
						.title("Staff")
						.items([
							S.documentTypeListItem("staffRole").title("Roles"),
							S.documentTypeListItem("staff").title("Members"),
						]),
				),
		]);
