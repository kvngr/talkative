"use client";

import { ChatButton } from "@/components/Chat/ChatButton";
import { ChatMessage } from "@/components/Chat/ChatMessage";
import { useChat } from "@/hooks/use-chat";
import { isValidUserInput } from "@/lib/utils";
import { ConversationContext } from "@/types/chat";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatedBackground } from "../AnimatedBackground/AnimatedBackground";

export const Chat: React.FC = () => {
  const { sendMessage, messages, isLoading, error, reset } = useChat();

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isInputValid = useMemo<boolean>(
    () => isValidUserInput(inputValue),
    [inputValue],
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onMessageStart = useCallback(() => {
    if (error !== null) {
      reset();
    }
  }, [error, reset]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isInputValid === false || isLoading === true) {
      return;
    }

    const messageText = inputValue.trim();
    setInputValue("");

    // Call message start callback to reset any previous errors
    onMessageStart?.();

    const context: ConversationContext = {
      messages,
      sessionId: "default-session",
    };

    try {
      await sendMessage(messageText, context);
      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to send message:", error);
      setInputValue(messageText);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && event.shiftKey === false) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const renderMessages = useMemo(() => {
    return messages.map((message) => (
      <ChatMessage key={message.id} message={message} />
    ));
  }, [messages]);

  return (
    <Fragment>
      <AnimatedBackground />

      <div className="relative h-full">
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {renderMessages}

          {isLoading === true ? (
            <div className="flex justify-start mb-4">
              <div className="px-4 py-3 flex items-center gap-2">
                <div className="animate-pulse flex space-x-1">
                  <div className="w-2 h-2 bg-gray-100 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-100 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-gray-100 rounded-full animate-bounce delay-150"></div>
                </div>
                <span className="text-neutral-100 text-sm font-medium">
                  Thinking...
                </span>
              </div>
            </div>
          ) : null}

          <div ref={messagesEndRef} />
        </div>

        <div className="px-6 py-4 w-1/3 fixed left-1/2 -translate-x-1/2 bottom-0">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="h-full relative shadow-lg rounded-full">
              <input
                ref={inputRef}
                value={inputValue}
                name="message"
                onChange={(event) => {
                  setInputValue(event.target.value);
                }}
                onKeyDown={handleKeyPress}
                placeholder="Describe what you'd like me to create..."
                className="w-full relative px-4 pr-14 py-3 h-full text-neutral-500 bg-neutral-100 rounded-full resize-none focus:outline-none focus:ring-0 focus:border-transparent"
                style={{
                  height: Math.min(
                    50 + (inputValue.split("\n").length - 1) * 20,
                    120,
                  ),
                }}
                disabled={isLoading}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
                <ChatButton
                  type="submit"
                  variant="outline"
                  disabled={isInputValid === false || isLoading === true}
                  loading={isLoading}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};
