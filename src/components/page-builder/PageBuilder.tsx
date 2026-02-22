import type { PageBuilderComponent } from "@/lib/sanity/types";

interface PageBuilderProps {
  components: PageBuilderComponent[] | undefined | null;
}

/**
 * Renders an array of page builder components.
 * Each component type maps to a React component.
 *
 * Component implementations are stubbed here — full implementations
 * come in Epic 3 (core) and Epic 4 (conference & data).
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
      return <ComponentStub type="Hero" data={component} />;
    case "copyBlock":
      return <ComponentStub type="Copy Block" data={component} />;
    case "mediaEmbed":
      return <ComponentStub type="Media Embed" data={component} />;
    case "twoUp":
      return <ComponentStub type="Two-Up" data={component} />;
    case "gallery":
      return <ComponentStub type="Gallery" data={component} />;
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
 * Temporary stub component that renders a placeholder
 * until the real component implementations are built.
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
