import { generateId } from "@/lib/utils";
import { ClarificationService } from "@/services/clarification";
import { ImageGenerationService } from "@/services/image-generation";
import { TextGenerationService } from "@/services/text-generation";
import { ToolRouter } from "@/services/tool-router";
import { ActionLog, ChatMessage } from "@/types/chat";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Request validation schema
const chatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  context: z.object({
    messages: z.array(
      z.object({
        id: z.string(),
        role: z.enum(["user", "assistant"]),
        content: z.string(),
        timestamp: z.string().transform((str) => new Date(str)),
        imageUrl: z.string().optional(),
        actionLog: z
          .object({
            toolUsed: z.enum([
              "text-generation",
              "image-generation",
              "clarification",
            ]),
            reasoning: z.string(),
            input: z.string(),
            output: z.string(),
            modelUsed: z.string().optional(),
            executionTime: z.number().optional(),
          })
          .optional(),
      }),
    ),
    sessionId: z.string(),
    lastUserIntent: z.enum(["text", "image", "unclear"]).optional(),
  }),
});

// Initialize services
function createServices() {
  try {
    const textService = new TextGenerationService();
    const imageService = new ImageGenerationService();
    const clarificationService = new ClarificationService();

    return new ToolRouter(textService, imageService, clarificationService);
  } catch (error) {
    // If services can't be initialized (missing API token), throw descriptive error
    const errorMessage =
      error instanceof Error ? error.message : "Service initialization failed";
    throw new Error(`Failed to initialize AI services: ${errorMessage}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const validatedRequest = chatRequestSchema.parse(body);

    const router = createServices();

    // Execute the tool routing and generation
    const result = await router.routeAndExecute(
      validatedRequest.message,
      validatedRequest.context,
    );

    // Create action log
    const actionLog: ActionLog = {
      toolUsed: result.type,
      reasoning: result.reasoning,
      input: validatedRequest.message,
      output: result.content,
      modelUsed: result.modelUsed,
      executionTime: result.executionTime,
    };

    // Create assistant message
    const assistantMessage: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content: result.content,
      timestamp: new Date(),
      imageUrl: result.imageUrl,
      actionLog,
    };

    return NextResponse.json({
      success: true,
      message: assistantMessage,
    });
  } catch (error) {
    console.error("API Error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request format",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      // Don't expose internal errors in production
      const isDevelopment = process.env.NODE_ENV === "development";

      return NextResponse.json(
        {
          success: false,
          error: isDevelopment ? error.message : "Internal server error",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      replicate: process.env.REPLICATE_API_TOKEN ? "configured" : "missing",
    },
  });
}
