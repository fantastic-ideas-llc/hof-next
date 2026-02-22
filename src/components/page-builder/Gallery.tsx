"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/client";
import type { GalleryComponent } from "@/lib/sanity/types";

interface GalleryProps {
  data: GalleryComponent;
}

const columnClasses: Record<number, string> = {
  2: "columns-1 sm:columns-2",
  3: "columns-1 sm:columns-2 lg:columns-3",
  4: "columns-1 sm:columns-2 lg:columns-4",
};

export function Gallery({ data }: GalleryProps) {
  const { heading, images, columns = 3 } = data;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {heading && (
          <h2 className="mb-8 text-3xl font-bold tracking-tight">{heading}</h2>
        )}

        {/* Masonry grid */}
        <div className={`gap-4 ${columnClasses[columns] || columnClasses[3]}`}>
          {images.map((image, index) => (
            <button
              key={image._key || index}
              type="button"
              className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-lg"
              onClick={() => setLightboxIndex(index)}
            >
              <Image
                src={urlFor(image).width(600).quality(80).url()}
                alt={image.alt || ""}
                width={600}
                height={400}
                className="w-full transition-transform hover:scale-105"
                sizes={`(max-width: 640px) 100vw, (max-width: 1024px) 50vw, ${Math.round(100 / columns)}vw`}
              />
              {image.caption && (
                <p className="mt-1 text-left text-sm text-zinc-500">
                  {image.caption}
                </p>
              )}
            </button>
          ))}
        </div>

        {/* Lightbox */}
        {lightboxIndex !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              className="absolute right-4 top-4 text-white hover:text-zinc-300"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close lightbox"
            >
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Previous */}
            {lightboxIndex > 0 && (
              <button
                type="button"
                className="absolute left-4 text-white hover:text-zinc-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(lightboxIndex - 1);
                }}
                aria-label="Previous image"
              >
                <svg
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
            )}

            {/* Image */}
            <div
              className="relative max-h-[85vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={urlFor(images[lightboxIndex]).width(1400).quality(90).url()}
                alt={images[lightboxIndex].alt || ""}
                width={1400}
                height={900}
                className="max-h-[85vh] w-auto rounded-lg object-contain"
              />
              {images[lightboxIndex].caption && (
                <p className="mt-2 text-center text-sm text-zinc-300">
                  {images[lightboxIndex].caption}
                </p>
              )}
            </div>

            {/* Next */}
            {lightboxIndex < images.length - 1 && (
              <button
                type="button"
                className="absolute right-4 text-white hover:text-zinc-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(lightboxIndex + 1);
                }}
                aria-label="Next image"
              >
                <svg
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
