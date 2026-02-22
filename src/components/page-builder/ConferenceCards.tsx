import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/client";
import type { ConferenceCardsComponent } from "@/lib/sanity/types";

interface ConferenceCardsProps {
  data: ConferenceCardsComponent;
}

const statusLabels: Record<string, string> = {
  upcoming: "Coming Soon",
  active: "Tickets Available",
  draft: "Announced",
  completed: "Completed",
};

const statusColors: Record<string, string> = {
  upcoming: "bg-blue-100 text-blue-800",
  active: "bg-green-100 text-green-800",
  draft: "bg-zinc-100 text-zinc-600",
  completed: "bg-zinc-100 text-zinc-500",
};

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const month = startDate.toLocaleDateString("en-US", { month: "long" });
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  const year = startDate.getFullYear();
  return `${month} ${startDay}-${endDay}, ${year}`;
}

export function ConferenceCards({ data }: ConferenceCardsProps) {
  const {
    heading,
    conferences,
    layout = "side-by-side",
    cardStyle = "full",
  } = data;

  if (!conferences || conferences.length === 0) return null;

  const gridClass =
    layout === "side-by-side"
      ? "grid grid-cols-1 gap-6 md:grid-cols-2"
      : "flex flex-col gap-6";

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {heading && (
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">
            {heading}
          </h2>
        )}

        <div className={gridClass}>
          {conferences.map((conference) => (
            <ConferenceCard
              key={conference._id}
              conference={conference}
              style={cardStyle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ConferenceCard({
  conference,
  style,
}: {
  conference: ConferenceCardsComponent["conferences"][number];
  style: "full" | "compact";
}) {
  const href = conference.slug?.current ? `/${conference.slug.current}` : "#";

  if (style === "full") {
    return (
      <Link
        href={href}
        className="group relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-2xl"
      >
        {/* Background image */}
        {conference.heroImage ? (
          <Image
            src={urlFor(conference.heroImage).width(800).quality(85).url()}
            alt={conference.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Content */}
        <div className="relative z-10 p-6">
          {conference.status && (
            <span
              className={`mb-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                statusColors[conference.status] || statusColors.draft
              }`}
            >
              {statusLabels[conference.status] || conference.status}
            </span>
          )}
          <h3 className="text-2xl font-bold text-white">{conference.title}</h3>
          {conference.location && (
            <p className="mt-1 text-sm text-zinc-300">
              {conference.location.city}, {conference.location.state}
            </p>
          )}
          {conference.startDate && conference.endDate && (
            <p className="mt-1 text-sm text-zinc-300">
              {formatDateRange(conference.startDate, conference.endDate)}
            </p>
          )}
          {conference.tagline && (
            <p className="mt-2 text-sm text-zinc-200">{conference.tagline}</p>
          )}
        </div>
      </Link>
    );
  }

  // Compact style
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-zinc-200 p-4 transition-colors hover:border-orange-300 hover:bg-orange-50"
    >
      {conference.heroImage && (
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
          <Image
            src={urlFor(conference.heroImage).width(160).height(160).url()}
            alt={conference.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{conference.title}</h3>
          {conference.status && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                statusColors[conference.status] || statusColors.draft
              }`}
            >
              {statusLabels[conference.status] || conference.status}
            </span>
          )}
        </div>
        {conference.location && (
          <p className="text-sm text-zinc-500">
            {conference.location.city}, {conference.location.state}
          </p>
        )}
        {conference.startDate && conference.endDate && (
          <p className="text-sm text-zinc-500">
            {formatDateRange(conference.startDate, conference.endDate)}
          </p>
        )}
      </div>
    </Link>
  );
}
