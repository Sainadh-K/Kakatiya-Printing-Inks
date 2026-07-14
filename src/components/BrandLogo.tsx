import { useId, useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

/**
 * Kakatiya logo mark — Option A: an ink droplet whose lower half resolves into three
 * overlapping CMYK dots (colour separation → "printing"), on a rainbow tile that keeps
 * the site's "full spectrum of colour" spirit. Fully self-contained inline SVG.
 *
 * Colours reuse the theme's own ink tokens (see src/index.css --ink-*): the tile is the
 * 8-shade rainbow; the dots use theme cyan / magenta / yellow, multiplied so their
 * overlaps yield the CMY secondaries and a near-black centre (K). No new palette.
 */
export function LogoMark({ className }: Readonly<{ className?: string }>) {
  // Unique per instance so the mark can appear more than once (nav + footer) without id clashes.
  const uid = useId().replace(/:/g, "");
  const grad = `kk-grad-${uid}`;
  const clip = `kk-clip-${uid}`;
  const drop =
    "M24 6 C 30 15.5 34.5 20 34.5 26.5 A 10.5 10.5 0 1 1 13.5 26.5 C 13.5 20 18 15.5 24 6 Z";

  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f51d31" />
          <stop offset="0.16" stopColor="#fb7c00" />
          <stop offset="0.32" stopColor="#f1cb1c" />
          <stop offset="0.48" stopColor="#33b544" />
          <stop offset="0.63" stopColor="#00bbd5" />
          <stop offset="0.78" stopColor="#0766ee" />
          <stop offset="0.9" stopColor="#7d24d3" />
          <stop offset="1" stopColor="#dd00b1" />
        </linearGradient>
        <clipPath id={clip}>
          <path d={drop} />
        </clipPath>
      </defs>

      {/* Rainbow tile */}
      <rect x="0" y="0" width="48" height="48" rx="12" fill={`url(#${grad})`} />

      {/* Ink droplet */}
      <path d={drop} fill="#ffffff" fillOpacity="0.96" />

      {/* CMYK separation dots in the lower half — multiplied so overlaps darken toward K */}
      <g clipPath={`url(#${clip})`} style={{ mixBlendMode: "multiply" }}>
        <circle cx="20.6" cy="25.8" r="4.9" fill="#00bbd5" />
        <circle cx="27.4" cy="25.8" r="4.9" fill="#dd00b1" />
        <circle cx="24" cy="31" r="4.9" fill="#f1cb1c" />
      </g>
    </svg>
  );
}

/**
 * Full brand lockup: mark + wordmark.
 *
 * The wordmark is localized (brand.line1/line2 translate to Telugu/Devanagari). The
 * display font (`font-brand`, Sora) covers Latin; for te/hi the CSS stack falls back to
 * Noto Sans Telugu / Devanagari (see --brand-font in src/index.css) so glyphs render
 * cleanly with no layout shift.
 */
export function BrandLogo({ markClassName }: Readonly<{ markClassName?: string }>) {
  const { t, i18n } = useTranslation();
  const kRef = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLSpanElement>(null);

  /*
   * Track "Printing Inks" so it spans exactly the width of "Kakatiya" with the extra
   * space distributed EVENLY across every character (uniform letter-spacing), not dumped
   * into the word gap. This can't be done reliably in pure CSS (Safari ignores
   * text-justify: inter-character), so we measure and compute the spacing.
   * Re-runs on language change, on resize/breakpoint (ResizeObserver), and once webfonts
   * load — so it holds on mobile and across en/te/hi.
   */
  useLayoutEffect(() => {
    const kEl = kRef.current;
    const subEl = subRef.current;
    if (!kEl || !subEl) return;

    const textWidth = (el: HTMLElement) => {
      // Actual rendered glyph-run width (incl. the final "a"), independent of the
      // element's flex-stretched box or padding.
      const range = document.createRange();
      range.selectNodeContents(el);
      return range.getBoundingClientRect().width;
    };

    const fit = () => {
      subEl.style.width = "auto";
      subEl.style.letterSpacing = "0px";
      const natural = textWidth(subEl);
      const target = textWidth(kEl);
      const gaps = Math.max((subEl.textContent ?? "").length - 1, 1);
      let ls = (target - natural) / gaps;
      if (!Number.isFinite(ls) || ls < 0) ls = 0;
      subEl.style.letterSpacing = `${ls}px`;
      subEl.style.width = `${target}px`;
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(kEl);
    window.addEventListener("resize", fit);
    if (document.fonts) document.fonts.ready.then(fit).catch(() => {});

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [i18n.language]);

  return (
    <span className="flex items-center gap-3">
      <LogoMark className={markClassName ?? "h-12 w-12 md:h-14 md:w-14"} />
      <span className="flex flex-col leading-none">
        {/* Wordmark in solid jet black (was multi-colour). pb keeps the vertical
            rhythm identical so the sub-line alignment below is undisturbed. */}
        <span
          ref={kRef}
          className="font-brand text-2xl font-extrabold leading-[1.1] tracking-tight text-black md:text-[27px] pb-[0.22em]"
        >
          {t("brand.line1")}
        </span>
        {/* Small-caps label, evenly tracked to Kakatiya's width by the effect above.
            The tracking-[0.18em] is a pre-measure fallback; JS then sets exact spacing. */}
        <span
          ref={subRef}
          className="mt-1 block whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
        >
          {t("brand.line2")}
        </span>
      </span>
    </span>
  );
}
