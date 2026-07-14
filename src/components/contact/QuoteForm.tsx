import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { WhatsAppIcon } from "../WhatsAppIcon";
import { shades } from "../../lib/shades";
import { handleHumanHandoff } from "../../lib/chat";

const BOARD_OPTIONS = ["kraft", "whiteTop", "coated", "other"] as const;
const PRESS_OPTIONS = ["flexo", "other"] as const;

const inputCls =
  "mt-2 w-full min-h-[44px] rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring";
const labelCls = "text-xs font-medium uppercase tracking-wider text-muted-foreground";

export function QuoteForm() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);

  const [form, setForm] = useState({
    name: "",
    company: "",
    contact: "",
    board: "",
    press: "",
    pressOther: "",
    volume: "",
    notes: "",
  });
  const [pickedShades, setPickedShades] = useState<Set<string>>(new Set());

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggleShade = (value: string) =>
    setPickedShades((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });

  // Demo submit — NO backend is wired yet. We only show a local confirmation;
  // we do NOT claim the enquiry was delivered.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  // Compose a tidy, readable WhatsApp message from the selected fields and route
  // through the single existing handoff seam.
  const sendViaWhatsApp = () => {
    const none = t("contact.form.whatsapp.none");

    const shadeLabels = [
      ...shades.filter((s) => pickedShades.has(s.id)).map((s) => t(`shades.${s.id}`)),
      ...(pickedShades.has("custom") ? [t("contact.form.shades.custom")] : []),
    ];

    const press =
      form.press === "other"
        ? form.pressOther.trim() || t("contact.form.press.other")
        : form.press
          ? t(`contact.form.press.${form.press}`)
          : none;

    const message = t("contact.form.whatsapp.template", {
      name: form.name.trim() || none,
      company: form.company.trim() || none,
      contact: form.contact.trim() || none,
      board: form.board ? t(`contact.form.board.${form.board}`) : none,
      shades: shadeLabels.length ? shadeLabels.join(", ") : none,
      press,
      volume: form.volume.trim() || none,
      notes: form.notes.trim() || none,
    });

    handleHumanHandoff(message);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-border/60 bg-background/80 p-8 backdrop-blur"
    >
      <h3 className="font-display text-lg font-semibold">{t("contact.form.heading")}</h3>

      <div className="mt-6 space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="q-name" className={labelCls}>
            {t("contact.form.nameLabel")}
          </label>
          <input
            id="q-name"
            value={form.name}
            onChange={set("name")}
            type="text"
            autoComplete="name"
            required
            placeholder={t("contact.form.namePlaceholder")}
            className={inputCls}
          />
        </div>

        {/* Company */}
        <div>
          <label htmlFor="q-company" className={labelCls}>
            {t("contact.form.companyLabel")}
          </label>
          <input
            id="q-company"
            value={form.company}
            onChange={set("company")}
            type="text"
            autoComplete="organization"
            placeholder={t("contact.form.companyPlaceholder")}
            className={inputCls}
          />
        </div>

        {/* Phone / Email */}
        <div>
          <label htmlFor="q-contact" className={labelCls}>
            {t("contact.form.contactLabel")}
          </label>
          <input
            id="q-contact"
            value={form.contact}
            onChange={set("contact")}
            type="text"
            autoComplete="email"
            required
            placeholder={t("contact.form.contactPlaceholder")}
            className={inputCls}
          />
        </div>

        {/* Board type */}
        <div>
          <label htmlFor="q-board" className={labelCls}>
            {t("contact.form.boardLabel")}
          </label>
          <select id="q-board" value={form.board} onChange={set("board")} className={inputCls}>
            <option value="">{t("contact.form.selectPlaceholder")}</option>
            {BOARD_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {t(`contact.form.board.${b}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Shade(s) wanted — multi-select */}
        <fieldset>
          <legend className={labelCls}>{t("contact.form.shadesLabel")}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {shades.map((s) => {
              const active = pickedShades.has(s.id);
              return (
                <label
                  key={s.id}
                  className={`inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition ${
                    active ? "border-ring bg-accent" : "border-border bg-card hover:border-ring"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleShade(s.id)}
                    className="sr-only"
                  />
                  <span className={`h-3 w-3 rounded-full ${s.cls} ring-1 ring-border`} aria-hidden="true" />
                  {t(`shades.${s.id}`)}
                </label>
              );
            })}
            <label
              className={`inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition ${
                pickedShades.has("custom")
                  ? "border-ring bg-accent"
                  : "border-border bg-card hover:border-ring"
              }`}
            >
              <input
                type="checkbox"
                checked={pickedShades.has("custom")}
                onChange={() => toggleShade("custom")}
                className="sr-only"
              />
              {t("contact.form.shades.custom")}
            </label>
          </div>
        </fieldset>

        {/* Press type */}
        <div>
          <label htmlFor="q-press" className={labelCls}>
            {t("contact.form.pressLabel")}
          </label>
          <select id="q-press" value={form.press} onChange={set("press")} className={inputCls}>
            <option value="">{t("contact.form.selectPlaceholder")}</option>
            {PRESS_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {t(`contact.form.press.${p}`)}
              </option>
            ))}
          </select>
          {form.press === "other" && (
            <input
              value={form.pressOther}
              onChange={set("pressOther")}
              type="text"
              placeholder={t("contact.form.pressOtherPlaceholder")}
              aria-label={t("contact.form.pressOtherPlaceholder")}
              className={inputCls}
            />
          )}
        </div>

        {/* Volume. The unit hint ("drums / kg") lives in the i18n placeholder
            contact.form.volumePlaceholder.
            TODO: confirm preferred unit with client (drums vs kg vs litres). */}
        <div>
          <label htmlFor="q-volume" className={labelCls}>
            {t("contact.form.volumeLabel")}
          </label>
          <input
            id="q-volume"
            value={form.volume}
            onChange={set("volume")}
            type="text"
            inputMode="numeric"
            placeholder={t("contact.form.volumePlaceholder")}
            className={inputCls}
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="q-notes" className={labelCls}>
            {t("contact.form.notesLabel")}
          </label>
          <textarea
            id="q-notes"
            value={form.notes}
            onChange={set("notes")}
            rows={3}
            placeholder={t("contact.form.notesPlaceholder")}
            className={`${inputCls} resize-y`}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="w-full min-h-[44px] rounded-xl bg-foreground px-6 py-4 text-sm font-semibold text-background shadow-sm transition hover:-translate-y-0.5 hover:opacity-90"
          >
            {t("contact.form.submit")}
          </button>
          <button
            type="button"
            onClick={sendViaWhatsApp}
            className="inline-flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <WhatsAppIcon className="h-4 w-4" />
            {t("contact.form.sendWhatsApp")}
          </button>
        </div>

        {sent && (
          <p
            role="status"
            className="rounded-xl border border-ink-green/30 bg-ink-green/10 px-4 py-3 text-sm font-medium"
          >
            {/* Demo confirmation — no data is actually sent to a server yet. */}
            ✓ {t("contact.form.demoConfirm")}
          </p>
        )}
      </div>
    </form>
  );
}
