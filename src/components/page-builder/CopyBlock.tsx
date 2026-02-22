import { PortableText } from "@/components/portable-text/PortableText";
import type { CopyBlockComponent } from "@/lib/sanity/types";

interface CopyBlockProps {
  data: CopyBlockComponent;
}

const widthMap: Record<string, string> = {
  narrow: "max-w-2xl",
  medium: "max-w-4xl",
  wide: "max-w-6xl",
  full: "max-w-none",
};

export function CopyBlock({ data }: CopyBlockProps) {
  const { body, width = "medium", textAlignment = "left" } = data;

  const alignClass = textAlignment === "center" ? "text-center" : "text-left";

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className={`mx-auto ${widthMap[width]} ${alignClass}`}>
        <PortableText value={body} />
      </div>
    </section>
  );
}
