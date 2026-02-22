import Image from "next/image";
import { urlFor } from "@/lib/sanity/client";
import type { ContactListComponent, Contact } from "@/lib/sanity/types";

interface ContactListProps {
  data: ContactListComponent;
}

const departmentLabels: Record<string, string> = {
  "retail-relations": "Retail Relations",
  marketing: "Marketing",
  "cannabis-guidelines": "Cannabis Guidelines",
  "exhibitor-sales": "Exhibitor Sales",
  onboarding: "Onboarding",
  operations: "Operations",
  general: "General",
};

export function ContactList({ data }: ContactListProps) {
  const { heading, conference, filterByDepartment, layout = "grid" } = data;

  // Get contacts from the conference reference
  const allContacts: Contact[] = conference?.contacts || [];

  // Filter by department if specified
  const contacts =
    filterByDepartment && filterByDepartment.length > 0
      ? allContacts.filter((c) => filterByDepartment.includes(c.department))
      : allContacts;

  if (contacts.length === 0) {
    return (
      <section className="px-4 py-12 text-center text-zinc-500 sm:px-6">
        {heading && (
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900">
            {heading}
          </h2>
        )}
        <p>No contacts available</p>
      </section>
    );
  }

  // Group contacts by department
  const grouped = contacts.reduce<Record<string, Contact[]>>((acc, contact) => {
    const dept = contact.department || "general";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(contact);
    return acc;
  }, {});

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {heading && (
          <h2 className="mb-8 text-3xl font-bold tracking-tight">{heading}</h2>
        )}

        <div className="space-y-10">
          {Object.entries(grouped).map(([department, deptContacts]) => (
            <div key={department}>
              <h3 className="mb-4 text-lg font-semibold text-zinc-700">
                {departmentLabels[department] || department}
              </h3>

              {layout === "grid" ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {deptContacts.map((contact) => (
                    <ContactCard key={contact._id} contact={contact} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {deptContacts.map((contact) => (
                    <ContactRow key={contact._id} contact={contact} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactCard({ contact }: { contact: Contact }) {
  return (
    <div className="flex gap-4 rounded-lg border border-zinc-200 p-4">
      {contact.image && (
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full">
          <Image
            src={urlFor(contact.image).width(112).height(112).url()}
            alt={contact.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
      )}
      <div>
        <p className="font-medium">{contact.name}</p>
        {contact.role && (
          <p className="text-sm text-zinc-500">{contact.role}</p>
        )}
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="mt-1 block text-sm text-orange-600 hover:text-orange-700"
          >
            {contact.email}
          </a>
        )}
        {contact.phone && (
          <a
            href={`tel:${contact.phone}`}
            className="block text-sm text-zinc-500"
          >
            {contact.phone}
          </a>
        )}
      </div>
    </div>
  );
}

function ContactRow({ contact }: { contact: Contact }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3">
      <div className="flex items-center gap-3">
        {contact.image && (
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
            <Image
              src={urlFor(contact.image).width(80).height(80).url()}
              alt={contact.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
        )}
        <div>
          <p className="font-medium">{contact.name}</p>
          {contact.role && (
            <p className="text-sm text-zinc-500">{contact.role}</p>
          )}
        </div>
      </div>
      <div className="text-right">
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="block text-sm text-orange-600 hover:text-orange-700"
          >
            {contact.email}
          </a>
        )}
        {contact.phone && (
          <a
            href={`tel:${contact.phone}`}
            className="block text-sm text-zinc-500"
          >
            {contact.phone}
          </a>
        )}
      </div>
    </div>
  );
}
