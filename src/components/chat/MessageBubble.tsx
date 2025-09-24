import React from "react";
import { motion } from "framer-motion";
import { Copy, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

// Streaming text component that shows content as it arrives
function StreamingText({ content }: { content: string }) {
  return (
    <span>
      {content}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-0.5 h-4 bg-current ml-0.5"
      />
    </span>
  );
}

export function MessageBubble({
  message,
  isStreaming = false,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-3 max-w-4xl mx-auto px-4 py-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-yellow-500 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      <div
        className={cn(
          "flex flex-col gap-1 max-w-[80%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "relative group rounded-2xl px-4 py-3 shadow-sm",
            isUser
              ? "bg-blue-600 text-white rounded-br-md"
              : "bg-white border border-slate-200 text-slate-900 rounded-bl-md"
          )}
        >
          <div className="whitespace-pre-wrap break-words">
            {isStreaming ? (
              <StreamingText content={message.content} />
            ) : (
              message.content
            )}
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className={cn(
              "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity",
              "p-1 rounded hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-blue-500",
              isUser
                ? "text-white/70 hover:text-white"
                : "text-slate-400 hover:text-slate-600"
            )}
            title={copied ? "Copied!" : "Copy message"}
          >
            <Copy className="w-3 h-3" />
          </button>
        </div>

        <div
          className={cn(
            "text-xs text-slate-500 px-2",
            isUser ? "text-right" : "text-left"
          )}
        >
          {formatTime(message.timestamp)}
          {copied && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="ml-2 text-green-600"
            >
              Copied!
            </motion.span>
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center">
            <User className="w-4 h-4 text-slate-600" />
          </div>
        </div>
      )}
    </motion.div>
  );
}
