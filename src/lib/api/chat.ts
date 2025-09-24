// API client for chat functionality
import type {
  CreateSessionRequest,
  CreateSessionResponse,
  SessionSummary,
  SessionResponse,
  SendMessageRequest,
  ChatStreamResponse,
  ApiError,
} from '@/types/chat';

const API_BASE_URL = 'http://localhost:5000';

class ChatApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ChatApiError';
  }
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorMessage;
    } catch {
      // Use the raw text if it's not JSON
      errorMessage = errorText || errorMessage;
    }
    
    throw new ChatApiError(errorMessage, response.status);
  }
  
  return response.json();
}

// Session Management API calls
export const sessionApi = {
  // Create a new chat session
  async createSession(request: CreateSessionRequest = {}): Promise<CreateSessionResponse> {
    const response = await fetch(`${API_BASE_URL}/api/chat/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    return handleResponse<CreateSessionResponse>(response);
  },

  // Get all sessions
  async getSessions(): Promise<SessionSummary[]> {
    const response = await fetch(`${API_BASE_URL}/api/chat/sessions`);
    return handleResponse<SessionSummary[]>(response);
  },

  // Get specific session with messages
  async getSession(sessionId: string): Promise<SessionResponse> {
    const response = await fetch(`${API_BASE_URL}/api/chat/sessions/${sessionId}`);
    return handleResponse<SessionResponse>(response);
  },

  // Delete a session
  async deleteSession(sessionId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/chat/sessions/${sessionId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new ChatApiError(`Failed to delete session: ${response.statusText}`, response.status);
    }
  },
};

// Message API calls
export const messageApi = {
  // Send message with streaming response
  async sendMessage(
    sessionId: string,
    request: SendMessageRequest,
    onChunk: (chunk: ChatStreamResponse) => void,
    onComplete: () => void,
    onError: (error: ApiError) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new ChatApiError(`Failed to send message: ${errorText}`, response.status);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new ChatApiError('No response body available');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          onComplete();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;
          
          if (line.startsWith('data: ')) {
            try {
              const rawData = JSON.parse(line.slice(6));
              // Convert PascalCase to camelCase to match our interface
              const data: ChatStreamResponse = {
                messageId: rawData.MessageId || rawData.messageId,
                content: rawData.Content || rawData.content,
                isComplete: rawData.IsComplete !== undefined ? rawData.IsComplete : rawData.isComplete,
                timestamp: rawData.Timestamp || rawData.timestamp,
              };
              onChunk(data);
            } catch (error) {
              console.warn('Failed to parse SSE data:', line, error);
            }
          } else if (line.startsWith('event: complete')) {
            onComplete();
            return;
          }
        }
      }
    } catch (error) {
      if (error instanceof ChatApiError) {
        onError({ message: error.message, status: error.status, code: error.code });
      } else {
        onError({ message: error instanceof Error ? error.message : 'Unknown error occurred' });
      }
    }
  },
};

// Utility functions
export const chatUtils = {
  // Check if API is available
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  // Format error message for display
  formatError(error: ApiError): string {
    if (error.status === 404) {
      return 'Session not found. Please start a new chat.';
    } else if (error.status === 429) {
      return 'Too many requests. Please wait a moment and try again.';
    } else if (error.status && error.status >= 500) {
      return 'Server error. Please try again later.';
    }
    return error.message || 'An unexpected error occurred.';
  },
};

export { ChatApiError };
