import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ChatHistory } from "./ChatHistory";
import { Button } from "@/components/ui/Button";
import { useChat } from "@/hooks/useChat";

export function ChatInterface() {
  const {
    currentSession,
    sessions,
    currentSessionId,
    isLoading,
    isStreaming,
    streamingMessageId,
    error,
    isHistoryOpen,
    createNewSession,
    loadSession,
    sendMessage,
    deleteSession,
    toggleHistory,
    clearError,
  } = useChat();

  const [isOnline, setIsOnline] = useState(true);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleSendMessage = async (message: string) => {
    await sendMessage(message);
  };

  const handleNewChat = async () => {
    try {
      await createNewSession();
    } catch (error) {
      // Error is already handled in the hook
      console.error("Failed to create new chat:", error);
    }
  };

  const handleSelectSession = async (sessionId: string) => {
    if (sessionId !== currentSessionId) {
      await loadSession(sessionId);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this chat? This action cannot be undone."
      )
    ) {
      await deleteSession(sessionId);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <ChatHeader
        currentSession={currentSession}
        onToggleHistory={() => toggleHistory()}
        onNewChat={handleNewChat}
        isOnline={isOnline}
      />

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 border-b border-red-200 px-4 py-3"
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="text-red-700 hover:text-red-800"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Retry
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearError}
                  className="text-red-700 hover:text-red-800"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Messages */}
        <MessageList
          messages={currentSession?.messages || []}
          isStreaming={isStreaming}
          streamingMessageId={streamingMessageId}
        />

        {/* Input */}
        <MessageInput
          onSendMessage={handleSendMessage}
          isStreaming={isStreaming}
          disabled={!isOnline}
          placeholder={
            !isOnline
              ? "You're offline. Please check your connection."
              : "Type your message..."
          }
        />
      </div>

      {/* Chat History Sidebar */}
      <ChatHistory
        isOpen={isHistoryOpen}
        onClose={() => toggleHistory(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onNewChat={handleNewChat}
        isLoading={isLoading}
      />
    </div>
  );
}
