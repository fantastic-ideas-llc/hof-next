"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Navigation, Conference } from "@/lib/sanity/types";

interface MarketingNavProps {
  navigation: Navigation | null;
  activeConference?: Conference;
  secondaryConference?: Conference;
}

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start + "T00:00:00");
  const endDate = new Date(end + "T00:00:00");
  const month = startDate.toLocaleDateString("en-US", { month: "long" });
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  return `${month} ${startDay} & ${endDay}`;
}

export function MarketingNav({
  navigation,
  activeConference,
  secondaryConference,
}: MarketingNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center px-4 py-4 sm:px-6 lg:px-8">
        {/* Left: Logo + Conference info */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/hof-logo.svg"
              alt="Hall of Flowers"
              width={180}
              height={64}
              className="h-12 w-auto lg:h-16"
              priority
            />
          </Link>

          {activeConference && (
            <div className="hidden leading-none sm:block">
              <p className="text-sm italic text-black">
                {activeConference.location?.city},{" "}
                {activeConference.location?.state}
              </p>
              {activeConference.startDate && activeConference.endDate && (
                <p className="font-display text-sm text-black">
                  {formatDateRange(
                    activeConference.startDate,
                    activeConference.endDate
                  )}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Center: Nav links in Recline font */}
        <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          {navigation?.items?.map((item) => (
            <Link
              key={item._key}
              href={item.link}
              className="font-display text-base tracking-wide text-black transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right: Tickets button */}
        <div className="hidden items-center lg:flex">
          <Link
            href="/tickets"
            className="font-display bg-primary px-6 py-3 text-sm uppercase tracking-wider text-white transition-colors hover:bg-primary-hover"
          >
            Tickets
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="ml-auto lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 pb-4 pt-2 lg:hidden">
          {activeConference && (
            <div className="mb-3 border-b border-zinc-100 pb-3 leading-none">
              <p className="text-sm italic text-black">
                {activeConference.location?.city},{" "}
                {activeConference.location?.state}
              </p>
              {activeConference.startDate && activeConference.endDate && (
                <p className="font-display text-sm text-black">
                  {formatDateRange(
                    activeConference.startDate,
                    activeConference.endDate
                  )}
                </p>
              )}
            </div>
          )}
          <div className="flex flex-col gap-1">
            {navigation?.items?.map((item) => (
              <Link
                key={item._key}
                href={item.link}
                className="font-display px-3 py-2 text-sm text-black hover:bg-zinc-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link
              href="/tickets"
              className="font-display block bg-primary px-4 py-3 text-center text-sm uppercase tracking-wider text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tickets
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
