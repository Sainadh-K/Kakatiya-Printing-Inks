import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { SPEC_FIELDS, type Shade } from "../../lib/shades";
import { handleHumanHandoff } from "../../lib/chat";
import { siteConfig } from "../../lib/site";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { WhatsAppIcon } from "../WhatsAppIcon";

// Sentinel from shades.ts: while a field is unconfirmed we show a localized
// "To be confirmed" instead of the English placeholder. When real specs land in
// shades.ts, they render through automatically.
const PLACEHOLDER_VALUE = "To be confirmed";

export function ShadeDetail({ shade, onClose }: { shade: Shade; onClose: () => void }) {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const dialogRef = useFocusTrap<HTMLDivElement>(onClose);

  const name = t(`shades.${shade.id}`);
  const titleId = `shade-${shade.id}-title`;

  const requestShade = () =>
    handleHumanHandoff(t("shadeExplorer.whatsappSeed", { shade: name }));

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? {} : { opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? {} : { opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("shadeExplorer.close")}
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-xl bg-card/70 text-muted-foreground backdrop-blur transition hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="overflow-y-auto overscroll-contain">
          {/* Large swatch in the shade's exact hex */}
          <div
            className="h-40 w-full sm:h-48"
            style={{ backgroundColor: shade.hex }}
            aria-hidden="true"
          />

          <div className="p-6">
            <h3 id={titleId} className="font-display text-2xl font-bold">
              {name}
            </h3>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("products.cardLabel")}
            </p>

            {/* Spec list */}
            <dl className="mt-6 divide-y divide-border/60 rounded-2xl border border-border/60">
              {SPEC_FIELDS.map((field) => {
                const raw = shade.spec[field];
                const value = raw === PLACEHOLDER_VALUE ? t("shadeExplorer.tbd") : raw;
                return (
                  <div
                    key={field}
                    className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  >
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t(`shadeExplorer.spec.${field}`)}
                    </dt>
                    <dd className="text-sm font-medium sm:text-right">{value}</dd>
                  </div>
                );
              })}
              {/* HSN code — a confirmed value (B2B credibility signal), not a TODO spec. */}
              <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("shadeExplorer.hsn")}
                </dt>
                <dd className="text-sm font-medium sm:text-right">{siteConfig.hsnCode}</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={requestShade}
              className="mt-6 inline-flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {t("shadeExplorer.requestCta")}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
