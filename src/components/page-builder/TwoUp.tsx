import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/client";
import { PortableText } from "@/components/portable-text/PortableText";
import type { TwoUpComponent } from "@/lib/sanity/types";

interface TwoUpProps {
  data: TwoUpComponent;
}

const toneMap: Record<string, string> = {
  neutral: "bg-white",
  subtle: "bg-zinc-50",
  bold: "bg-zinc-900 text-white",
  brand: "bg-primary/10",
};

export function TwoUp({ data }: TwoUpProps) {
  const {
    image,
    imagePosition = "left",
    body,
    ctas,
    tone = "neutral",
  } = data;

  const isImageLeft = imagePosition === "left";

  return (
    <section className={toneMap[tone]}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`flex flex-col items-center gap-8 py-16 lg:flex-row lg:gap-12 ${
            isImageLeft ? "" : "lg:flex-row-reverse"
          }`}
        >
          {/* Image side */}
          <div className="w-full lg:w-1/2">
            {image ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src={urlFor(image).width(800).quality(85).url()}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] rounded-lg bg-zinc-200" />
            )}
          </div>

          {/* Content side */}
          <div className="flex w-full flex-col gap-6 lg:w-1/2">
            {body && <PortableText value={body} />}

            {ctas && ctas.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {ctas.map((cta) => (
                  <Link
                    key={cta._key}
                    href={cta.url}
                    className={`rounded-full px-6 py-3 text-sm font-medium transition-colors ${
                      cta.variant === "primary"
                        ? "bg-primary text-white hover:bg-primary-hover"
                        : tone === "bold"
                          ? "border border-white text-white hover:bg-white/10"
                          : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    {cta.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
