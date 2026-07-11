import { motion, useReducedMotion } from "framer-motion";
import type { ChatMessage } from "../../lib/chat";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const reduce = useReducedMotion();
  const isBot = message.sender === "bot";

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex ${isBot ? "justify-start" : "justify-end"}`}
    >
      <div
        className={
          isBot
            ? "max-w-[85%] rounded-2xl rounded-bl-md border border-border/60 bg-muted px-4 py-2.5 text-sm text-foreground"
            : "max-w-[85%] rounded-2xl rounded-br-md bg-foreground px-4 py-2.5 text-sm text-background"
        }
      >
        {message.text}
      </div>
    </motion.div>
  );
}
