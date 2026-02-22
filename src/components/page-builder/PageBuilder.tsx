import type { PageBuilderComponent } from "@/lib/sanity/types";
import { Hero } from "./Hero";
import { CopyBlock } from "./CopyBlock";
import { MediaEmbed } from "./MediaEmbed";
import { TwoUp } from "./TwoUp";
import { Gallery } from "./Gallery";

interface PageBuilderProps {
  components: PageBuilderComponent[] | undefined | null;
}

/**
 * Renders an array of page builder components.
 * Each component type maps to a React component.
 *
 * Core components (Hero, CopyBlock, MediaEmbed, TwoUp, Gallery) are
 * fully implemented. Conference, data, and interactive components
 * render as stubs until Epic 4 and 6.
 */
export function PageBuilder({ components }: PageBuilderProps) {
  if (!components || components.length === 0) {
    return null;
  }

  return (
    <div>
      {components.map((component) => (
        <PageBuilderBlock key={component._key} component={component} />
      ))}
    </div>
  );
}

function PageBuilderBlock({ component }: { component: PageBuilderComponent }) {
  switch (component._type) {
    case "hero":
      return <Hero data={component} />;
    case "copyBlock":
      return <CopyBlock data={component} />;
    case "mediaEmbed":
      return <MediaEmbed data={component} />;
    case "twoUp":
      return <TwoUp data={component} />;
    case "gallery":
      return <Gallery data={component} />;
    case "conferenceCards":
      return <ComponentStub type="Conference Cards" data={component} />;
    case "conferenceInfoBlock":
      return <ComponentStub type="Conference Info Block" data={component} />;
    case "contactList":
      return <ComponentStub type="Contact List" data={component} />;
    case "participantDirectory":
      return <ComponentStub type="Participant Directory" data={component} />;
    case "formSection":
      return <ComponentStub type="Form Section" data={component} />;
    case "newsletterSignup":
      return <ComponentStub type="Newsletter Signup" data={component} />;
    default: {
      const _exhaustiveCheck: never = component;
      console.warn(`Unknown component type: ${(_exhaustiveCheck as PageBuilderComponent)._type}`);
      return null;
    }
  }
}

/**
 * Temporary stub for components not yet implemented.
 */
function ComponentStub({
  type,
  data,
}: {
  type: string;
  data: PageBuilderComponent;
}) {
  return (
    <section className="border-b border-dashed border-zinc-300 bg-zinc-50 px-4 py-12 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-zinc-400">
        {type}
      </p>
      <p className="mt-1 text-xs text-zinc-300">{data._key}</p>
    </section>
  );
}
