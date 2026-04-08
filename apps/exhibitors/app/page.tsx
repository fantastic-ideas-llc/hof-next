import Link from "next/link";

import { getActiveConferences } from "@/lib/data";

export default async function HomePage() {
	const conferences = await getActiveConferences();

	return (
		<main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-10 md:px-10">
			<section className="surface-card p-8 md:p-12">
				<p className="eyebrow">Exhibitor manual</p>
				<div className="mt-4 grid gap-8 md:grid-cols-[1.4fr_0.9fr]">
					<div className="space-y-5">
						<h1 className="max-w-3xl font-[var(--font-heading)] text-5xl leading-tight md:text-6xl">
							Conference operations, booth details, and compliance notes in one place.
						</h1>
						<p className="max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">
							Each Hall of Flowers conference can publish its own docs, booth specs, and FAQ set
							while sharing one Sanity content model with the marketing site.
						</p>
					</div>
					<div className="border border-[var(--card-border)] bg-[var(--brand-soft)] p-6">
						<p className="eyebrow">Current state</p>
						<p className="mt-4 text-sm leading-7 text-[var(--foreground)]/78">
							If Sanity env vars are not set yet, this scaffold falls back to a sample conference so
							layout and routing can still be reviewed.
						</p>
					</div>
				</div>
			</section>

			<section className="space-y-5">
				<div>
					<p className="eyebrow">Conference picker</p>
					<h2 className="mt-2 font-[var(--font-heading)] text-3xl">Active conferences</h2>
				</div>

				<div className="grid gap-5 md:grid-cols-2">
					{conferences.map((conference) => (
						<Link
							className="surface-card group p-6 transition hover:bg-[var(--muted)]"
							href={`/${conference.slug}`}
							key={conference._id}
						>
							<p className="eyebrow">
								{conference.city}, {conference.state}
							</p>
							<h3 className="mt-3 text-2xl font-semibold">{conference.name}</h3>
							<p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
								Choose this conference to open the docs sidebar, search within that show, and review
								booth-specific requirements.
							</p>
							<p className="mt-6 text-sm font-semibold text-[var(--brand)]">Open manual</p>
						</Link>
					))}
				</div>
			</section>
		</main>
	);
}
