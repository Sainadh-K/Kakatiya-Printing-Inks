import { buildWhatsAppUrl } from "./site";

/**
 * Chat widget domain model + the single "talk to a human" seam.
 *
 * This is intentionally transport-agnostic. Today "talk to a human" hands off to
 * WhatsApp; the conversation itself is canned (no backend). See handleHumanHandoff.
 */

export type Sender = "bot" | "user";

/**
 * Message shape kept deliberately simple so a real chat transport (Tawk.to, Crisp,
 * websockets, …) could feed messages into the exact same list later.
 */
export interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  timestamp: number;
}

/** Topics 1–7: each has a quick-reply label (chat.menu.*) and a canned answer (chat.answers.*). */
export const TOPIC_KEYS = [
  "shades",
  "moq",
  "foodSafe",
  "drying",
  "delivery",
  "pricing",
  "sample",
] as const;

export type TopicKey = (typeof TOPIC_KEYS)[number];

/**
 * ⚠️ ANSWERS CONTAINING CLIENT-SPECIFIC FACTS — confirm before launch.
 * The copy lives in src/i18n/locales/*.json. These answer keys reference figures
 * we don't have yet, so the current wording is intentionally non-committal:
 *   chat.answers.moq       // TODO: confirm minimum order quantity with client
 *   chat.answers.delivery  // TODO: confirm delivery lead time with client
 *   chat.answers.pricing   // TODO: confirm pricing / quote turnaround with client
 *   chat.answers.shades    // TODO: confirm the "custom match" turnaround claim with client
 * Do not add specific numbers to these answers until the client verifies them.
 */

/**
 * THE SINGLE SEAM for handing a conversation to a human.
 *
 * Today: opens WhatsApp (wa.me) in a new tab with a pre-filled message. Opening a
 * new tab here is expected — only the widget must stay in-page.
 *
 * To add a live-chat provider later (Tawk.to, Crisp, Intercom, …), change ONLY
 * this function — e.g. call `window.Tawk_API.maximize()` and seed the message.
 * No UI or conversation code needs to change.
 */
export function handleHumanHandoff(message: string): void {
  const url = buildWhatsAppUrl(message);
  window.open(url, "_blank", "noopener,noreferrer");
}
