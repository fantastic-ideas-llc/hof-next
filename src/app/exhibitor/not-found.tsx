import Link from "next/link";

export default function ExhibitorNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-zinc-900">404</h1>
      <p className="mt-4 text-lg text-zinc-600">
        This exhibitor page doesn&apos;t exist for the current conference.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-orange-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600"
      >
        Back to Exhibitor Home
      </Link>
    </div>
  );
}
