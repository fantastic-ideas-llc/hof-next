"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { urlFor } from "@/lib/sanity/client";
import type {
  Navigation,
  Conference,
  ExhibitorPage,
  SanityImage,
} from "@/lib/sanity/types";

interface ExhibitorNavProps {
  navigation: Navigation | null;
  exhibitorPages: Pick<ExhibitorPage, "_id" | "title" | "slug" | "category">[];
  activeConference?: Conference;
  logo?: SanityImage;
}

// Group exhibitor pages by category for sidebar navigation
const CATEGORY_LABELS: Record<string, string> = {
  "show-info": "Show Info",
  rules: "Rules & Regulations",
  insurance: "Insurance",
  passes: "Exhibitor Passes",
  "solicitors-license": "Solicitors License",
  "marketing-pr": "Marketing & PR",
  "booth-info": "Booth Information",
  "video-guide": "Video Guide",
  "cannabis-guidelines": "Cannabis Guidelines",
  "cannabis-sales": "Cannabis Sales",
  faq: "FAQs",
  general: "General",
};

export function ExhibitorNav({
  navigation,
  exhibitorPages,
  activeConference,
  logo,
}: ExhibitorNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Group pages by category
  const grouped = exhibitorPages.reduce<
    Record<string, Pick<ExhibitorPage, "_id" | "title" | "slug" | "category">[]>
  >((acc, page) => {
    const cat = page.category || "general";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(page);
    return acc;
  }, {});

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        className="fixed bottom-4 right-4 z-50 rounded-full bg-primary p-3 text-white shadow-lg lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform overflow-y-auto border-r border-zinc-200 bg-white transition-transform lg:relative lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo + conference name */}
        <div className="border-b border-zinc-200 p-6">
          <Link href="/">
            {logo ? (
              <Image
                src={urlFor(logo).width(160).url()}
                alt="Hall of Flowers"
                width={160}
                height={36}
              />
            ) : (
              <span className="text-lg">Hall of Flowers</span>
            )}
          </Link>
          {activeConference && (
            <p className="mt-2 text-sm text-zinc-500">
              {activeConference.title}
            </p>
          )}
        </div>

        {/* Navigation links */}
        <nav className="p-4">
          <Link
            href="/"
            className={`block rounded-lg px-3 py-2 text-sm font-medium ${
              pathname === "/" || pathname === "/exhibitor"
                ? "bg-primary/10 text-primary-hover"
                : "text-zinc-700 hover:bg-zinc-100"
            }`}
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>

          {/* Custom nav items from CMS */}
          {navigation?.items?.map((item) => (
            <Link
              key={item._key}
              href={item.link}
              className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                pathname === item.link
                  ? "bg-primary/10 text-primary-hover"
                  : "text-zinc-700 hover:bg-zinc-100"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {/* Exhibitor pages grouped by category */}
          {Object.entries(grouped).map(([category, pages]) => (
            <div key={category} className="mt-4">
              <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {CATEGORY_LABELS[category] || category}
              </p>
              {pages.map((page) => {
                const href = `/${page.slug.current}`;
                return (
                  <Link
                    key={page._id}
                    href={href}
                    className={`block rounded-lg px-3 py-2 text-sm ${
                      pathname === href
                        ? "bg-primary/10 font-medium text-primary-hover"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {page.title}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
