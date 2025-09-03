import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function isValidUserInput(input?: string): boolean {
  if (input === undefined) {
    return false;
  }

  return input.trim().length > 0;
}

export async function measureExecutionTime<T>(
  fn: () => Promise<T>,
): Promise<{ result: T; executionTime: number }> {
  const start = Date.now();
  const result = await fn();
  return {
    result,
    executionTime: Date.now() - start,
  };
}
