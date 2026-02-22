"use client";

import { PortableText } from "@/components/portable-text/PortableText";
import type { FormSectionComponent } from "@/lib/sanity/types";

interface FormSectionProps {
  data: FormSectionComponent;
}

export function FormSection({ data }: FormSectionProps) {
  const { heading, description, formSource, embedCode, zohoFormId } = data;

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {heading && (
          <h2 className="mb-4 text-3xl font-bold tracking-tight">{heading}</h2>
        )}

        {description && (
          <div className="mb-8 text-zinc-600">
            <PortableText value={description} />
          </div>
        )}

        {formSource === "embed" && embedCode ? (
          <div
            className="overflow-hidden rounded-lg [&>iframe]:w-full [&>iframe]:border-0"
            dangerouslySetInnerHTML={{ __html: embedCode }}
          />
        ) : formSource === "zohoApi" && zohoFormId ? (
          <div className="rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
            <p className="text-sm font-medium text-zinc-500">
              Zoho API Form (Phase 2)
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              Form ID: {zohoFormId}
            </p>
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
            <p className="text-sm text-zinc-500">No form configured</p>
          </div>
        )}
      </div>
    </section>
  );
}
