import { useTranslation } from "react-i18next";
import { Package, Printer, ShoppingBag, Palette, type LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";

const corrugatedImg = "/assets/corrugated-boxes.jpg";

const ITEMS: { icon: LucideIcon; titleKey: string; bodyKey: string }[] = [
  { icon: Package, titleKey: "corrugated.items.cartonsTitle", bodyKey: "corrugated.items.cartonsBody" },
  { icon: Printer, titleKey: "corrugated.items.flexoTitle", bodyKey: "corrugated.items.flexoBody" },
  { icon: ShoppingBag, titleKey: "corrugated.items.bagsTitle", bodyKey: "corrugated.items.bagsBody" },
  { icon: Palette, titleKey: "corrugated.items.shadeTitle", bodyKey: "corrugated.items.shadeBody" },
];

export function Corrugated() {
  const { t } = useTranslation();

  return (
    <section id="applications" className="relative overflow-hidden bg-foreground text-background">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, oklch(1 0 0 / 0.35), transparent 55%)",
        }}
        aria-hidden="true"
      />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-2 lg:items-center">
        {/* Image */}
        <Reveal className="relative order-2 lg:order-1">
          <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <img
              src={corrugatedImg}
              alt={t("corrugated.imageAlt")}
              width={1200}
              height={900}
              className="h-[380px] w-full object-cover md:h-[460px]"
              loading="lazy"
            />
          </div>
        </Reveal>

        {/* Copy */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.25em] text-white/60">
              {t("corrugated.eyebrow")}
            </div>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
              {t("corrugated.titleLine1")}
              <br />
              {t("corrugated.titleLine2")}
            </h2>
            <p className="mt-5 max-w-lg text-white/70">{t("corrugated.body")}</p>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {ITEMS.map(({ icon: Icon, titleKey, bodyKey }, i) => (
              <Reveal key={titleKey} delay={(i % 2) * 0.08}>
                <div className="flex h-full gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl rainbow-bar">
                    <Icon className="h-5 w-5 text-white drop-shadow" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold">{t(titleKey)}</h3>
                    <p className="mt-1 text-sm text-white/60">{t(bodyKey)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
