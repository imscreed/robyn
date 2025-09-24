import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "@/components/ui/LoadingSpinner";
import { ScrollArea } from "@/components/ui/ScrollArea";
import type { ChatMessage } from "@/types/chat";

interface MessageListProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  streamingMessageId: string | null;
}

export function MessageList({
  messages,
  isStreaming,
  streamingMessageId,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isStreaming]);

  // Show welcome message when no messages
  if (messages.length === 0 && !isStreaming) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-yellow-500 flex items-center justify-center">
            <span className="text-2xl text-white font-bold">R</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Hello! I'm Robyn
          </h2>
          <p className="text-slate-600 mb-6">
            Your personal emotional support AI companion. How can I help you
            today?
          </p>
          <div className="text-sm text-slate-500">
            Start by typing a message below
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1">
      <div className="py-4">
        <AnimatePresence>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isStreaming={isStreaming && message.id === streamingMessageId}
            />
          ))}
        </AnimatePresence>

        {/* Typing indicator when streaming starts */}
        {isStreaming && !streamingMessageId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex gap-3 max-w-4xl mx-auto px-4 py-3"
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-yellow-500 flex items-center justify-center">
                <span className="text-sm text-white font-bold">R</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <TypingIndicator />
              </div>
            </div>
          </motion.div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
