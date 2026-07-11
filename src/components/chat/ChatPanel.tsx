import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { X, MessageCircle } from "lucide-react";
import { useChat } from "../../hooks/useChat";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { WhatsAppIcon } from "../WhatsAppIcon";

const FOCUSABLE =
  'button:not([disabled]), [href], input, textarea, [tabindex]:not([tabindex="-1"])';

export function ChatPanel({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const { messages, isTyping, options, selectTopic, askElse, talkToHuman } = useChat();

  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to newest message / typing indicator.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "end" });
  }, [messages, isTyping, reduce]);

  // Initial focus + focus trap + Esc-to-close.
  useEffect(() => {
    closeRef.current?.focus();
    const panel = panelRef.current;
    if (!panel) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    panel.addEventListener("keydown", onKeyDown);
    return () => panel.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const enter = reduce
    ? { initial: false as const, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, y: 24, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 24, scale: 0.98 },
      };

  return (
    <motion.div
      ref={panelRef}
      id="chat-panel"
      role="dialog"
      aria-modal="true"
      aria-label={t("chat.dialogLabel")}
      {...enter}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden border border-border/60 bg-card shadow-2xl sm:inset-auto sm:bottom-24 sm:right-5 sm:h-[600px] sm:max-h-[calc(100dvh-8rem)] sm:w-[400px] sm:rounded-3xl"
    >
      <div className="rainbow-bar h-1 w-full shrink-0" aria-hidden="true" />

      {/* Header */}
      <header className="flex shrink-0 items-center gap-3 border-b border-border/60 px-4 py-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl rainbow-bar shadow-md">
          <MessageCircle className="h-5 w-5 text-white drop-shadow" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-bold tracking-tight">
            {t("brand.name")}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink-green" aria-hidden="true" />
            <span className="truncate">{t("chat.status")}</span>
          </p>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t("chat.launcherClose")}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies + persistent WhatsApp action */}
      <div className="shrink-0 space-y-2 border-t border-border/60 bg-background/40 p-3">
        {options.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {options.map((opt) => {
              if (opt.kind === "topic") {
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => selectTopic(opt.key)}
                    className="min-h-[44px] rounded-full border border-border bg-card px-4 py-2 text-left text-xs font-medium transition hover:-translate-y-0.5 hover:border-ring hover:shadow-sm"
                  >
                    {t(`chat.menu.${opt.key}`)}
                  </button>
                );
              }
              if (opt.kind === "menu") {
                return (
                  <button
                    key="menu"
                    type="button"
                    onClick={askElse}
                    className="min-h-[44px] rounded-full border border-border bg-card px-4 py-2 text-xs font-medium transition hover:-translate-y-0.5 hover:border-ring hover:shadow-sm"
                  >
                    {t("chat.askElse")}
                  </button>
                );
              }
              return (
                <button
                  key="human"
                  type="button"
                  onClick={talkToHuman}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  {t("chat.menu.human")}
                </button>
              );
            })}
          </div>
        )}

        {/* Persistent handoff button */}
        <button
          type="button"
          onClick={talkToHuman}
          className="inline-flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <WhatsAppIcon className="h-4 w-4" />
          {t("chat.menu.human")}
        </button>
      </div>
    </motion.div>
  );
}
