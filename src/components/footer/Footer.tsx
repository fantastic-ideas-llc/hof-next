import Link from "next/link";
import type { Footer } from "@/lib/sanity/types";
import { PortableText } from "@/components/portable-text/PortableText";

interface SiteFooterProps {
  footer: Footer | null;
}

export function SiteFooter({ footer }: SiteFooterProps) {
  if (!footer) return null;

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Footer columns */}
        {footer.columns && footer.columns.length > 0 && (
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {footer.columns.map((column) => (
              <div key={column._key}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">
                  {column.heading}
                </h3>
                <ul className="mt-4 space-y-2">
                  {column.links?.map((link) => (
                    <li key={link._key}>
                      <Link
                        href={link.url}
                        className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Social links */}
        {footer.socialLinks && footer.socialLinks.length > 0 && (
          <div className="mt-8 flex gap-4 border-t border-zinc-200 pt-8">
            {footer.socialLinks.map((social) => (
              <a
                key={social._key}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-400 transition-colors hover:text-zinc-600"
                aria-label={social.platform}
              >
                {social.platform}
              </a>
            ))}
          </div>
        )}

        {/* Legal text */}
        {footer.legalText && (
          <div className="mt-8 border-t border-zinc-200 pt-8 text-xs text-zinc-400">
            <PortableText value={footer.legalText} />
          </div>
        )}
      </div>
    </footer>
  );
}
