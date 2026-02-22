import type { PageBuilderComponent } from "@/lib/sanity/types";
import { Hero } from "./Hero";
import { CopyBlock } from "./CopyBlock";
import { MediaEmbed } from "./MediaEmbed";
import { TwoUp } from "./TwoUp";
import { Gallery } from "./Gallery";
import { ConferenceCards } from "./ConferenceCards";
import { ConferenceInfoBlock } from "./ConferenceInfoBlock";
import { ContactList } from "./ContactList";
import { ParticipantDirectory } from "./ParticipantDirectory";
import { FormSection } from "./FormSection";
import { NewsletterSignup } from "./NewsletterSignup";

interface PageBuilderProps {
  components: PageBuilderComponent[] | undefined | null;
}

/**
 * Renders an array of page builder components.
 * All 11 component types are fully implemented.
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
      return <ConferenceCards data={component} />;
    case "conferenceInfoBlock":
      return <ConferenceInfoBlock data={component} />;
    case "contactList":
      return <ContactList data={component} />;
    case "participantDirectory":
      return <ParticipantDirectory data={component} />;
    case "formSection":
      return <FormSection data={component} />;
    case "newsletterSignup":
      return <NewsletterSignup data={component} />;
    default: {
      const _exhaustiveCheck: never = component;
      console.warn(`Unknown component type: ${(_exhaustiveCheck as PageBuilderComponent)._type}`);
      return null;
    }
  }
}
