import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

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

      {/* Single PAN-India statement (individual state list removed) */}
      <Reveal delay={0.1}>
        <div className="mt-10 flex flex-col items-center gap-5 rounded-3xl border border-border/60 bg-card px-8 py-12 text-center sm:flex-row sm:justify-center sm:gap-6 sm:text-left">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl rainbow-bar text-white shadow-md">
            <Globe className="h-8 w-8 drop-shadow" aria-hidden="true" />
          </span>
          <div>
            <div className="font-display text-3xl font-bold md:text-4xl">
              {t("distribution.panIndia")}
            </div>
            <p className="mt-1 max-w-md text-muted-foreground">
              {t("distribution.panIndiaNote")}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
