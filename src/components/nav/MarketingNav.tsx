"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/client";
import type { Navigation, Conference, SanityImage } from "@/lib/sanity/types";

interface MarketingNavProps {
  navigation: Navigation | null;
  activeConference?: Conference;
  secondaryConference?: Conference;
  logo?: SanityImage;
}

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const month = startDate.toLocaleDateString("en-US", { month: "short" });
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  return `${month} ${startDay}-${endDay}`;
}

export function MarketingNav({
  navigation,
  activeConference,
  secondaryConference,
  logo,
}: MarketingNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
      {/* Conference date bar */}
      {navigation?.showConferenceDates && activeConference && (
        <div className="bg-zinc-900 px-4 py-1.5 text-center text-sm text-white">
          <span className="font-medium">
            {activeConference.location?.city},{" "}
            {activeConference.location?.state}
          </span>
          {activeConference.startDate && activeConference.endDate && (
            <span className="ml-1 text-zinc-300">
              &middot;{" "}
              {formatDateRange(
                activeConference.startDate,
                activeConference.endDate
              )}
            </span>
          )}
          {secondaryConference && (
            <>
              <span className="mx-2 text-zinc-500">|</span>
              <span className="font-medium">
                {secondaryConference.location?.city},{" "}
                {secondaryConference.location?.state}
              </span>
              {secondaryConference.startDate &&
                secondaryConference.endDate && (
                  <span className="ml-1 text-zinc-300">
                    &middot;{" "}
                    {formatDateRange(
                      secondaryConference.startDate,
                      secondaryConference.endDate
                    )}
                  </span>
                )}
            </>
          )}
        </div>
      )}

      {/* Main nav */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          {logo ? (
            <Image
              src={urlFor(logo).width(180).url()}
              alt="Hall of Flowers"
              width={180}
              height={40}
              priority
            />
          ) : (
            <span className="text-xl font-bold">Hall of Flowers</span>
          )}
        </Link>

        {/* Desktop nav items */}
        <div className="hidden items-center gap-6 lg:flex">
          {navigation?.items?.map((item) => (
            <Link
              key={item._key}
              href={item.link}
              className="text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop social + CTAs */}
        <div className="hidden items-center gap-4 lg:flex">
          {navigation?.socialLinks?.map((social) => (
            <a
              key={social._key}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 transition-colors hover:text-zinc-600"
              aria-label={social.platform}
            >
              <span className="text-sm">{social.platform}</span>
            </a>
          ))}
          {navigation?.ctaButtons?.map((cta) => (
            <Link
              key={cta._key}
              href={cta.url}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                cta.variant === "primary"
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              {cta.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden"
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
          <div className="flex flex-col gap-2">
            {navigation?.items?.map((item) => (
              <Link
                key={item._key}
                href={item.link}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {navigation?.ctaButtons?.map((cta) => (
              <Link
                key={cta._key}
                href={cta.url}
                className={`rounded-full px-4 py-2 text-center text-sm font-medium ${
                  cta.variant === "primary"
                    ? "bg-orange-500 text-white"
                    : "border border-zinc-300 text-zinc-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {cta.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
