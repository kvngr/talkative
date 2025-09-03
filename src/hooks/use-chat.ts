import { generateId } from "@/lib/utils";
import { ApiResult, ChatApiService } from "@/services/api/chat";
import { ChatMessage, ConversationContext } from "@/types/chat";
import { useMutation } from "@tanstack/react-query";
import {
  useCallback,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { toast } from "react-toastify";

export type UseChatOptions = {
  onSuccess?: (data: ChatMessage) => void;
  onError?: (error: string) => void;
};

export function useChat(options?: UseChatOptions) {
  const sendMessageMutation = useMutation({
    mutationFn: ChatApiService.sendMessage,
    onSuccess: (result: ApiResult<ChatMessage>) => {
      if (result.success === true) {
        options?.onSuccess?.(result.data);
      } else {
        toast.error(result.error);
        options?.onError?.(result.error);
      }
    },
    onError: (error: Error) => {
      const errorMessage = `Unexpected error: ${error.message}`;
      toast.error(errorMessage);
      options?.onError?.(errorMessage);
    },
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isPending, startTransition] = useTransition();
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state: ChatMessage[], newMessage: ChatMessage) => [...state, newMessage],
  );

  const sendMessage = useCallback(
    async (messageText: string, context: ConversationContext) => {
      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content: messageText,
        timestamp: new Date(),
      };

      // Optimistically add the user message
      startTransition(() => {
        addOptimisticMessage(userMessage);
      });

      const updatedContext = {
        ...context,
        messages: [...context.messages, userMessage],
      };

      const result = await sendMessageMutation.mutateAsync({
        message: messageText,
        context: updatedContext,
      });

      if (result.success === false) {
        setMessages((prevState) => {
          return [
            ...prevState,
            userMessage,
            createErrorMessage(messageText, result.error),
          ];
        });
        return;
      }

      setMessages((prevState) => {
        return [...prevState, userMessage, result.data];
      });
    },
    [addOptimisticMessage, sendMessageMutation],
  );

  const values = useMemo(() => {
    return {
      sendMessage,
      messages: optimisticMessages,
      createErrorMessage,
      isLoading: sendMessageMutation.isPending || isPending,
      error: sendMessageMutation.error,
      reset: sendMessageMutation.reset,
    };
  }, [
    optimisticMessages,
    sendMessage,
    sendMessageMutation.error,
    sendMessageMutation.isPending,
    sendMessageMutation.reset,
    isPending,
  ]);

  return values;
}

function createErrorMessage(messageText: string, error: string): ChatMessage {
  return {
    id: generateId(),
    role: "assistant",
    content: error.includes("REPLICATE_API_TOKEN")
      ? "Please configure your Replicate API token to use AI features."
      : "I'm having trouble processing your request right now. Please try again.",
    timestamp: new Date(),
    actionLog: {
      toolUsed: "clarification",
      reasoning: "Error occurred during processing",
      input: messageText,
      output: "Error response",
      modelUsed: "error-handler",
      executionTime: 0,
    },
  };
}
