/**
 * SINGLE SOURCE OF TRUTH for the eight rainbow shades.
 * The shade explorer, quote-builder, marquee and PDF shade card all read from here.
 *
 * - `id`   stable key; also the i18n name key (`shades.<id>`) for localized display.
 * - `name` canonical ENGLISH name — used where localization isn't available
 *          (the English-only PDF). Localized UI uses `t('shades.<id>')`.
 * - `cls`  Tailwind bg utility backed by the `--ink-*` oklch theme token (on-screen swatches).
 * - `hex`  the sRGB hex of that exact `--ink-*` oklch token (see src/index.css). These are
 *          NOT new colours — they are the theme's own values converted to hex for contexts
 *          that need a concrete colour (the PDF, exact-hex swatch blocks). Vivid shades that
 *          fall outside sRGB are gamut-mapped, exactly as the browser maps the oklch swatch.
 * - `spec` per-shade specification — PLACEHOLDER only (see below).
 */

export type ShadeId =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "cyan"
  | "blue"
  | "violet"
  | "magenta"
  | "black";

export interface ShadeSpec {
  finish: string;
  opacity: string;
  /** Boards / substrates the shade suits. */
  substrate: string;
  dryingNote: string;
  foodSafeNote: string;
  pantoneRef: string;
}

export interface Shade {
  id: ShadeId;
  name: string;
  cls: string;
  hex: string;
  spec: ShadeSpec;
}

/**
 * ⚠️ PLACEHOLDER SPECS — the client has NOT supplied real ink data yet.
 * A wrong spec on an ink product is a genuine liability, so nothing here is invented:
 * every field reads "To be confirmed" until verified. When real data arrives, replace
 * these per shade below (each shade carries its own copy so specs can differ).
 * TODO: confirm all six fields with the client before launch.
 */
const PLACEHOLDER_SPEC: ShadeSpec = {
  finish: "To be confirmed", // TODO: confirm with client
  opacity: "To be confirmed", // TODO: confirm with client
  substrate: "To be confirmed", // TODO: confirm with client (suitable boards)
  dryingNote: "To be confirmed", // TODO: confirm with client — do NOT invent drying times
  foodSafeNote: "To be confirmed", // TODO: confirm with client
  pantoneRef: "To be confirmed", // TODO: confirm with client — do NOT invent Pantone codes
};

// VIBGYOR rainbow order, with Jet Black last. Every consumer (marquee, product
// cards, enquiry-form shade chips, PDF) reads from this one array, so reordering
// here cascades everywhere.
// TODO: confirm with client whether Jet Black should sit FIRST or LAST — for now
// it is LAST after the rainbow. To put it first, move the "black" row to the top.
export const shades: Shade[] = [
  { id: "red", name: "Signal Red", cls: "bg-ink-red", hex: "#f51d31", spec: { ...PLACEHOLDER_SPEC } },
  { id: "orange", name: "Solar Orange", cls: "bg-ink-orange", hex: "#fb7c00", spec: { ...PLACEHOLDER_SPEC } },
  { id: "yellow", name: "Lemon Yellow", cls: "bg-ink-yellow", hex: "#f1cb1c", spec: { ...PLACEHOLDER_SPEC } },
  { id: "green", name: "Forest Green", cls: "bg-ink-green", hex: "#33b544", spec: { ...PLACEHOLDER_SPEC } },
  { id: "cyan", name: "Cyan Sky", cls: "bg-ink-cyan", hex: "#00bbd5", spec: { ...PLACEHOLDER_SPEC } },
  { id: "blue", name: "Cobalt Blue", cls: "bg-ink-blue", hex: "#0766ee", spec: { ...PLACEHOLDER_SPEC } },
  { id: "violet", name: "Deep Violet", cls: "bg-ink-violet", hex: "#7d24d3", spec: { ...PLACEHOLDER_SPEC } },
  { id: "magenta", name: "Magenta Rose", cls: "bg-ink-magenta", hex: "#dd00b1", spec: { ...PLACEHOLDER_SPEC } },
  { id: "black", name: "Jet Black", cls: "bg-ink-black", hex: "#161616", spec: { ...PLACEHOLDER_SPEC } },
];

/** Ordered spec fields, so UI and PDF render the spec list consistently. */
export const SPEC_FIELDS: (keyof ShadeSpec)[] = [
  "finish",
  "opacity",
  "substrate",
  "dryingNote",
  "foodSafeNote",
  "pantoneRef",
];
