import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X, ArrowRight } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { BrandLogo } from "./BrandLogo";

const LINKS = [
  { key: "products", href: "#products" },
  { key: "applications", href: "#applications" },
  { key: "whyUs", href: "#why" },
  { key: "reach", href: "#reach" },
  { key: "contact", href: "#contact" },
] as const;

export function Nav() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  // Close the mobile menu on Escape and lock scroll while it's open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a
          href="#top"
          className="flex items-center rounded-2xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={t("brand.name")}
        >
          <BrandLogo />
        </a>

        {/* Desktop nav */}
        <nav
          aria-label={t("nav.primary")}
          className="hidden items-center gap-8 text-sm font-medium md:flex"
        >
          {LINKS.map((l) => (
            <a key={l.key} href={l.href} className="transition hover:text-foreground/70">
              {t(`nav.${l.key}`)}
            </a>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <a
            href="#contact"
            className="hidden items-center gap-1.5 rounded-full bg-foreground px-4 py-2.5 text-xs font-semibold text-background transition hover:opacity-90 sm:inline-flex"
          >
            {t("nav.getQuote")}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card/70 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t border-border/60 bg-background/95 backdrop-blur-lg md:hidden"
        >
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4 text-sm font-medium">
            {LINKS.map((l) => (
              <a
                key={l.key}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 transition hover:bg-muted"
              >
                {t(`nav.${l.key}`)}
              </a>
            ))}
            <div className="mt-3 flex items-center justify-between gap-3">
              <LanguageSwitcher />
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2.5 text-xs font-semibold text-background"
              >
                {t("nav.getQuote")}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
