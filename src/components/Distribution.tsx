import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const STATE_KEYS = [
  "telangana",
  "andhra",
  "karnataka",
  "tamilnadu",
  "maharashtra",
  "odisha",
  "kerala",
  "chhattisgarh",
  "panIndia",
] as const;

export function Distribution() {
  const { t } = useTranslation();

  return (
    <section id="reach" className="mx-auto max-w-7xl px-6 py-24">
      <Reveal>
        <SectionHeading
          eyebrow={t("distribution.eyebrow")}
          titlePre={t("distribution.titlePre")}
          titleHighlight={t("distribution.titleHighlight")}
          body={t("distribution.body")}
        />
      </Reveal>

      <ul className="mt-10 grid list-none grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
        {STATE_KEYS.map((key, i) => (
          <Reveal as="li" key={key} delay={(i % 3) * 0.05}>
            <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-md">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              {t(`distribution.states.${key}`)}
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
