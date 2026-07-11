/**
 * Central site configuration — the SINGLE SOURCE OF TRUTH for the client's confirmed
 * business details. Defined once here and imported everywhere (contact section, footer,
 * PDF shade card, structured data / SEO schema, WhatsApp links).
 *
 * ⚠️ Do NOT add bank details (name / account no. / IFSC) or prices here or anywhere
 * else in the codebase — those are private / quote-only.
 */

// The ONE place the WhatsApp number lives — digits only, country code, no "+" or spaces.
// Used by buildWhatsAppUrl() → https://wa.me/917306999345?text=...
export const WHATSAPP_NUMBER = "917306999345";

export const siteConfig = {
  businessName: "Kakatiya Printing Inks",
  contactPerson: "Kopuri Venkateswara Rao",

  phoneDisplay: "+91 7306999345",
  phoneHref: "917306999345", // used as tel:+<phoneHref>

  email: "kvenkateswararao657@gmail.com",

  gstin: "36AUZPK5272H1ZY",
  hsnCode: "32151190", // printing-ink HSN code — shown as a B2B credibility signal

  // Postal address. Kept identical across languages (proper noun). Structured so both
  // the multi-line display and the SEO PostalAddress schema derive from one place.
  address: {
    lines: ["H.No 16-2-227/222, Plot #222, Flat #201", "Sardarpatel Nagar, KPHB"],
    locality: "Hyderabad",
    region: "Telangana",
    postalCode: "500085",
    country: "India",
    countryCode: "IN",
  },
} as const;

/** Street address on a single line (schema streetAddress). */
export const streetAddress = siteConfig.address.lines.join(", ");

/** Full address as ordered display lines (multi-line rendering). */
export const addressLines: string[] = [
  ...siteConfig.address.lines,
  `${siteConfig.address.locality}, ${siteConfig.address.region} - ${siteConfig.address.postalCode}`,
  siteConfig.address.country,
];

/** Full address on one line (compact contexts like the PDF). */
export const addressOneLine = addressLines.join(", ");

/** Build a wa.me click-to-chat URL with a pre-filled, url-encoded message. */
export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
