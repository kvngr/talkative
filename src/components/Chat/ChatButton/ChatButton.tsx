import React from "react";
import { cn } from "@/lib/utils";

type ChatButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

const baseClasses =
  "inline-flex cursor-pointer items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<string, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
  secondary:
    "bg-gray-600 text-white hover:bg-gray-700 focus-visible:ring-gray-500",
  outline:
    "border border-gray-300 bg-transparent hover:bg-gray-50 focus-visible:ring-gray-500 shadow-md",
};

const sizes: Record<string, string> = {
  sm: "size-8 px-2 text-sm",
  md: "size-10 px-2 text-sm",
  lg: "size-11 px-2 text-base",
};

const ChatButton = React.forwardRef<HTMLButtonElement, ChatButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading === true ? (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : null}
        <svg viewBox="0 0 32 32" fill="none" className="size-6">
          <path
            fill="#000"
            d="m26.71 10.29-10-10a1 1 0 0 0-1.41 0l-10 10 1.41 1.41L15 3.41V32h2V3.41l8.29 8.29z"
          />
        </svg>
      </button>
    );
  },
);

ChatButton.displayName = "ChatButton";

export { ChatButton };
