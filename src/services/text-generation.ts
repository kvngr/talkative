import { isReplicateFetchError } from "@/lib/replicate";
import { measureExecutionTime } from "@/lib/utils";
import { TextGenerationRequest, ToolResult } from "@/types/chat";
import Replicate from "replicate";

const DEFAULT_MODEL = "anthropic/claude-3.7-sonnet";

export interface ITextGenerationService {
  generateText(request: TextGenerationRequest): Promise<ToolResult>;
}

// Replicate-based text generation service
export class ReplicateTextGenerationService implements ITextGenerationService {
  private client: Replicate;

  constructor() {
    const apiKey = process.env.REPLICATE_API_TOKEN;

    if (apiKey === undefined) {
      throw new Error("REPLICATE_API_TOKEN environment variable is required");
    }

    this.client = new Replicate({ auth: apiKey });
  }

  async generateText(request: TextGenerationRequest): Promise<ToolResult> {
    const { result, executionTime } = await measureExecutionTime(async () => {
      return this.callReplicate(request);
    });

    return {
      type: "text-generation",
      content: result,
      reasoning: "User requested text content or assistance",
      modelUsed: DEFAULT_MODEL.split("/").pop() || "text-model",
      executionTime,
    };
  }

  private async callReplicate(request: TextGenerationRequest): Promise<string> {
    const contextPrompt = this.buildContextPrompt(request);

    try {
      const output = await this.client.run(DEFAULT_MODEL, {
        input: {
          prompt: contextPrompt,
          scheduler: "K_EULER",
        },
      });

      const result = Array.isArray(output) ? output.join("") : String(output);

      if (result.trim().length === 0) {
        throw new Error("No content received from Replicate");
      }

      return result.trim();
    } catch (error) {
      if (isReplicateFetchError(error) === true) {
        // Preserve the original error message and add more context
        const statusText = error.response?.statusText || "Unknown error";
        const status = error.response?.status;
        const errorDetails = status
          ? `${statusText} (HTTP ${status})`
          : statusText;
        throw new Error(`Replicate API error: ${errorDetails}`);
      }

      // For other errors, provide more context but preserve the original message
      const originalMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Text generation failed: ${originalMessage}`);
    }
  }

  private buildContextPrompt(request: TextGenerationRequest): string {
    const { prompt, context } = request;

    if (context.length === 0) {
      return prompt;
    }

    const contextString = context.slice(-4).join("\n");
    return `Context:\n${contextString}\n\nUser: ${prompt}\n\nAssistant:`;
  }
}

// Text generation service that requires Replicate API token
export class TextGenerationService implements ITextGenerationService {
  private replicateService: ReplicateTextGenerationService;

  constructor() {
    const apiKey = process.env.REPLICATE_API_TOKEN;

    if (apiKey === undefined) {
      throw new Error(
        "REPLICATE_API_TOKEN environment variable is required for text generation",
      );
    }

    this.replicateService = new ReplicateTextGenerationService();
  }

  async generateText(request: TextGenerationRequest): Promise<ToolResult> {
    return this.replicateService.generateText(request);
  }
}
