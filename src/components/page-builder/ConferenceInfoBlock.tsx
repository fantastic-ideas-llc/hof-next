import Link from "next/link";
import { PortableText } from "@/components/portable-text/PortableText";
import type { ConferenceInfoBlockComponent } from "@/lib/sanity/types";

interface ConferenceInfoBlockProps {
  data: ConferenceInfoBlockComponent;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

const exhibitorPageLabels: Record<string, string> = {
  rules: "Rules & Regulations",
  faq: "FAQs",
  "booth-info": "Booth Information",
  insurance: "Insurance",
  passes: "Exhibitor Passes",
  guidelines: "Cannabis Guidelines",
};

export function ConferenceInfoBlock({ data }: ConferenceInfoBlockProps) {
  const {
    conference,
    showFields = [],
    showExhibitorPages = [],
    displayMode = "summary",
  } = data;

  if (!conference) {
    return (
      <section className="px-4 py-12 text-center text-zinc-500 sm:px-6">
        No conference selected
      </section>
    );
  }

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-8 text-3xl font-bold tracking-tight">
          {conference.title}
        </h2>

        <div className="space-y-8">
          {/* Description */}
          {showFields.includes("description") && conference.description && (
            <div>
              <PortableText value={conference.description} />
            </div>
          )}

          {/* Schedule */}
          {showFields.includes("schedule") && conference.showSchedule && (
            <div>
              <h3 className="mb-4 text-xl font-semibold">Show Schedule</h3>
              <div className="space-y-3">
                {conference.showSchedule.map((slot) => (
                  <div
                    key={slot._key}
                    className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3"
                  >
                    <span className="font-medium">{slot.label}</span>
                    <span className="text-sm text-zinc-500">
                      {formatDate(slot.startDate)}{" "}
                      {formatTime(slot.startDate)} &ndash;{" "}
                      {formatTime(slot.endDate)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Load-in schedule */}
          {showFields.includes("loadIn") && conference.loadInSchedule && (
            <div>
              <h3 className="mb-4 text-xl font-semibold">Load-In Schedule</h3>
              <div className="space-y-3">
                {conference.loadInSchedule.map((slot) => (
                  <div
                    key={slot._key}
                    className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3"
                  >
                    <span className="font-medium">{slot.label}</span>
                    <span className="text-sm text-zinc-500">
                      {formatDate(slot.startDate)}{" "}
                      {formatTime(slot.startDate)} &ndash;{" "}
                      {formatTime(slot.endDate)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contacts */}
          {showFields.includes("contacts") &&
            conference.contacts &&
            conference.contacts.length > 0 && (
              <div>
                <h3 className="mb-4 text-xl font-semibold">Contacts</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {conference.contacts.map((contact) => (
                    <div
                      key={contact._id}
                      className="rounded-lg border border-zinc-200 p-4"
                    >
                      <p className="font-medium">{contact.name}</p>
                      {contact.role && (
                        <p className="text-sm text-zinc-500">{contact.role}</p>
                      )}
                      {contact.email && (
                        <a
                          href={`mailto:${contact.email}`}
                          className="mt-1 block text-sm text-orange-600 hover:text-orange-700"
                        >
                          {contact.email}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Exhibitor page links */}
          {showExhibitorPages.length > 0 && (
            <div>
              <h3 className="mb-4 text-xl font-semibold">
                Exhibitor Resources
              </h3>
              {displayMode === "summary" ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {showExhibitorPages.map((category) => (
                    <Link
                      key={category}
                      href={`/${category}`}
                      className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 transition-colors hover:border-orange-300 hover:bg-orange-50"
                    >
                      <span className="font-medium">
                        {exhibitorPageLabels[category] || category}
                      </span>
                      <svg
                        className="h-4 w-4 text-zinc-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {showExhibitorPages.map((category) => (
                    <div
                      key={category}
                      className="rounded-lg border border-zinc-200 p-4"
                    >
                      <p className="font-medium">
                        {exhibitorPageLabels[category] || category}
                      </p>
                      <p className="mt-1 text-sm text-zinc-500">
                        Content loaded inline from exhibitor pages
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
