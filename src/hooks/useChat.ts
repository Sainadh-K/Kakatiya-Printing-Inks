import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "framer-motion";
import {
  TOPIC_KEYS,
  handleHumanHandoff,
  type ChatMessage,
  type Sender,
  type TopicKey,
} from "../lib/chat";

/** A tappable quick-reply shown beneath the message list. */
export type QuickReply =
  | { kind: "topic"; key: TopicKey }
  | { kind: "menu" } // "Ask something else" → back to main menu
  | { kind: "human" }; // "Chat with owner on WhatsApp"

// Monotonic id source (runtime only; not used in workflow scripts).
let idCounter = 0;
const nextId = () => `m${++idCounter}`;

// Quick-reply menu = topic queries only. WhatsApp handoff lives in the persistent
// footer button, so it is intentionally NOT duplicated as a menu option here.
const MAIN_MENU: QuickReply[] = TOPIC_KEYS.map(
  (key) => ({ kind: "topic", key }) as QuickReply,
);

const FOLLOW_UP: QuickReply[] = [{ kind: "menu" }];

/**
 * Canned conversation flow. All copy is resolved through i18n, so switching site
 * language restarts the conversation in that language (see the language effect).
 */
export function useChat() {
  const { t, i18n } = useTranslation();
  const reduce = useReducedMotion();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [options, setOptions] = useState<QuickReply[]>([]);
  const lastTopic = useRef<TopicKey | null>(null);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  const addMessage = useCallback((sender: Sender, text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: nextId(), sender, text, timestamp: Date.now() },
    ]);
  }, []);

  /** Show a bot reply after a short "typing" pause (skipped under reduced motion). */
  const botReply = useCallback(
    (text: string, nextOptions: QuickReply[]) => {
      setOptions([]);
      setIsTyping(true);
      const delay = reduce ? 0 : 500;
      const id = window.setTimeout(() => {
        setIsTyping(false);
        addMessage("bot", text);
        setOptions(nextOptions);
      }, delay);
      timers.current.push(id);
    },
    [addMessage, reduce],
  );

  const start = useCallback(() => {
    clearTimers();
    lastTopic.current = null;
    setIsTyping(false);
    setMessages([
      { id: nextId(), sender: "bot", text: t("chat.greeting"), timestamp: Date.now() },
    ]);
    setOptions(MAIN_MENU);
  }, [t]);

  // Start on mount and restart when the site language changes.
  useEffect(() => {
    start();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const selectTopic = useCallback(
    (key: TopicKey) => {
      clearTimers();
      lastTopic.current = key;
      addMessage("user", t(`chat.menu.${key}`));
      botReply(t(`chat.answers.${key}`), FOLLOW_UP);
    },
    [addMessage, botReply, t],
  );

  const askElse = useCallback(() => {
    clearTimers();
    lastTopic.current = null;
    addMessage("user", t("chat.askElse"));
    botReply(t("chat.askElsePrompt"), MAIN_MENU);
  }, [addMessage, botReply, t]);

  const talkToHuman = useCallback(() => {
    const topic = lastTopic.current;
    const message = topic
      ? t("chat.whatsapp.seed", { topic: t(`chat.menu.${topic}`) })
      : t("chat.whatsapp.generic");
    addMessage("user", t("chat.menu.human"));
    addMessage("bot", t("chat.handoffNote"));
    handleHumanHandoff(message); // the single live-chat seam
  }, [addMessage, t]);

  return { messages, isTyping, options, selectTopic, askElse, talkToHuman };
}
