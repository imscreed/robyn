// Chat-related TypeScript interfaces and types

export interface CreateSessionRequest {
  title?: string;
}

export interface CreateSessionResponse {
  sessionId: string;
  createdAt: string;
}

export interface SessionSummary {
  id: string;
  title?: string;
  createdAt: string;
  lastMessageAt: string;
  messageCount: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  model?: string;
}

export interface SessionResponse {
  id: string;
  userId: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface SendMessageRequest {
  content: string;
  model?: string;
}

export interface ChatStreamResponse {
  messageId: string;
  content: string;
  isComplete: boolean;
  timestamp: string;
}

// UI State interfaces
export interface ChatState {
  currentSessionId: string | null;
  sessions: SessionSummary[];
  currentSession: SessionResponse | null;
  isLoading: boolean;
  isStreaming: boolean;
  streamingMessageId: string | null;
  error: string | null;
  isHistoryOpen: boolean;
}

export interface StreamingMessage {
  id: string;
  content: string;
  isComplete: boolean;
  timestamp: string;
}

// API Error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Chat actions for state management
export type ChatAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_STREAMING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_SESSION'; payload: SessionResponse | null }
  | { type: 'SET_SESSIONS'; payload: SessionSummary[] }
  | { type: 'ADD_SESSION'; payload: SessionSummary }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'UPDATE_STREAMING_MESSAGE'; payload: { id: string; content: string; isComplete: boolean } }
  | { type: 'SET_STREAMING_MESSAGE_ID'; payload: string | null }
  | { type: 'TOGGLE_HISTORY'; payload?: boolean }
  | { type: 'SET_CURRENT_SESSION_ID'; payload: string | null };
