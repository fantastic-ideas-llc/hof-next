import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/client";
import { PortableText } from "@/components/portable-text/PortableText";
import type { HeroComponent } from "@/lib/sanity/types";

interface HeroProps {
  data: HeroComponent;
}

const overlayMap: Record<string, string> = {
  none: "",
  light: "bg-black/20",
  medium: "bg-black/40",
  heavy: "bg-black/60",
};

export function Hero({ data }: HeroProps) {
  const {
    backgroundType,
    backgroundImage,
    backgroundVideo,
    backgroundVideoPoster,
    overlayStrength = "medium",
    body,
    textAlignment = "center",
    ctas,
  } = data;

  const alignClass = textAlignment === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden">
      {/* Background media */}
      {backgroundType === "video" && backgroundVideo?.asset?.url ? (
        <>
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={
              backgroundVideoPoster
                ? urlFor(backgroundVideoPoster).width(1920).url()
                : undefined
            }
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={backgroundVideo.asset.url} type="video/mp4" />
          </video>
        </>
      ) : backgroundImage ? (
        <Image
          src={urlFor(backgroundImage).width(1920).quality(85).url()}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-900" />
      )}

      {/* Overlay */}
      {overlayStrength !== "none" && (
        <div className={`absolute inset-0 ${overlayMap[overlayStrength]}`} />
      )}

      {/* Content */}
      <div
        className={`relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-24 ${alignClass} sm:px-6 lg:px-8`}
      >
        {body && (
          <div className="text-white">
            <PortableText value={body} />
          </div>
        )}

        {ctas && ctas.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {ctas.map((cta) => (
              <Link
                key={cta._key}
                href={cta.url}
                className={`rounded-full px-6 py-3 text-sm font-medium transition-colors ${
                  cta.variant === "primary"
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "border border-white text-white hover:bg-white/10"
                }`}
              >
                {cta.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
