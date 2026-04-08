"use client";

export default function StudioError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="flex h-dvh flex-col items-center justify-center gap-4 bg-[#111318] text-white">
			<h2 className="text-lg font-semibold">Something went wrong loading the Studio</h2>
			<p className="text-sm text-gray-400">{error.message}</p>
			<button
				className="rounded bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200"
				onClick={reset}
				type="button"
			>
				Try again
			</button>
		</div>
	);
}
