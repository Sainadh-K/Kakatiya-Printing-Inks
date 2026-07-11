import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { User, Phone, Mail, MapPin, ReceiptText, type LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { QuoteForm } from "./contact/QuoteForm";
import { siteConfig, buildWhatsAppUrl, addressLines } from "../lib/site";

interface DetailRow {
  icon: LucideIcon;
  color: string;
  label: string;
  value: ReactNode;
  href?: string;
}

export function Contact() {
  const { t } = useTranslation();

  const details: DetailRow[] = [
    {
      icon: User,
      color: "bg-ink-orange",
      label: t("contact.contactPersonLabel"),
      value: siteConfig.contactPerson,
    },
    {
      icon: Phone,
      color: "bg-ink-blue",
      label: t("contact.callLabel"),
      value: siteConfig.phoneDisplay,
      href: `tel:+${siteConfig.phoneHref}`,
    },
    {
      icon: Mail,
      color: "bg-ink-green",
      label: t("contact.emailLabel"),
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
    },
    {
      icon: MapPin,
      color: "bg-ink-magenta",
      label: t("contact.visitLabel"),
      value: (
        <>
          {addressLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </>
      ),
    },
    {
      icon: ReceiptText,
      color: "bg-ink-violet",
      label: t("contact.gstLabel"),
      value: siteConfig.gstin,
    },
  ];

  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-24">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-border/60 bg-card p-8 shadow-xl md:p-16">
        <div className="rainbow-bar absolute inset-x-0 top-0 h-1.5" aria-hidden="true" />
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left: heading + details */}
          <div>
            <Reveal>
              <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                {t("contact.eyebrow")}
              </div>
              <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
                {t("contact.titlePre")}
                <span className="rainbow-text">{t("contact.titleHighlight")}</span>
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">{t("contact.body")}</p>
            </Reveal>

            <div className="mt-8 space-y-4">
              {details.map(({ icon: Icon, color, label, value, href }) => {
                const inner = (
                  <>
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color} text-white`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                        {label}
                      </span>
                      <span className="block font-semibold break-words">{value}</span>
                    </span>
                  </>
                );
                const cls =
                  "flex items-start gap-4 rounded-2xl border border-border/60 bg-background/60 p-4 backdrop-blur transition hover:-translate-y-0.5";
                return href ? (
                  <a key={label} href={href} className={cls}>
                    {inner}
                  </a>
                ) : (
                  <div key={label} className={cls}>
                    {inner}
                  </div>
                );
              })}

              {/* WhatsApp click-to-chat */}
              <a
                href={buildWhatsAppUrl(t("chat.whatsapp.generic"))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-border/60 bg-background/60 p-4 backdrop-blur transition hover:-translate-y-0.5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white">
                  <WhatsAppIcon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                    WhatsApp
                  </span>
                  <span className="block font-semibold">{t("contact.whatsapp")}</span>
                </span>
              </a>
            </div>
          </div>

          {/* Right: structured quote-builder */}
          <Reveal delay={0.1}>
            <QuoteForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
