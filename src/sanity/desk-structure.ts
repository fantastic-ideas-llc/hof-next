import type { StructureBuilder } from "sanity/structure";

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      // Site Settings singleton
      S.listItem()
        .title("Site Settings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings")
        ),

      S.divider(),

      // Conferences
      S.listItem()
        .title("Conferences")
        .child(
          S.documentTypeList("conference")
            .title("Conferences")
            .child((conferenceId) =>
              S.list()
                .title("Conference Content")
                .items([
                  // Conference details
                  S.listItem()
                    .title("Details")
                    .child(
                      S.document()
                        .schemaType("conference")
                        .documentId(conferenceId)
                    ),

                  S.divider(),

                  // Marketing pages for this conference
                  S.listItem()
                    .title("Marketing Pages")
                    .child(
                      S.documentList()
                        .title("Marketing Pages")
                        .filter(
                          '_type == "page" && conference._ref == $conferenceId'
                        )
                        .params({ conferenceId })
                    ),

                  // Exhibitor pages for this conference
                  S.listItem()
                    .title("Exhibitor Pages")
                    .child(
                      S.documentList()
                        .title("Exhibitor Pages")
                        .filter(
                          '_type == "exhibitorPage" && conference._ref == $conferenceId'
                        )
                        .params({ conferenceId })
                    ),

                  // Participant lists for this conference
                  S.listItem()
                    .title("Participant Lists")
                    .child(
                      S.documentList()
                        .title("Participant Lists")
                        .filter(
                          '_type == "participantList" && conference._ref == $conferenceId'
                        )
                        .params({ conferenceId })
                    ),
                ])
            )
        ),

      S.divider(),

      // Pages (general — no conference scope)
      S.listItem()
        .title("General Pages")
        .child(
          S.documentList()
            .title("General Pages")
            .filter('_type == "page" && !defined(conference)')
        ),

      // All pages (for quick access)
      S.documentTypeListItem("page").title("All Pages"),
      S.documentTypeListItem("exhibitorPage").title("All Exhibitor Pages"),

      S.divider(),

      // Contacts
      S.documentTypeListItem("contact").title("Contacts"),

      // Venues
      S.documentTypeListItem("venue").title("Venues"),

      // Participant Lists
      S.documentTypeListItem("participantList").title("Participant Lists"),

      S.divider(),

      // Navigation
      S.listItem()
        .title("Navigation")
        .child(S.documentTypeList("navigation").title("Navigation")),

      // Footer
      S.listItem()
        .title("Footer")
        .child(S.documentTypeList("footer").title("Footer")),

      // Redirects
      S.documentTypeListItem("redirect").title("Redirects"),
    ]);
