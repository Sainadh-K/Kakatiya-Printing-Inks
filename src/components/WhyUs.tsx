import { useTranslation } from "react-i18next";
import { Leaf, FlaskConical, Truck, type LucideIcon } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const drumsImg = "/assets/ink-drums.jpg";

const CARDS: { icon: LucideIcon; color: string; titleKey: string; bodyKey: string }[] = [
  { icon: Leaf, color: "bg-ink-green", titleKey: "why.cards.ecoTitle", bodyKey: "why.cards.ecoBody" },
  { icon: FlaskConical, color: "bg-ink-blue", titleKey: "why.cards.batchTitle", bodyKey: "why.cards.batchBody" },
  { icon: Truck, color: "bg-ink-magenta", titleKey: "why.cards.dispatchTitle", bodyKey: "why.cards.dispatchBody" },
];

export function WhyUs() {
  const { t } = useTranslation();

  return (
    <section id="why" className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <SectionHeading
            eyebrow={t("why.eyebrow")}
            titlePre={t("why.titlePre")}
            titleHighlight={t("why.titleHighlight")}
            body={t("why.subtitle")}
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-3xl border border-border/60 shadow-2xl">
            <div
              className="absolute -inset-4 -z-10 rounded-3xl rainbow-bar opacity-40 blur-2xl"
              aria-hidden="true"
            />
            <img
              src={drumsImg}
              alt={t("why.imageAlt")}
              width={1200}
              height={900}
              className="h-[360px] w-full object-cover md:h-[440px]"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>

      <ul className="mt-16 grid list-none gap-6 md:grid-cols-3">
        {CARDS.map(({ icon: Icon, color, titleKey, bodyKey }, i) => (
          <Reveal as="li" key={titleKey} delay={i * 0.08}>
            <article className="relative h-full overflow-hidden rounded-3xl border border-border/60 bg-card p-8 transition hover:-translate-y-1 hover:shadow-xl">
              <div className="rainbow-bar absolute inset-x-0 top-0 h-1" aria-hidden="true" />
              <span
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${color} text-white shadow-lg`}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-6 font-display text-xl font-semibold">{t(titleKey)}</h3>
              <p className="mt-2 text-muted-foreground">{t(bodyKey)}</p>
            </article>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
