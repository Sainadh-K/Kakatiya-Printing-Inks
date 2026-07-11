import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import { ArrowUpRight, Download } from "lucide-react";
import { shades, type Shade } from "../lib/shades";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { ShadeDetail } from "./products/ShadeDetail";

export function Products() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<Shade | null>(null);

  // Lazy-load jsPDF only when the user actually downloads, so it stays out of the
  // initial bundle.
  const downloadShadeCard = async () => {
    const { generateShadeCardPdf } = await import("../lib/shadeCardPdf");
    generateShadeCardPdf();
  };

  return (
    <section id="products" className="mx-auto max-w-7xl px-6 py-24">
      <Reveal>
        <SectionHeading
          centered
          eyebrow={t("products.eyebrow")}
          titlePre={t("products.titlePre")}
          titleHighlight={t("products.titleHighlight")}
          body={t("products.body")}
        />
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={downloadShadeCard}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {t("products.downloadPdf")}
          </button>
        </div>
      </Reveal>

      <ul className="mt-12 grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {shades.map((shade, i) => (
          <Reveal as="li" key={shade.id} delay={(i % 4) * 0.06}>
            <button
              type="button"
              onClick={() => setSelected(shade)}
              aria-label={t("shadeExplorer.viewDetails", { shade: t(`shades.${shade.id}`) })}
              className="group relative block h-full w-full overflow-hidden rounded-3xl border border-border/60 bg-card p-6 text-left transition hover:-translate-y-1 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div
                className={`absolute -right-10 -top-10 h-32 w-32 rounded-full ${shade.cls} opacity-20 blur-2xl`}
                aria-hidden="true"
              />
              <div className={`h-40 w-full rounded-2xl ${shade.cls} shadow-inner`} />
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold">
                    {t(`shades.${shade.id}`)}
                  </h3>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("products.cardLabel")}
                  </p>
                </div>
                <ArrowUpRight
                  className="h-4 w-4 opacity-0 transition group-hover:opacity-100"
                  aria-hidden="true"
                />
              </div>
            </button>
          </Reveal>
        ))}
      </ul>

      <AnimatePresence>
        {selected && (
          <ShadeDetail key={selected.id} shade={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
