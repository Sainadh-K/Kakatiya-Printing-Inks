# Kakatiya Printing Inks — website

Marketing site for **Kakatiya Printing Inks**, a Hyderabad-based distributor of
water-based flexographic inks. This is a fresh, self-owned rebuild of the earlier
Lovable-generated site, matching its navigation, layout, colours, typography and
animations — plus **multi-language support (English / తెలుగు / हिंदी)**,
accessibility, and cross-browser/responsive hardening.

Built to deploy as a **static site**. It is **not deployed yet** — hosting and a
custom domain will be wired up after review.

---

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS v4 (oklch design tokens) |
| Animation | Framer Motion (scroll reveals) + CSS keyframes (marquee, float, rainbow) |
| Icons | lucide-react |
| i18n | react-i18next + browser language detector |

---

## Run locally

Requires **Node 18+** (developed on Node 24).

```bash
npm install      # install dependencies
npm run dev      # start dev server → http://localhost:5173
npm run build    # type-check + production build → dist/
npm run preview  # serve the production build locally → http://localhost:4173
npm run typecheck# type-check only, no emit
```

---

## Project structure

```
public/
  favicon.svg
  assets/                 # hero-inks.jpg, corrugated-boxes.jpg, ink-drums.jpg
src/
  main.tsx                # entry, mounts <App/> + loads i18n
  App.tsx                 # page composition + skip link
  index.css               # design tokens, gradients, keyframes, fonts (Tailwind v4)
  i18n/
    index.ts              # i18next config, persistence, <html lang> sync
    locales/en.json       # English (source of truth for copy)
    locales/te.json       # Telugu   — review with a native speaker before launch
    locales/hi.json       # Hindi    — review with a native speaker before launch
  lib/
    site.ts               # ⚠ contact/WhatsApp/GST placeholders (see below)
    shades.ts             # the 8 rainbow shades → colour tokens
  components/
    Nav, Hero, Marquee, Products, Corrugated, WhyUs, Distribution,
    Contact, Footer, LanguageSwitcher, WhatsAppButton, WhatsAppIcon,
    SectionHeading, Reveal
```

---

## Internationalization

**All UI text lives in `src/i18n/locales/*.json`** — there is no hard-coded copy
in components. Every string is keyed by section (e.g. `hero.headlinePre`,
`contact.form.submit`).

- **Default language:** English. On a visitor's first load the browser language
  is detected; their choice is then persisted in `localStorage` (`kpi-lang`).
- **Switcher:** the `EN / తెలుగు / हिंदी` control in the nav (and mobile menu).
- **Fonts:** Noto Sans Telugu and Noto Sans Devanagari are loaded and applied
  automatically per `<html lang>`, so Telugu/Hindi glyphs render cleanly with no
  layout shift when switching.

### Editing or adding a translation

1. **Edit copy:** change the value in the relevant `*.json` file. Keep the key
   structure identical across all three files.
2. **Add a language:**
   - Create `src/i18n/locales/<lang>.json` mirroring `en.json`'s keys.
   - Register it in `src/i18n/index.ts` (`resources`, `SUPPORTED_LANGUAGES`).
   - Add a short label in `LanguageSwitcher.tsx` (`SHORT_LABELS`).
   - If the script needs a specific webfont, add it in `index.html` and a
     `:lang(<lang>)` font rule in `index.css`.

> ⚠️ **Telugu & Hindi need a native-speaker review before launch.** Brand names
> and printing jargon (flexo, corrugated, viscosity, Pantone) are intentionally
> **transliterated** rather than translated, because they read more naturally to
> trade buyers that way. This is flagged in code comments in `src/i18n/index.ts`.

---

## In-page chat widget (WhatsApp-first)

The floating button (bottom-right) opens an **on-page chat panel** — it does **not**
navigate away. The conversation is canned (no backend): a greeting, a menu of
quick-reply topics, and a short answer per topic, with a "typing" pause for a
support-widget feel. WhatsApp is only reached via an explicit **"Chat with owner on
WhatsApp"** handoff.

**Files:**

| Concern | Location |
| --- | --- |
| Widget shell (launcher + panel, focus trap, Esc, scroll-lock) | `src/components/chat/ChatWidget.tsx`, `ChatPanel.tsx` |
| Conversation flow (state machine, typing, quick replies) | `src/hooks/useChat.ts` |
| Message model, topic list, **`handleHumanHandoff()`**, TODO markers | `src/lib/chat.ts` |
| All widget copy (greeting, menu, answers, WhatsApp text) | `chat.*` in `src/i18n/locales/*.json` |
| WhatsApp number | `WHATSAPP_NUMBER` in `src/lib/site.ts` |

