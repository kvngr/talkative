import { formatTimestamp } from "@/lib/utils";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import clsx from "clsx";
import Image from "next/image";
import React from "react";
import { ChatActionLog } from "../ChatActionLog";

type ChatMessageProps = {
  message: ChatMessageType;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={clsx(
        "flex gap-3 mb-4",
        isUser === true ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={clsx("max-w-[80%]", isUser === true ? "order-2" : "order-1")}
      >
        <div
          className={clsx(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2",
            isUser === true
              ? "bg-blue-600 text-white ml-auto"
              : "bg-gray-200 text-gray-700",
          )}
        >
          {isUser ? "U" : "A"}
        </div>

        <div
          className={clsx(
            "rounded-lg px-4 py-3",
            isUser === true
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-900",
          )}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>

          {message.imageUrl !== undefined && message.imageUrl.length > 0 ? (
            <div className="mt-3">
              <Image
                src={message.imageUrl}
                alt="Generated content"
                className="rounded-lg"
                loading="lazy"
                width={512}
                height={512}
                sizes="100vw"
              />
            </div>
          ) : null}

          <div
            className={clsx(
              "text-xs mt-2",
              isUser === true ? "text-blue-100" : "text-gray-500",
            )}
          >
            {formatTimestamp(message.timestamp)}
          </div>
        </div>

        {isUser === false && message.actionLog !== undefined ? (
          <div className="mt-2">
            <ChatActionLog actionLog={message.actionLog} />
          </div>
        ) : null}
      </div>
    </div>
  );
};
