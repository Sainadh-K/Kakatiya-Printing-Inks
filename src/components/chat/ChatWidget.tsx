import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { ChatPanel } from "./ChatPanel";

/**
 * Floating chat launcher + in-page panel. Replaces the old "open WhatsApp in a new
 * tab" button — the launcher now opens an on-page conversation. WhatsApp is only
 * reached via the explicit "talk to a human" handoff inside the panel.
 */
export function ChatWidget() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    // Restore focus to the launcher for keyboard users.
    launcherRef.current?.focus();
  };

  // Lock body scroll only while the near-fullscreen panel is up on small screens.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(max-width: 639px)");
    if (!mq.matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t("chat.launcherClose") : t("chat.launcherOpen")}
        aria-expanded={open}
        aria-controls="chat-panel"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-ink-blue text-white shadow-lg ring-1 ring-black/10 transition hover:-translate-y-0.5 hover:bg-ink-blue/90 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {open ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-7 w-7" aria-hidden="true" />
        )}
      </button>

      <AnimatePresence>{open && <ChatPanel key="panel" onClose={close} />}</AnimatePresence>
    </>
  );
}
