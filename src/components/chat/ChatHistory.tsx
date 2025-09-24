import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { cn } from "@/lib/utils";
import type { SessionSummary } from "@/types/chat";

interface ChatHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: SessionSummary[];
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onNewChat: () => void;
  isLoading: boolean;
}

export function ChatHistory({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onNewChat,
  isLoading,
}: ChatHistoryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const getSessionTitle = (session: SessionSummary) => {
    return session.title || `Chat ${formatDate(session.createdAt)}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed right-0 top-0 h-full w-80 bg-white border-l border-slate-200 shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                Chat History
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* New Chat Button */}
            <div className="p-4 border-b border-slate-200">
              <Button
                onClick={() => {
                  onNewChat();
                  onClose();
                }}
                className="w-full justify-start gap-2"
                variant="secondary"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </Button>
            </div>

            {/* Sessions List */}
            <ScrollArea className="flex-1">
              <div className="p-2">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-sm text-slate-500">
                      Loading sessions...
                    </div>
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <MessageSquare className="w-8 h-8 text-slate-400 mb-2" />
                    <div className="text-sm text-slate-500">
                      No chat history yet
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Start a conversation to see it here
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {sessions.map((session) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "group relative rounded-lg p-3 cursor-pointer transition-colors",
                          "hover:bg-slate-50",
                          currentSessionId === session.id
                            ? "bg-blue-50 border border-blue-200"
                            : "border border-transparent"
                        )}
                        onClick={() => {
                          onSelectSession(session.id);
                          onClose();
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-900 truncate">
                              {getSessionTitle(session)}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              {session.messageCount} message
                              {session.messageCount !== 1 ? "s" : ""}
                              {" • "}
                              {formatDate(session.lastMessageAt)}
                            </div>
                          </div>

                          {/* Delete button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 p-1 ml-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSession(session.id);
                            }}
                            title="Delete chat"
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
