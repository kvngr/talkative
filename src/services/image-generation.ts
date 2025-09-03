import { isReplicateFetchError } from "@/lib/replicate";
import { measureExecutionTime } from "@/lib/utils";
import { ImageGenerationRequest, ToolResult } from "@/types/chat";
import Replicate from "replicate";
import { generateId } from "@/lib/utils";
import { storeImage } from "@/lib/imageStore";

const DEFAULT_MODEL = "black-forest-labs/flux-schnell";

export interface IImageGenerationService {
  generateImage(request: ImageGenerationRequest): Promise<ToolResult>;
}

// Replicate-based image generation service
export class ReplicateImageGenerationService
  implements IImageGenerationService
{
  private client: Replicate;

  constructor() {
    const apiKey = process.env.REPLICATE_API_TOKEN;

    if (apiKey === undefined) {
      throw new Error("REPLICATE_API_TOKEN environment variable is required");
    }

    this.client = new Replicate({ auth: apiKey });
  }

  async generateImage(request: ImageGenerationRequest): Promise<ToolResult> {
    const { result, executionTime } = await measureExecutionTime(async () => {
      return this.callReplicate(request);
    });

    return {
      type: "image-generation",
      content: `Generated image for: "${request.prompt}"`,
      imageUrl: result,
      reasoning: "User requested visual content or described an image idea",
      modelUsed: DEFAULT_MODEL.split("/").pop() || "image-model",
      executionTime,
    };
  }

  private async callReplicate(
    request: ImageGenerationRequest,
  ): Promise<string> {
    try {
      const output = await this.client.run(DEFAULT_MODEL, {
        input: {
          prompt: request.prompt,
        },
      });

      // Handle different response types from Replicate models
      let imageUrl: string;

      if (Array.isArray(output)) {
        // Handle ReadableStream response from stable-diffusion
        const stream: ReadableStream = output[0];
        const response = new Response(stream);

        // Get the image as binary data (Node.js compatible)
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = response.headers.get("content-type") || "image/png";

        // Store image and return Next.js API URL
        imageUrl = await this.storeImageAndGetUrl(buffer, mimeType);
      } else if ("url" in output && typeof output.url === "function") {
        imageUrl = output.url();
      } else {
        throw new Error("No valid image URL received from Replicate");
      }

      if (typeof imageUrl !== "string") {
        throw new Error("No valid image URL received from Replicate");
      }

      return imageUrl;
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
      throw new Error(`Image generation failed: ${originalMessage}`);
    }
  }

  private async storeImageAndGetUrl(
    buffer: Buffer,
    mimeType: string,
  ): Promise<string> {
    // Generate unique image ID
    const imageId = generateId();

    // Store image using shared imageStore
    storeImage(imageId, buffer, mimeType);

    // Return Next.js API URL
    return `/api/images/${imageId}`;
  }
}

// Image generation service that requires Replicate API token
export class ImageGenerationService implements IImageGenerationService {
  private replicateService: ReplicateImageGenerationService;

  constructor() {
    const apiKey = process.env.REPLICATE_API_TOKEN;

    if (apiKey === undefined) {
      throw new Error(
        "REPLICATE_API_TOKEN environment variable is required for image generation",
      );
    }

    this.replicateService = new ReplicateImageGenerationService();
  }

  async generateImage(request: ImageGenerationRequest): Promise<ToolResult> {
    return this.replicateService.generateImage(request);
  }
}