### Editing the Q&A content

All widget strings live under the **`chat`** key in each locale file — greeting,
status line, the 8 menu labels (`chat.menu.*`), the 7 canned answers
(`chat.answers.*`), and the pre-filled WhatsApp text (`chat.whatsapp.*`). Edit the
value; keep keys identical across `en` / `te` / `hi`. Switching site language
switches the whole widget (it restarts the conversation in the new language). The
per-topic WhatsApp message is seeded from `chat.whatsapp.seed` with the topic name,
so a query about "Delivery areas & lead time" pre-fills that context.

> The MOQ, delivery lead-time and pricing answers avoid hard numbers on purpose —
> see the TODO block in `src/lib/chat.ts`. Add real figures only once confirmed.

### Adding live human chat later (the one seam)

The widget is built so a live-chat service (Tawk.to, Crisp, Intercom, …) can be
dropped in **without rewriting the UI**. Every "talk to a human" action routes
through a single function:

```ts
// src/lib/chat.ts
export function handleHumanHandoff(message: string): void {
  // Today: open WhatsApp (wa.me) in a new tab with a pre-filled message.
  // Later: replace THIS body with e.g. window.Tawk_API.maximize() — nothing else changes.
}
```

Messages are kept in a typed shape (`{ id, sender: 'bot' | 'user', text, timestamp }`)
that a real transport could feed directly into the same message list. No backend,
sockets, or presence system is included — this is frontend-only, WhatsApp-first.

---

## Shades, specs & product features

### The single source of truth: `src/lib/shades.ts`

All eight shades live in one typed array. Every feature (shade explorer,
quote-builder, marquee, PDF) reads from it — there is no second list.

Each shade has: `id` (also the i18n name key `shades.<id>`), `name` (canonical
English, used by the English PDF), `cls` (the `bg-ink-*` utility backed by the
theme's oklch token), `hex` (the **sRGB hex of that exact theme token** — not a new
colour; converted for the PDF and hex swatch blocks), and `spec`.

**Filling real specs later:** each shade's `spec` object currently points at
`PLACEHOLDER_SPEC` (`"To be confirmed"` for finish, opacity, substrate, drying,
food-safe, Pantone ref). Replace them per shade with client-confirmed values — do
**not** invent ink data. The spec **labels** are translated (`shadeExplorer.spec.*`);
the placeholder value shows the localized `shadeExplorer.tbd`, and real values render
straight through once added.

### Feature map

- **Shade explorer** — the 8 Products cards are buttons; clicking opens a focus-
  trapped modal (`src/components/products/ShadeDetail.tsx`) with a large hex swatch,
  the spec list, and a "Request this shade on WhatsApp" button that routes through
  the existing `handleHumanHandoff()`. Close via X / Esc / backdrop.
- **Quote-builder** (`src/components/contact/QuoteForm.tsx`) — structured fields
  (board, multi-select shades + custom/Pantone, press type + free-text, volume,
  notes) plus the existing Name / Company / Phone-Email. "Send enquiry" is the demo
  confirmation; **"Send via WhatsApp"** composes a tidy message from the fields and
  routes through `handleHumanHandoff()`. Template: `contact.form.whatsapp.template`.
- **Reveal-on-scroll** — the `src/components/Reveal.tsx` helper (Framer Motion
  `whileInView`, `once: true`) wraps section headers, card grids (light stagger) and
  images. It renders static when `prefers-reduced-motion` is set; the hero animates
  on load only (not scroll) so first paint isn't delayed.
- **PDF shade card** (`src/lib/shadeCardPdf.ts`) — client-side jsPDF, **English-only**
  (see the go-live notes). Lazy-loaded via dynamic `import()` on click, so jsPDF
  stays out of the initial bundle.

`handleHumanHandoff()` in `src/lib/chat.ts` remains the **single WhatsApp seam** for
the whole site (chat, shade explorer, quote-builder) — swap its body to add live chat.

---

## ⚠️ Before this can go live — real data needed

The following are **placeholders** carried over from the demo. Supply the real
values and update **`src/lib/site.ts`**:

