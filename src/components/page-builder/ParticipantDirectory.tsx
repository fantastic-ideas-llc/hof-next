import type { ParticipantDirectoryComponent } from "@/lib/sanity/types";

interface ParticipantDirectoryProps {
  data: ParticipantDirectoryComponent;
}

interface GroupedEntries {
  letter: string;
  names: string[];
}

function groupAlphabetically(
  entries: { name: string }[]
): GroupedEntries[] {
  const sorted = [...entries].sort((a, b) =>
    a.name.localeCompare(b.name, "en", { sensitivity: "base" })
  );

  const groups: Record<string, string[]> = {};
  for (const entry of sorted) {
    const firstChar = entry.name.charAt(0).toUpperCase();
    const letter = /[A-Z]/.test(firstChar) ? firstChar : "#";
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(entry.name);
  }

  return Object.entries(groups)
    .sort(([a], [b]) => {
      if (a === "#") return -1;
      if (b === "#") return 1;
      return a.localeCompare(b);
    })
    .map(([letter, names]) => ({ letter, names }));
}

export function ParticipantDirectory({ data }: ParticipantDirectoryProps) {
  const { participantList } = data;

  if (!participantList) {
    return (
      <section className="px-4 py-12 text-center text-zinc-500 sm:px-6">
        No participant list selected
      </section>
    );
  }

  const entries = participantList.entries || [];
  const grouped = groupAlphabetically(entries);

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-2 text-3xl tracking-tight">
          {participantList.title}
        </h2>
        <p className="mb-8 text-zinc-500">
          {entries.length} confirmed{" "}
          {participantList.listType === "retailer" ? "retailers" : "exhibitors"}
        </p>

        {/* Alphabet quick-nav */}
        {grouped.length > 3 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {grouped.map(({ letter }) => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-sm font-medium text-zinc-700 transition-colors hover:bg-primary/10 hover:border-primary"
              >
                {letter}
              </a>
            ))}
          </div>
        )}

        {/* Grouped list */}
        <div className="space-y-8">
          {grouped.map(({ letter, names }) => (
            <div key={letter} id={`letter-${letter}`}>
              <h3 className="mb-3 border-b border-zinc-200 pb-2 text-2xl text-zinc-900">
                {letter}
              </h3>
              <p className="leading-relaxed text-zinc-700">
                {names.map((name, i) => (
                  <span key={name}>
                    {name}
                    {i < names.length - 1 && (
                      <span className="mx-2 text-zinc-300">&bull;</span>
                    )}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
