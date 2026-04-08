import { categoryLabels } from "@hof/sanity";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getConferenceBundle } from "@/lib/data";
import { PortableTextContent } from "@/lib/portable-text";

function formatTimelineDate(date: string) {
	return new Date(`${date}T00:00:00`)
		.toLocaleDateString("en-US", {
			day: "numeric",
			month: "short",
		})
		.toUpperCase();
}

export default async function ConferenceOverviewPage({
	params,
}: {
	params: Promise<{ conference: string }>;
}) {
	const { conference } = await params;
	const bundle = await getConferenceBundle(conference);

	if (!bundle) notFound();

	return (
		<main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 md:px-8">
			<section className="surface-card p-8 md:p-10">
				<p className="eyebrow">Conference overview</p>
				<h1 className="mt-4 font-[var(--font-heading)] text-4xl md:text-5xl">
					{bundle.conference.name}
				</h1>
				{bundle.conference.description ? (
					<div className="mt-5 max-w-3xl text-sm leading-7 text-[var(--muted-foreground)]">
						<PortableTextContent value={bundle.conference.description} />
					</div>
				) : null}

				<div className="mt-6 grid gap-6 sm:grid-cols-2">
					{bundle.conference.venue?.name && (
						<div>
							<p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
								Venue
							</p>
							<p className="mt-1 font-semibold">{bundle.conference.venue.name}</p>
							{bundle.conference.venue.address ? (
								<p className="text-sm text-[var(--muted-foreground)]">
									{bundle.conference.venue.address}
								</p>
							) : bundle.conference.venue.city ? (
								<p className="text-sm text-[var(--muted-foreground)]">
									{[bundle.conference.venue.city, bundle.conference.venue.state]
										.filter(Boolean)
										.join(", ")}
									{bundle.conference.venue.zip ? ` ${bundle.conference.venue.zip}` : ""}
								</p>
							) : null}
						</div>
					)}

					{bundle.conference.startDate && (
						<div>
							<p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
								Dates
							</p>
							<p className="mt-1 font-semibold">
								{new Date(bundle.conference.startDate).toLocaleDateString("en-US", {
									month: "long",
									day: "numeric",
									year: "numeric",
								})}
								{bundle.conference.endDate &&
								bundle.conference.endDate !== bundle.conference.startDate
									? ` - ${new Date(bundle.conference.endDate).toLocaleDateString("en-US", {
											month: "long",
											day: "numeric",
											year: "numeric",
										})}`
									: ""}
							</p>
						</div>
					)}

					{bundle.conference.hours && bundle.conference.hours.length > 0 ? (
						<div className="sm:col-span-2">
							<p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
								Hours
							</p>
							<div className="mt-1 flex flex-wrap gap-x-6 gap-y-1">
								{bundle.conference.hours.map((h) => (
									<p key={h._key ?? h.day} className="text-sm">
										<span className="font-semibold">{h.day}</span>{" "}
										<span className="text-[var(--muted-foreground)]">
											{h.open} - {h.close}
										</span>
									</p>
								))}
							</div>
						</div>
					) : null}
				</div>
			</section>

			{bundle.conference.timelineSections && bundle.conference.timelineSections.length > 0 ? (
				<section className="surface-card p-6 md:p-8">
					<p className="eyebrow">Manual timeline</p>
					<div className="mt-5 space-y-6">
						{bundle.conference.timelineSections.map((section) => (
							<div
								className="overflow-hidden border border-[var(--card-border)] bg-white"
								key={section._key ?? section.title}
							>
								<div className="border-b border-[var(--card-border)] px-4 py-3">
									<h2 className="text-lg font-semibold uppercase tracking-wide">{section.title}</h2>
								</div>
								<div className="divide-y divide-[var(--card-border)]">
									{section.entries.map((entry) => (
										<div
											className="grid gap-3 px-4 py-4 md:grid-cols-[180px_1fr]"
											key={entry._key ?? `${section.title}-${entry.date}`}
										>
											<div>
												<p className="text-2xl font-semibold">{formatTimelineDate(entry.date)}</p>
												{entry.relativeLabel ? (
													<p className="mt-1 text-sm text-[var(--muted-foreground)]">
														{entry.relativeLabel}
													</p>
												) : null}
											</div>
											<div>
												<ul className="space-y-1 text-sm leading-7">
													{entry.deliverables.map((deliverable) => (
														<li key={deliverable._key ?? deliverable.label}>
															<span>{deliverable.label}</span>
															{deliverable.timeRange ? (
																<span className="text-[var(--muted-foreground)]">
																	{" "}
																	- {deliverable.timeRange}
																</span>
															) : null}
														</li>
													))}
												</ul>
												{entry.note ? (
													<p className="mt-2 text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
														{entry.note}
													</p>
												) : null}
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</section>
			) : null}

			<section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
				<div className="space-y-6">
					<div className="surface-card p-6">
						<p className="eyebrow">Docs pages</p>
						<div className="mt-5 grid gap-4 md:grid-cols-2">
							{bundle.docs.map((doc) => (
								<Link
									className="border border-[var(--card-border)] bg-white p-5 transition hover:bg-[var(--muted)]"
									href={`/${bundle.conference.slug}/${doc.slug}`}
									key={doc._id}
								>
									<p className="eyebrow">{categoryLabels[doc.category]}</p>
									<h2 className="mt-2 text-xl font-semibold">{doc.title}</h2>
									<p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
										{doc.description}
									</p>
								</Link>
							))}
						</div>
					</div>

					<div className="surface-card p-6">
						<p className="eyebrow">Booth types</p>
						<div className="mt-5 grid gap-4 md:grid-cols-2">
							{bundle.booths.map((booth) => (
								<Link
									className="border border-[var(--card-border)] bg-white p-5 transition hover:bg-[var(--muted)]"
									href={`/${bundle.conference.slug}/booths/${booth.slug}`}
									key={booth._id}
								>
									<h2 className="text-xl font-semibold">{booth.name}</h2>
									<p className="mt-2 text-sm text-[var(--muted-foreground)]">
										{booth.dimensions}
										{typeof booth.price === "number"
											? ` | From $${booth.price.toLocaleString()}`
											: ""}
									</p>
									<p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
										{booth.description}
									</p>
								</Link>
							))}
						</div>
					</div>
				</div>

				<div className="space-y-6">
					<div className="surface-card p-6">
						<p className="eyebrow">Exhibitor FAQs</p>
						<div className="mt-5 space-y-3">
							{bundle.faqs.map((faq) => (
								<Link
									className="block border border-[var(--card-border)] bg-white px-4 py-4 text-sm font-medium transition hover:bg-[var(--muted)]"
									href={`/${bundle.conference.slug}/faqs/${faq.slug}`}
									key={faq._id}
								>
									{faq.question}
								</Link>
							))}
						</div>
					</div>

					<div className="surface-card p-6">
						<p className="eyebrow">Contacts</p>
						<div className="mt-5 space-y-6">
							{(() => {
								const grouped = new Map<string, typeof bundle.conference.contacts>();

								for (const contact of bundle.conference.contacts) {
									const roles =
										contact.roles && contact.roles.length > 0 ? contact.roles : ["General"];

									for (const role of roles) {
										const list = grouped.get(role) ?? [];
										list.push(contact);
										grouped.set(role, list);
									}
								}

								return Array.from(grouped.entries()).map(([role, contacts]) => (
									<div key={role}>
										<h3 className="text-xs font-bold uppercase tracking-wider">{role}</h3>
										<div className="mt-3 space-y-3">
											{contacts.map((contact) => (
												<div key={contact._id}>
													<p className="font-semibold">{contact.name}</p>
													<p className="text-sm">
														<a href={`mailto:${contact.email}`}>{contact.email}</a>
													</p>
												</div>
											))}
										</div>
									</div>
								));
							})()}
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
