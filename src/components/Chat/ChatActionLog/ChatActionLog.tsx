import { ActionLog as ActionLogType } from "@/types/chat";
import clsx from "clsx";
import React, { useState } from "react";

type ChatActionLogProps = {
  actionLog: ActionLogType;
};

const toolColors: Record<string, string> = {
  "text-generation": "bg-green-50 border-green-200 text-green-800",
  "image-generation": "bg-purple-50 border-purple-200 text-purple-800",
  clarification: "bg-yellow-50 border-yellow-200 text-yellow-800",
};

const toolIcons: Record<string, string> = {
  "text-generation": "📝",
  "image-generation": "🎨",
  clarification: "❓",
};

export const ChatActionLog: React.FC<ChatActionLogProps> = ({ actionLog }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={clsx(
        "border rounded-lg p-3 text-sm",
        toolColors[actionLog.toolUsed],
      )}
    >
      <button
        onClick={() => {
          setIsExpanded((prevState) => prevState === false);
        }}
        className="w-full flex items-center justify-between hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{toolIcons[actionLog.toolUsed]}</span>
          <span className="font-medium capitalize">
            {actionLog.toolUsed.replace("-", " ")}
          </span>
          {actionLog.modelUsed !== undefined ? (
            <span className="text-xs opacity-70">({actionLog.modelUsed})</span>
          ) : null}
          {actionLog.executionTime !== undefined ? (
            <span className="text-xs opacity-70">
              {actionLog.executionTime}ms
            </span>
          ) : null}
        </div>
        <svg
          className={clsx(
            "w-4 h-4 transition-transform",
            isExpanded === true ? "rotate-180" : undefined,
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded === true ? (
        <div className="mt-3 space-y-2 border-t pt-3">
          <div>
            <div className="font-medium text-xs uppercase tracking-wider opacity-70 mb-1">
              Reasoning
            </div>
            <div className="text-sm">{actionLog.reasoning}</div>
          </div>

          <div>
            <div className="font-medium text-xs uppercase tracking-wider opacity-70 mb-1">
              Input
            </div>
            <div className="text-sm bg-white/50 rounded px-2 py-1 font-mono">
              {actionLog.input}
            </div>
          </div>

          <div>
            <div className="font-medium text-xs uppercase tracking-wider opacity-70 mb-1">
              Output
            </div>
            <div className="text-sm bg-white/50 rounded px-2 py-1">
              {actionLog.output.length > 100
                ? `${actionLog.output.slice(0, 100)}...`
                : actionLog.output}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
