export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  imageUrl?: string;
  actionLog?: ActionLog;
};

export type ActionLog = {
  toolUsed: ToolType;
  reasoning: string;
  input: string;
  output: string;
  modelUsed?: string;
  executionTime?: number;
};

export type ToolType = "text-generation" | "image-generation" | "clarification";

export type ToolResult = {
  type: ToolType;
  content: string;
  imageUrl?: string;
  reasoning: string;
  modelUsed: string;
  executionTime: number;
};

export type ConversationContext = {
  messages: ChatMessage[];
  lastUserIntent?: UserIntent;
  sessionId: string;
};

export type UserIntent = "text" | "image" | "unclear";

export type ToolDecision = {
  tool: ToolType;
  confidence: number;
  reasoning: string;
};

export type TextGenerationRequest = {
  prompt: string;
  context: string[];
};

export type ImageGenerationRequest = {
  prompt: string;
  previousImageUrl?: string;
};

export type ClarificationRequest = {
  userInput: string;
  suggestions: string[];
};
