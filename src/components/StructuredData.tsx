import { siteConfig, streetAddress } from "../lib/site";

/**
 * LocalBusiness JSON-LD, built from the single source of truth in site.ts so the
 * SEO schema never drifts from the displayed details. Rendered inline; JSON-LD is
 * valid anywhere in the document and is read by search crawlers.
 *
 * Note: `url` is intentionally omitted until a production domain is wired up.
 */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.businessName,
    description:
      "Hyderabad-based distributor of water based flexographic printing inks for corrugated boxes and packaging converters across India.",
    telephone: `+${siteConfig.phoneHref}`,
    email: siteConfig.email,
    taxID: siteConfig.gstin,
    vatID: siteConfig.gstin,
    address: {
      "@type": "PostalAddress",
      streetAddress,
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.countryCode,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      name: siteConfig.contactPerson,
      telephone: `+${siteConfig.phoneHref}`,
      email: siteConfig.email,
    },
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inline (no user input).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
