"use client";

import Image from "next/image";
import { useState } from "react";
import { urlFor } from "@/lib/sanity/client";
import type { MediaEmbedComponent } from "@/lib/sanity/types";

interface MediaEmbedProps {
  data: MediaEmbedComponent;
}

const widthMap: Record<string, string> = {
  medium: "max-w-4xl",
  wide: "max-w-6xl",
  full: "max-w-none",
};

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#]+)/
  );
  return match ? match[1] : null;
}

export function MediaEmbed({ data }: MediaEmbedProps) {
  const { mediaType, youtubeUrl, videoFile, posterImage, caption, width = "wide" } = data;
  const [playing, setPlaying] = useState(false);

  const youtubeId = youtubeUrl ? getYouTubeId(youtubeUrl) : null;

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className={`mx-auto ${widthMap[width]}`}>
        <div className="relative aspect-video overflow-hidden rounded-lg bg-zinc-900">
          {mediaType === "youtube" && youtubeId ? (
            playing ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
                allow="autoplay; fullscreen"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
                title={caption || "Video"}
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="group absolute inset-0 flex items-center justify-center"
                aria-label="Play video"
              >
                {posterImage ? (
                  <Image
                    src={urlFor(posterImage).width(1280).url()}
                    alt={caption || "Video thumbnail"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 80vw"
                  />
                ) : (
                  <Image
                    src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                    alt={caption || "Video thumbnail"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 80vw"
                  />
                )}
                {/* Play button overlay */}
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
                  <svg
                    className="ml-1 h-6 w-6 text-zinc-900"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>
            )
          ) : mediaType === "upload" && videoFile?.asset?.url ? (
            <video
              controls
              poster={
                posterImage
                  ? urlFor(posterImage).width(1280).url()
                  : undefined
              }
              className="h-full w-full"
            >
              <source src={videoFile.asset.url} type="video/mp4" />
            </video>
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-500">
              No media configured
            </div>
          )}
        </div>

        {caption && (
          <p className="mt-3 text-center text-sm text-zinc-500">{caption}</p>
        )}
      </div>
    </section>
  );
}
