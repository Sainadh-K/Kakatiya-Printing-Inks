import { useTranslation } from "react-i18next";
import { Building2 } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

/**
 * "Our Clients" credibility strip.
 *
 * Config-driven so it's easy to populate later. Each entry may carry a `logo`
 * (path under /public) once the client supplies logo files; until then the name
 * renders as text.
 *
 * TODO: client to supply the full list of client names (and logo image files).
 *   Do NOT invent client names.
 * Harika Package Pvt Ltd is a real client from the client's records.
 *   confirm with the client that his name may be shown publicly before publishing.
 */
interface Client {
  name: string;
  logo?: string;
}

const CLIENTS: Client[] = [
  { name: "Harika Package Pvt Ltd" },
  // TODO: add more confirmed clients here, e.g. { name: "...", logo: "/assets/clients/xyz.png" }
];

// Empty slots so the grid visibly reads as "ready for more" during preview.
const PLACEHOLDER_SLOTS = 3;

export function OurClients() {
  const { t } = useTranslation();

  return (
    <section id="clients" className="mx-auto max-w-7xl px-6 py-24">
      <Reveal>
        <SectionHeading
          centered
          eyebrow={t("ourClients.eyebrow")}
          titlePre={t("ourClients.titlePre")}
          titleHighlight={t("ourClients.titleHighlight")}
          body={t("ourClients.body")}
        />
      </Reveal>

      <ul className="mx-auto mt-12 grid max-w-4xl list-none grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {CLIENTS.map((client, i) => (
          <Reveal as="li" key={client.name} delay={(i % 4) * 0.05}>
            <div className="flex h-full min-h-[92px] items-center justify-center rounded-2xl border border-border/60 bg-card p-4 text-center shadow-sm">
              {client.logo ? (
                <img src={client.logo} alt={client.name} className="max-h-12 w-auto" loading="lazy" />
              ) : (
                <span className="text-sm font-semibold text-foreground">{client.name}</span>
              )}
            </div>
          </Reveal>
        ))}

        {Array.from({ length: PLACEHOLDER_SLOTS }).map((_, i) => (
          <Reveal as="li" key={`slot-${i}`} delay={((CLIENTS.length + i) % 4) * 0.05}>
            <div className="flex h-full min-h-[92px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-border bg-background/40 p-4 text-center">
              <Building2 className="h-5 w-5 text-muted-foreground/60" aria-hidden="true" />
              <span className="text-xs text-muted-foreground/70">{t("ourClients.placeholder")}</span>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
