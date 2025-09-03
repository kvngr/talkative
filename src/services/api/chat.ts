import { ChatMessage, ConversationContext } from "@/types/chat";

export type SendChatMessageRequest = {
  message: string;
  context: ConversationContext;
};

export type SendChatMessageResponse = {
  success: boolean;
  message: ChatMessage;
  error?: string;
};

export type ApiResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
      statusCode?: number;
    };

const API_BASE_URL = "/api/chat";

export class ChatApiService {
  static async sendMessage(
    request: SendChatMessageRequest,
  ): Promise<ApiResult<ChatMessage>> {
    try {
      const requestPayload = {
        message: request.message,
        context: {
          ...request.context,
          messages: request.context.messages.map((msg) => ({
            ...msg,
            timestamp: msg.timestamp.toISOString(),
          })),
        },
      };

      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      if (response.ok === false) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error,
          statusCode: response.status,
        };
      }

      const data: SendChatMessageResponse = await response.json();

      if (data.success === false) {
        return {
          success: false,
          error:
            data.error || "The AI service returned an error. Please try again.",
        };
      }

      // Transform timestamp back to Date object
      const chatMessage: ChatMessage = {
        ...data.message,
        timestamp: new Date(data.message.timestamp),
      };

      return {
        success: true,
        data: chatMessage,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? `Connection failed: ${error.message}`
            : "An unexpected error occurred. Please check your internet connection.",
      };
    }
  }
}
