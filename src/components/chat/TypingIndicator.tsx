import { useTranslation } from "react-i18next";

/** Animated three-dot "typing" bubble. Dots freeze automatically under
 *  prefers-reduced-motion via the global rule in index.css. */
export function TypingIndicator() {
  const { t } = useTranslation();
  return (
    <div className="flex justify-start" role="status" aria-label={t("chat.typing")}>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-border/60 bg-muted px-4 py-3">
        <span className="chat-dot h-2 w-2 rounded-full bg-muted-foreground" />
        <span className="chat-dot h-2 w-2 rounded-full bg-muted-foreground [animation-delay:0.2s]" />
        <span className="chat-dot h-2 w-2 rounded-full bg-muted-foreground [animation-delay:0.4s]" />
      </div>
    </div>
  );
}
