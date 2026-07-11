import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "../i18n";

const SHORT_LABELS: Record<SupportedLanguage, string> = {
  en: "EN",
  te: "తెలుగు",
  hi: "हिंदी",
};

interface LanguageSwitcherProps {
  className?: string;
}

/**
 * Segmented EN / తెలుగు / हिंदी control. Keyboard-navigable, announces state via
 * aria-pressed, and persists the choice through i18next's localStorage detector.
 */
export function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const current = (i18n.language?.split("-")[0] ?? "en") as SupportedLanguage;

  return (
    <div
      role="group"
      aria-label={t("language.label")}
      className={`inline-flex items-center rounded-full border border-border bg-card/70 p-0.5 backdrop-blur ${className}`}
    >
      {SUPPORTED_LANGUAGES.map((lng) => {
        const active = current === lng;
        return (
          <button
            key={lng}
            type="button"
            lang={lng}
            onClick={() => i18n.changeLanguage(lng)}
            aria-pressed={active}
            aria-label={t(`language.${lng}`)}
            className={`min-h-[36px] rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              active
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {SHORT_LABELS[lng]}
          </button>
        );
      })}
    </div>
  );
}
