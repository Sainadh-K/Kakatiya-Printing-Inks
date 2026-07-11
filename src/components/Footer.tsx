import { useTranslation } from "react-i18next";
import { LogoMark } from "./BrandLogo";
import { siteConfig, addressOneLine } from "../lib/site";

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="rainbow-bar h-1 w-full" aria-hidden="true" />
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-start">
        <div className="flex items-start gap-3">
          <LogoMark className="h-11 w-11 shrink-0" />
          <div className="text-xs text-muted-foreground">
            <div className="font-brand text-lg font-extrabold tracking-tight text-foreground">
              {t("brand.name")}
            </div>
            <div className="mt-0.5">{t("footer.tagline")}</div>
            <address className="mt-2 max-w-xs not-italic leading-relaxed">
              {addressOneLine}
            </address>
            <div className="mt-1">
              {t("contact.gstLabel")}: {siteConfig.gstin}
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{t("footer.copyright", { year })}</p>
      </div>
    </footer>
  );
}
