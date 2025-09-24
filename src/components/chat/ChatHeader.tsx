import React from "react";
import { motion } from "framer-motion";
import { History, Plus, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { SessionResponse } from "@/types/chat";

interface ChatHeaderProps {
  currentSession: SessionResponse | null;
  onToggleHistory: () => void;
  onNewChat: () => void;
  isOnline?: boolean;
}

export function ChatHeader({
  currentSession,
  onToggleHistory,
  onNewChat,
  isOnline = true,
}: ChatHeaderProps) {
  const getSessionTitle = () => {
    if (!currentSession) return "New Chat";
    return (
      currentSession.title ||
      `Chat from ${new Date(currentSession.createdAt).toLocaleDateString()}`
    );
  };

  const getMessageCount = () => {
    if (!currentSession) return 0;
    return currentSession.messages.length;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border-b border-slate-200 bg-white px-4 py-3"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Session Info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-yellow-500 flex items-center justify-center">
            <span className="text-sm text-white font-bold">R</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 truncate max-w-xs">
              {getSessionTitle()}
            </h1>
            {currentSession && (
              <div className="text-xs text-slate-500">
                {getMessageCount()} message{getMessageCount() !== 1 ? "s" : ""}
                {!isOnline && (
                  <span className="ml-2 inline-flex items-center gap-1 text-red-500">
                    <WifiOff className="w-3 h-3" />
                    Offline
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Connection Status */}
          {isOnline ? (
            <div className="hidden sm:flex items-center gap-1 text-xs text-green-600">
              <Wifi className="w-3 h-3" />
              <span>Online</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-red-500">
              <WifiOff className="w-3 h-3" />
              <span>Offline</span>
            </div>
          )}

          {/* New Chat Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewChat}
            className="gap-2"
            title="Start new chat"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </Button>

          {/* History Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleHistory}
            className="gap-2"
            title="View chat history"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
