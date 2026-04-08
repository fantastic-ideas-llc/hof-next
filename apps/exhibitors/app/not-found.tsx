import Link from "next/link";

export default function NotFound() {
	return (
		<main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-6 px-6 py-24">
			<p className="eyebrow">Hall of Flowers</p>
			<h1 className="font-[var(--font-heading)] text-5xl">Page not found</h1>
			<p className="max-w-2xl text-base text-[var(--muted-foreground)]">
				The conference or page you requested does not exist in this manual yet.
			</p>
			<Link
				className="border border-[var(--card-border)] bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--muted-foreground)]"
				href="/"
			>
				Back to conference picker
			</Link>
		</main>
	);
}
