import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Palette } from "lucide-react";
import { LogoMark } from "./BrandLogo";

// Served from /public. Referenced by URL (not imported) so Vite copies it as-is.
const heroImg = "/assets/hero-inks.jpg";

export function Hero() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  const stats = [
    { value: t("hero.stats.yearsValue"), label: t("hero.stats.yearsLabel") },
    { value: t("hero.stats.convertersValue"), label: t("hero.stats.convertersLabel") },
    { value: t("hero.stats.statesValue"), label: t("hero.stats.statesLabel") },
  ];

  return (
    <section id="top" className="relative overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 -z-10 soft-rainbow-bg" aria-hidden="true" />
      <div
        className="absolute -top-40 -right-40 -z-10 h-[500px] w-[500px] rounded-full rainbow-bar opacity-40 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:py-28 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        {/* Copy */}
        <div>
          <motion.div
            {...rise(0)}
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs font-medium backdrop-blur"
          >
            <span className="h-2 w-2 rounded-full bg-ink-green" aria-hidden="true" />
            {t("hero.eyebrow")}
          </motion.div>

          <motion.h1
            {...rise(0.08)}
            className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl"
          >
            {t("hero.headlinePre")}
            <span className="rainbow-text">{t("hero.headlineHighlight")}</span>
            <br />
            {t("hero.headlineMid")}
            <span className="italic font-normal text-muted-foreground">
              {t("hero.headlineEmphasis")}
            </span>
          </motion.h1>

          <motion.p {...rise(0.16)} className="mt-6 max-w-xl text-lg text-muted-foreground">
            {t("hero.body")}
          </motion.p>

          <motion.div {...rise(0.24)} className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-lg transition hover:-translate-y-0.5"
            >
              {t("hero.ctaSample")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#products"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-6 py-3 text-sm font-semibold backdrop-blur transition hover:bg-card"
            >
              <Palette className="h-4 w-4" aria-hidden="true" />
              {t("hero.ctaPalette")}
            </a>
          </motion.div>

          <motion.dl
            {...rise(0.32)}
            className="mt-12 grid grid-cols-3 gap-6 border-t border-border/60 pt-6"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <dd className="font-display text-3xl font-bold md:text-4xl">{s.value}</dd>
                <dt className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </dt>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Image */}
        <motion.div {...rise(0.2)} className="relative order-first lg:order-none">
          <div
            className="absolute -inset-4 rounded-3xl rainbow-bar opacity-70 blur-2xl"
            aria-hidden="true"
          />
          <div className="relative overflow-hidden rounded-3xl border border-border/60 shadow-2xl">
            <img
              src={heroImg}
              alt={t("hero.imageAlt")}
              width={1600}
              height={1200}
              className="h-[420px] w-full object-cover md:h-[520px]"
              loading="eager"
              fetchPriority="high"
            />
          </div>

          {/* Floating "custom shade" card — uses the logo droplet motif */}
          <div className="absolute -bottom-6 -left-6 hidden items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-xl md:flex animate-float-slow">
            <LogoMark className="h-11 w-11" />
            <span>
              <span className="block text-xs text-muted-foreground">{t("hero.tagTop")}</span>
              <span className="block font-semibold">{t("hero.tagBottom")}</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
