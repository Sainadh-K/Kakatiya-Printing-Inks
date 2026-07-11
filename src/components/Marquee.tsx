import { useTranslation } from "react-i18next";
import { shades } from "../lib/shades";

export function Marquee() {
  const { t } = useTranslation();

  // Two identical sets so the -50% translate loops seamlessly.
  const items = [...shades, ...shades];

  return (
    // Decorative: the same shade names are announced semantically in the Products
    // section, so we hide the looping duplicate from assistive tech.
    <div
      className="group overflow-hidden border-y border-border/60 bg-card/50 py-4 backdrop-blur"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee gap-10 pr-10 group-hover:[animation-play-state:paused]">
        {items.map((shade, i) => (
          <div
            key={`${shade.id}-${i}`}
            className="flex items-center gap-3 whitespace-nowrap"
          >
            <span
              className={`h-4 w-4 rounded-full ${shade.cls} ring-2 ring-background`}
            />
            <span className="text-sm font-medium tracking-wide">
              {t(`shades.${shade.id}`)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