- [ ] **WhatsApp number** — `WHATSAPP_NUMBER` in `src/lib/site.ts`, currently the
      flag `"TODO_CLIENT_NUMBER"` (digits only, incl. country code, e.g.
      `"919812345678"`). **Until this is set, all WhatsApp links are inert.**
- [ ] **Phone** — currently `+91 99999 99999` (`phoneDisplay`, `phoneHref`)
- [ ] **Email** — currently `sales@kakatiyainks.in`
- [ ] **Postal address** — currently `Hyderabad, Telangana, India`
- [ ] **GST number** — `gstin` (empty; common for Indian B2B trust)
- [ ] **Chat answers with client-specific facts** — the MOQ, delivery lead time and
      pricing answers are deliberately non-committal (no invented numbers). Confirm
      them with the client; the exact keys are listed in `src/lib/chat.ts`.
- [ ] **Shade specs** — finish, opacity, substrate, drying, food-safe and Pantone ref
      for all 8 shades are `"To be confirmed"` placeholders in `src/lib/shades.ts`
      (`PLACEHOLDER_SPEC`). These show in the shade explorer and the PDF. **Do not
      invent ink specs** — fill them per shade only once the client confirms.
- [ ] **Quote-form volume unit** — the volume field hint says "drums / kg"; confirm
      the preferred unit (flagged in `src/components/contact/QuoteForm.tsx`).

Also note:

- **Enquiry form** (now a structured quote-builder) only shows a demo confirmation —
  it is **not wired to a backend**. The demo message tells the visitor to use
  "Send via WhatsApp" so their enquiry actually reaches you. Connect the form to an
  email service / form endpoint (e.g. Formspree, a serverless function, or your CRM)
  before launch. See `src/components/contact/QuoteForm.tsx`.
- **PDF shade card is English-only** (v1). jsPDF's built-in fonts can't render Telugu
  or Devanagari, so the PDF stays English regardless of site language and the button
  is labelled accordingly. Localizing it needs a Unicode font embedded via
  `doc.addFont()` — see the note in `src/lib/shadeCardPdf.ts`. Deferred until specs
  are final.
- The **"Edit with Lovable" badge has been removed** (it was in the original footer).

---

## Accessibility

- Semantic landmarks (`header`, `main`, `nav`, `footer`), one `<h1>`, ordered headings.
- Skip-to-content link, visible keyboard focus rings, `aria-pressed` language toggle,
  Escape-to-close mobile menu, labelled form fields with `autocomplete`.
- All images have alt text; decorative elements (marquee, glows) are `aria-hidden`.
- `prefers-reduced-motion` disables the marquee, floats and reveal animations.
- Touch targets are ≥ 44px on interactive controls.

## Cross-browser & responsive

- Responsive from 320px phones to large desktops (Tailwind breakpoints).
- Autoprefixing is handled by Tailwind v4's Lightning CSS pipeline.
- `-webkit-` fallbacks for background-clip text; `text-size-adjust` for mobile Safari;
  `env(safe-area-inset-*)` respected on the floating button.
- Verified building/rendering targets: Chrome, Edge, Firefox, Safari (desktop),
  plus mobile Safari (iOS) and Chrome (Android). The animated headline uses
  `oklch()` relative colour syntax — on very old engines the soft rainbow wash
  simply degrades to no tint (harmless).

> Please spot-check the marquee, language switch and the chat widget (open/close,
> quick replies, WhatsApp handoff) on a real mobile Safari and Chrome-for-Android
> device before launch — these are the usual breakage points.

---

## Build for production

```bash
npm run build
```

Outputs a fully static bundle to `dist/`. Deploy the contents of `dist/` to any
static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3, Nginx). No server
runtime is required. Because it is a single-page app, if you add client-side routes
later, configure the host to fall back to `index.html`.

### Note if the project lives under a OneDrive-synced folder

This repo currently sits under `Desktop`, which is OneDrive-synced. OneDrive keeps a
handle open on the freshly-built `dist/` folder, so a **second** `npm run build`
can fail with `EPERM … dist\assets` while Vite tries to empty the old output. A
build from a clean state always works. If you hit it:

```powershell
cmd /c "rmdir /s /q dist"   # force-remove the locked folder, then rebuild
npm run build
```

To avoid it entirely, either move the project outside the OneDrive folder, or pause
OneDrive sync while developing.
