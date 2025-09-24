import { useReducer, useCallback, useEffect } from 'react';
import { sessionApi, messageApi, chatUtils } from '@/lib/api/chat';
import type { 
  ChatState, 
  ChatAction, 
  ChatMessage, 
  SessionResponse,
  SessionSummary,
  SendMessageRequest,
  ChatStreamResponse,
} from '@/types/chat';

// Initial state
const initialState: ChatState = {
  currentSessionId: null,
  sessions: [],
  currentSession: null,
  isLoading: false,
  isStreaming: false,
  streamingMessageId: null,
  error: null,
  isHistoryOpen: false,
};

// Reducer function
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_STREAMING':
      return { ...state, isStreaming: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_CURRENT_SESSION':
      return { ...state, currentSession: action.payload };
    
    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload };
    
    case 'ADD_SESSION':
      return { ...state, sessions: [action.payload, ...state.sessions] };
    
    case 'DELETE_SESSION':
      return {
        ...state,
        sessions: state.sessions.filter(s => s.id !== action.payload),
        currentSession: state.currentSession?.id === action.payload ? null : state.currentSession,
        currentSessionId: state.currentSessionId === action.payload ? null : state.currentSessionId,
      };
    
    case 'ADD_MESSAGE':
      if (!state.currentSession) return state;
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          messages: [...state.currentSession.messages, action.payload],
        },
      };
    
    case 'UPDATE_STREAMING_MESSAGE':
      if (!state.currentSession) return state;
      const messages = state.currentSession.messages;
      const lastMessage = messages[messages.length - 1];
      
      console.log('UPDATE_STREAMING_MESSAGE:', {
        payloadId: action.payload.id,
        payloadContent: action.payload.content,
        lastMessageId: lastMessage?.id,
        lastMessageRole: lastMessage?.role,
        messagesLength: messages.length
      });
      
      if (lastMessage && lastMessage.id === action.payload.id) {
        // Update existing message by accumulating content
        const updatedMessages = [...messages];
        updatedMessages[updatedMessages.length - 1] = {
          ...lastMessage,
          content: lastMessage.content + action.payload.content, // Accumulate content
        };
        console.log('Updated existing message, new content:', updatedMessages[updatedMessages.length - 1].content);
        return {
          ...state,
          currentSession: {
            ...state.currentSession,
            messages: updatedMessages,
          },
        };
      } else {
        // Add new streaming message
        const newMessage: ChatMessage = {
          id: action.payload.id,
          role: 'assistant',
          content: action.payload.content,
          timestamp: new Date().toISOString(),
        };
        console.log('Added new streaming message:', newMessage);
        return {
          ...state,
          currentSession: {
            ...state.currentSession,
            messages: [...messages, newMessage],
          },
        };
      }
    
    case 'SET_STREAMING_MESSAGE_ID':
      return { ...state, streamingMessageId: action.payload };
    
    case 'TOGGLE_HISTORY':
      return { ...state, isHistoryOpen: action.payload ?? !state.isHistoryOpen };
    
    case 'SET_CURRENT_SESSION_ID':
      return { ...state, currentSessionId: action.payload };
    
    default:
      return state;
  }
}

export function useChat() {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  // Load all sessions
  const loadSessions = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const sessions = await sessionApi.getSessions();
      dispatch({ type: 'SET_SESSIONS', payload: sessions });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load sessions';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Create new session
  const createNewSession = useCallback(async (title?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await sessionApi.createSession({ title });
      
      // Create a new session summary
      const newSession: SessionSummary = {
        id: response.sessionId,
        title: title,
        createdAt: response.createdAt,
        lastMessageAt: response.createdAt,
        messageCount: 0,
      };
      
      dispatch({ type: 'ADD_SESSION', payload: newSession });
      dispatch({ type: 'SET_CURRENT_SESSION_ID', payload: response.sessionId });
      
      // Load the full session
      await loadSession(response.sessionId);
      
      return response.sessionId;
    } catch (error) {
      const errorMessage = chatUtils.formatError({
        message: error instanceof Error ? error.message : 'Failed to create session'
      });
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Load specific session
  const loadSession = useCallback(async (sessionId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const session = await sessionApi.getSession(sessionId);
      dispatch({ type: 'SET_CURRENT_SESSION', payload: session });
      dispatch({ type: 'SET_CURRENT_SESSION_ID', payload: sessionId });
    } catch (error) {
      const errorMessage = chatUtils.formatError({
        message: error instanceof Error ? error.message : 'Failed to load session'
      });
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (content: string, model?: string) => {
    if (!content.trim()) return;

    let sessionId = state.currentSessionId;
    
    // Create new session if none exists
    if (!sessionId) {
      try {
        sessionId = await createNewSession();
      } catch (error) {
        return; // Error already handled in createNewSession
      }
    }

    if (!sessionId) return;

    // Add user message immediately (optimistic update)
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_STREAMING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    const request: SendMessageRequest = { content, model };

    // Handle streaming response
    await messageApi.sendMessage(
      sessionId,
      request,
      (chunk: ChatStreamResponse) => {
        console.log('Received chunk:', chunk); // Debug log
        dispatch({ 
          type: 'UPDATE_STREAMING_MESSAGE', 
          payload: { 
            id: chunk.messageId, 
            content: chunk.content, 
            isComplete: chunk.isComplete 
          } 
        });
        
        if (!state.streamingMessageId) {
          dispatch({ type: 'SET_STREAMING_MESSAGE_ID', payload: chunk.messageId });
        }
      },
      () => {
        dispatch({ type: 'SET_STREAMING', payload: false });
        dispatch({ type: 'SET_STREAMING_MESSAGE_ID', payload: null });
        // Refresh sessions to update message count
        loadSessions();
      },
      (error) => {
        dispatch({ type: 'SET_STREAMING', payload: false });
        dispatch({ type: 'SET_STREAMING_MESSAGE_ID', payload: null });
        dispatch({ type: 'SET_ERROR', payload: chatUtils.formatError(error) });
      }
    );
  }, [state.currentSessionId, state.streamingMessageId, createNewSession, loadSessions]);

  // Delete session
  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      await sessionApi.deleteSession(sessionId);
      dispatch({ type: 'DELETE_SESSION', payload: sessionId });
    } catch (error) {
      const errorMessage = chatUtils.formatError({
        message: error instanceof Error ? error.message : 'Failed to delete session'
      });
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  }, []);

  // Toggle history sidebar
  const toggleHistory = useCallback((open?: boolean) => {
    dispatch({ type: 'TOGGLE_HISTORY', payload: open });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    createNewSession,
    loadSession,
    sendMessage,
    deleteSession,
    toggleHistory,
    clearError,
    loadSessions,
  };
}
