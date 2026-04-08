import Link from "next/link";

import { hasStudioEnv } from "@/lib/sanity-env";

export default function MarketingHomePage() {
	return (
		<main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-10 md:px-10">
			<section className="marketing-card overflow-hidden rounded-[2rem] p-8 md:p-12">
				<p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
					Hall of Flowers
				</p>
				<div className="mt-5 grid gap-6 md:grid-cols-[1.3fr_0.8fr]">
					<div className="space-y-5">
						<h1 className="font-[var(--font-heading)] text-5xl leading-tight md:text-6xl">
							Marketing site shell with the shared Sanity Studio attached.
						</h1>
						<p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
							This app owns the Studio and the shared schema package for both the marketing site and
							the exhibitors docs site in the monorepo.
						</p>
					</div>
					<div className="rounded-[1.5rem] bg-[var(--brand-soft)] p-6">
						<p className="text-sm leading-7 text-[var(--foreground)]/78">
							Studio env configured: {hasStudioEnv ? "yes" : "not yet"}
						</p>
					</div>
				</div>
			</section>

			<section className="grid gap-5 md:grid-cols-2">
				<Link
					className="marketing-card rounded-[1.5rem] p-6 transition hover:-translate-y-0.5"
					href="/cms"
				>
					<p className="text-sm font-semibold text-[var(--brand)]">Open Studio</p>
					<h2 className="mt-3 text-2xl font-semibold">Shared content management</h2>
					<p className="mt-3 text-sm leading-7 text-[var(--muted)]">
						Manage conferences, exhibitor manual content, shared FAQs, and staff in one place for
						both sites.
					</p>
				</Link>

				<div className="marketing-card rounded-[1.5rem] p-6">
					<p className="text-sm font-semibold text-[var(--brand)]">Deployment note</p>
					<h2 className="mt-3 text-2xl font-semibold">Separate domains, one repo</h2>
					<p className="mt-3 text-sm leading-7 text-[var(--muted)]">
						This app is intended for `hallofflowers.com`, while the exhibitors app is intended for
						`exhibitors.hallofflowers.com`.
					</p>
				</div>
			</section>
		</main>
	);
}
