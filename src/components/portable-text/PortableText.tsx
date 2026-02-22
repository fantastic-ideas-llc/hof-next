import {
  PortableText as SanityPortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/client";

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 text-2xl font-semibold">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-2 text-xl font-semibold">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-4 border-orange-500 pl-4 italic text-zinc-600">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    link: ({ children, value }) => {
      const href = value?.href || "#";
      const isExternal =
        href.startsWith("http://") || href.startsWith("https://");

      if (isExternal) {
        return (
          <a
            href={href}
            target={value?.openInNewTab ? "_blank" : undefined}
            rel={value?.openInNewTab ? "noopener noreferrer" : undefined}
            className="text-orange-600 underline hover:text-orange-700"
          >
            {children}
          </a>
        );
      }

      return (
        <Link
          href={href}
          className="text-orange-600 underline hover:text-orange-700"
        >
          {children}
        </Link>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 list-disc space-y-1 pl-6">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 list-decimal space-y-1 pl-6">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-6">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt || ""}
            width={800}
            height={450}
            className="rounded-lg"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-zinc-500">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

interface PortableTextProps {
  value: PortableTextBlock[] | undefined | null;
  className?: string;
}

export function PortableText({ value, className }: PortableTextProps) {
  if (!value) return null;

  return (
    <div className={className}>
      <SanityPortableText value={value} components={components} />
    </div>
  );
}
