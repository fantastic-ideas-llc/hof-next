"use client";

import { useRouter } from "next/navigation";

interface ConferenceOption {
	city?: string;
	name: string;
	slug: string;
}

export function ConferenceSwitcher({
	conferences,
	currentSlug,
}: {
	conferences: ConferenceOption[];
	currentSlug: string;
}) {
	const router = useRouter();

	if (conferences.length <= 1) return null;

	return (
		<div className="relative">
			<select
				aria-label="Switch conference"
				className="w-full cursor-pointer appearance-none rounded-lg border border-fd-border bg-fd-secondary/50 px-3 py-2 pe-8 text-sm font-medium text-fd-foreground outline-none transition-colors hover:bg-fd-accent focus:border-fd-ring"
				onChange={(e) => router.push(`/${e.target.value}`)}
				value={currentSlug}
			>
				{conferences.map((c) => (
					<option key={c.slug} value={c.slug}>
						{c.city ? `${c.name} — ${c.city}` : c.name}
					</option>
				))}
			</select>
			<svg
				aria-hidden="true"
				className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-fd-muted-foreground"
				fill="none"
				stroke="currentColor"
				strokeWidth={2}
				viewBox="0 0 24 24"
			>
				<path d="m7 15 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
				<path d="m7 9 5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		</div>
	);
}
