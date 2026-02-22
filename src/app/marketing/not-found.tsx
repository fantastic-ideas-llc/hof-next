import Link from "next/link";

export default function MarketingNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl text-zinc-900">404</h1>
      <p className="mt-4 text-lg text-zinc-600">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Go Home
      </Link>
    </div>
  );
}
