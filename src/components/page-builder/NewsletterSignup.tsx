"use client";

import { useState, type FormEvent } from "react";
import { PortableText } from "@/components/portable-text/PortableText";
import type { NewsletterSignupComponent } from "@/lib/sanity/types";

interface NewsletterSignupProps {
  data: NewsletterSignupComponent;
}

export function NewsletterSignup({ data }: NewsletterSignupProps) {
  const {
    heading,
    description,
    interestOptions,
    successMessage = "Thanks! You're on the list.",
  } = data;

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    // TODO: Connect to newsletter provider API (Mailchimp, ConvertKit, etc.)
    // For now, simulate a successful submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitted(true);
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <div className="rounded-2xl bg-green-50 p-8">
            <svg
              className="mx-auto h-12 w-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-4 text-lg font-medium text-green-800">
              {successMessage}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        {heading && (
          <h2 className="mb-4 text-center text-3xl tracking-tight">
            {heading}
          </h2>
        )}

        {description && (
          <div className="mb-8 text-center text-zinc-600">
            <PortableText value={description} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="newsletter-first-name"
                className="mb-1 block text-sm font-medium text-zinc-700"
              >
                First Name
              </label>
              <input
                id="newsletter-first-name"
                name="firstName"
                type="text"
                required
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="newsletter-last-name"
                className="mb-1 block text-sm font-medium text-zinc-700"
              >
                Last Name
              </label>
              <input
                id="newsletter-last-name"
                name="lastName"
                type="text"
                required
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="newsletter-email"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Email
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {interestOptions && interestOptions.length > 0 && (
            <div>
              <label
                htmlFor="newsletter-interest"
                className="mb-1 block text-sm font-medium text-zinc-700"
              >
                Interest
              </label>
              <select
                id="newsletter-interest"
                name="interest"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {interestOptions.map((option) => (
                  <option key={option._key} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
