import { jsPDF } from "jspdf";
import { shades, SPEC_FIELDS, type ShadeSpec } from "./shades";
import { siteConfig, addressOneLine } from "./site";

/**
 * Client-side shade-card PDF.
 *
 * ⚠️ ENGLISH-ONLY (v1). jsPDF's built-in standard-14 fonts cover Latin only — they
 * render Telugu and Devanagari as blank boxes (tofu). Rather than ship broken glyphs
 * we generate this PDF in English regardless of the site's current language.
 * To localize later: embed a Unicode font (e.g. Noto Sans Telugu / Noto Sans
 * Devanagari) via `doc.addFont()` and swap the English strings below for i18n.
 * Deferred until the real specs are finalized.
 */

// English labels live here on purpose (see note above). Order matches SPEC_FIELDS.
const SPEC_LABELS: Record<keyof ShadeSpec, string> = {
  finish: "Finish",
  opacity: "Opacity",
  substrate: "Substrate",
  dryingNote: "Drying",
  foodSafeNote: "Food-safe",
  pantoneRef: "Pantone ref",
};

const BRAND = siteConfig.businessName;
const TAGLINE = "Water based colours · Hyderabad · India";
const CARD_LABEL = "Flexo · Water base";

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function generateShadeCardPdf(): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = 210;
  const margin = 15;
  const contentW = pageW - margin * 2;

  const ink: [number, number, number] = [24, 24, 27];
  const muted: [number, number, number] = [110, 110, 120];

  // ---- Header ----
  doc.setTextColor(...ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(BRAND, margin, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...muted);
  doc.text(TAGLINE, margin, 21.5);

  doc.setFontSize(8.5);
  doc.text([siteConfig.phoneDisplay, siteConfig.email].join("  ·  "), margin, 26);
  doc.setFontSize(8);
  doc.text(addressOneLine, margin, 30);
  doc.text(`GST: ${siteConfig.gstin}  ·  HSN: ${siteConfig.hsnCode}`, margin, 34);

  // Rainbow strip of the 8 shades
  const stripY = 38;
  const seg = contentW / shades.length;
  shades.forEach((s, i) => {
    doc.setFillColor(...hexToRgb(s.hex));
    doc.rect(margin + i * seg, stripY, seg, 3, "F");
  });

  // ---- Shade grid (2 columns; rows grow with the shade count) ----
  const colGap = 10;
  const colW = (contentW - colGap) / 2;
  const gridTop = 46;
  const cellH = 48;
  const swatchH = 14;

  shades.forEach((shade, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = margin + col * (colW + colGap);
    const y = gridTop + row * cellH;

    // Swatch
    doc.setFillColor(...hexToRgb(shade.hex));
    doc.roundedRect(x, y, colW, swatchH, 2, 2, "F");

    // Name + label
    doc.setTextColor(...ink);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(shade.name, x, y + swatchH + 5);

    doc.setTextColor(...muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(CARD_LABEL.toUpperCase(), x, y + swatchH + 9);

    // Specs (placeholders — see shades.ts)
    let sy = y + swatchH + 13;
    doc.setFontSize(7);
    SPEC_FIELDS.forEach((field) => {
      doc.setTextColor(...muted);
      doc.text(`${SPEC_LABELS[field]}:`, x, sy);
      doc.setTextColor(...ink);
      doc.text(shade.spec[field], x + 20, sy);
      sy += 3.3;
    });
  });

  // ---- Footer disclaimer (honest, not an invented spec) ----
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(...muted);
  doc.text(
    "Colours are indicative; printed output varies by substrate and press. Specifications to be confirmed.",
    margin,
    290,
  );

  doc.save("Kakatiya-Printing-Inks-Shade-Card.pdf");
}
