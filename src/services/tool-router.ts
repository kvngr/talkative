import {
  ToolDecision,
  ConversationContext,
  ToolResult,
  TextGenerationRequest,
  ImageGenerationRequest,
  ClarificationRequest,
} from "@/types/chat";
import { ITextGenerationService } from "./text-generation";
import { IImageGenerationService } from "./image-generation";
import { IClarificationService } from "./clarification";
import {
  IMAGE_KEYWORDS,
  TEXT_KEYWORDS,
  IMAGE_PATTERNS,
  TEXT_PATTERNS,
  VISUAL_DESCRIPTORS,
  SPATIAL_PREPOSITIONS,
} from "@/lib/decision-constants";

export interface IToolRouter {
  routeAndExecute(
    userInput: string,
    context: ConversationContext,
  ): Promise<ToolResult>;
}

type DecisionFactors = {
  keywordScore: number;
  patternScore: number;
  semanticScore: number;
  contextScore: number;
  lengthScore: number;
  finalConfidence: number;
};

export class ToolRouter implements IToolRouter {
  constructor(
    private textService: ITextGenerationService,
    private imageService: IImageGenerationService,
    private clarificationService: IClarificationService,
  ) {}

  async routeAndExecute(
    userInput: string,
    context: ConversationContext,
  ): Promise<ToolResult> {
    const decision = this.decideToolToUse(userInput, context);

    switch (decision.tool) {
      case "text-generation":
        return this.executeTextGeneration(userInput, context);

      case "image-generation":
        return this.executeImageGeneration(userInput, context);

      case "clarification":
        return this.executeClarification(userInput);

      default:
        return this.executeClarification(userInput);
    }
  }

  private decideToolToUse(
    userInput: string,
    context: ConversationContext,
  ): ToolDecision {
    const input = userInput.toLowerCase().trim();

    // Early return for very short input
    if (input.length < 2) {
      return {
        tool: "clarification",
        confidence: 0.95,
        reasoning: "Input too short to determine intent",
      };
    }

    // Calculate multiple decision factors
    const factors = this.calculateDecisionFactors(input, context);

    // Multi-criteria decision making
    const imageScore = this.calculateImageScore(factors);
    const textScore = this.calculateTextScore(factors);

    const CONFIDENCE_THRESHOLD = 0.75; // Lowered from 0.85
    const STRONG_THRESHOLD = 0.65; // Lowered from 0.75

    if (imageScore > textScore) {
      if (imageScore >= CONFIDENCE_THRESHOLD) {
        return {
          tool: "image-generation",
          confidence: Math.min(0.95, imageScore),
          reasoning: `Strong visual intent detected (score: ${imageScore.toFixed(2)})`,
        };
      } else if (imageScore >= STRONG_THRESHOLD) {
        return {
          tool: "image-generation",
          confidence: imageScore,
          reasoning: `Visual content indicated by multiple signals`,
        };
      }
    } else {
      if (textScore >= CONFIDENCE_THRESHOLD) {
        return {
          tool: "text-generation",
          confidence: Math.min(0.95, textScore),
          reasoning: `Strong text generation intent (score: ${textScore.toFixed(2)})`,
        };
      } else if (textScore >= STRONG_THRESHOLD) {
        return {
          tool: "text-generation",
          confidence: textScore,
          reasoning: `Text content indicated by multiple signals`,
        };
      }
    }

    // Fallback for ambiguous input
    const maxScore = Math.max(imageScore, textScore);
    if (maxScore < 0.6) {
      return {
        tool: "clarification",
        confidence: 0.9,
        reasoning: `Ambiguous input - max confidence only ${maxScore.toFixed(2)}`,
      };
    }

    // Default to higher scoring tool
    return imageScore > textScore
      ? {
          tool: "image-generation",
          confidence: imageScore,
          reasoning: `Slight preference for visual content (${imageScore.toFixed(2)} vs ${textScore.toFixed(2)})`,
        }
      : {
          tool: "text-generation",
          confidence: textScore,
          reasoning: `Slight preference for text content (${textScore.toFixed(2)} vs ${imageScore.toFixed(2)})`,
        };
  }

  private calculateDecisionFactors(
    input: string,
    context: ConversationContext,
  ): DecisionFactors {
    // 1. Keyword scoring - FIXED: Better ratio calculation
    const imageKeywordCount = IMAGE_KEYWORDS.filter((keyword) =>
      input.includes(keyword),
    ).length;
    const textKeywordCount = TEXT_KEYWORDS.filter((keyword) =>
      input.includes(keyword),
    ).length;

    // Fixed scoring: Direct ratio with strong bias for clear signals
    let keywordScore = 0.5; // Neutral baseline
    if (imageKeywordCount > 0 || textKeywordCount > 0) {
      // Strong preference when keywords are found
      keywordScore = imageKeywordCount / (imageKeywordCount + textKeywordCount);
      // Boost confidence for clear signals
      if (imageKeywordCount > 0 && textKeywordCount === 0) {
        keywordScore = Math.min(0.95, 0.8 + imageKeywordCount * 0.1);
      } else if (textKeywordCount > 0 && imageKeywordCount === 0) {
        keywordScore = Math.max(0.05, 0.2 - textKeywordCount * 0.1);
      }
    }

    // 2. Pattern scoring - FIXED: Better ratio calculation
    const imagePatternMatches = IMAGE_PATTERNS.filter((pattern) =>
      pattern.test(input),
    ).length;
    const textPatternMatches = TEXT_PATTERNS.filter((pattern) =>
      pattern.test(input),
    ).length;

    let patternScore = 0.5; // Neutral baseline
    if (imagePatternMatches > 0 || textPatternMatches > 0) {
      patternScore =
        imagePatternMatches / (imagePatternMatches + textPatternMatches);
      // Boost confidence for clear pattern matches
      if (imagePatternMatches > 0 && textPatternMatches === 0) {
        patternScore = Math.min(0.95, 0.8 + imagePatternMatches * 0.1);
      } else if (textPatternMatches > 0 && imagePatternMatches === 0) {
        patternScore = Math.max(0.05, 0.2 - textPatternMatches * 0.1);
      }
    }

    // 3. Semantic analysis (word density and structure)
    const semanticScore = this.analyzeSemanticStructure(input);

    // 4. Context scoring
    const contextScore = this.calculateContextScore(context);

    // 5. Length-based scoring
    const lengthScore = this.calculateLengthScore(input);

    return {
      keywordScore,
      patternScore,
      semanticScore,
      contextScore,
      lengthScore,
      finalConfidence: 0,
    };
  }

  private calculateImageScore(factors: DecisionFactors): number {
    // FIXED: Better weighting for clearer decisions
    const weights = {
      keyword: 0.4, // Increased weight for clearer decisions
      pattern: 0.3, // Increased weight for clearer decisions
      semantic: 0.15,
      context: 0.1,
      length: 0.05,
    };

    return Math.min(
      0.98,
      factors.keywordScore * weights.keyword +
        factors.patternScore * weights.pattern +
        factors.semanticScore * weights.semantic +
        factors.contextScore * weights.context +
        factors.lengthScore * weights.length,
    );
  }

  private calculateTextScore(factors: DecisionFactors): number {
    // FIXED: Proper text scoring logic
    const weights = {
      keyword: 0.4, // Increased weight for clearer decisions
      pattern: 0.3, // Increased weight for clearer decisions
      semantic: 0.15,
      context: 0.1,
      length: 0.05,
    };

    // FIXED: Correct calculation - text score should be INVERSE of image signals
    const textKeywordScore = 1 - factors.keywordScore;
    const textPatternScore = 1 - factors.patternScore;
    const textSemanticScore = 1 - factors.semanticScore;
    const textContextScore = 1 - factors.contextScore;
    const textLengthScore = 1 - factors.lengthScore;

    return Math.min(
      0.98,
      textKeywordScore * weights.keyword +
        textPatternScore * weights.pattern +
        textSemanticScore * weights.semantic +
        textContextScore * weights.context +
        textLengthScore * weights.length,
    );
  }

  private analyzeSemanticStructure(input: string): number {
    // Analyze the semantic structure to determine visual vs textual intent

    // Check for visual adjectives and descriptors

    const descriptorCount = VISUAL_DESCRIPTORS.filter((desc) =>
      input.includes(desc),
    ).length;

    // Check sentence structure - visual descriptions tend to be more descriptive
    const words = input.split(/\s+/);
    const adjectiveRatio = descriptorCount / words.length;

    // Check for visual prepositions that suggest spatial relationships
    const spatialCount = SPATIAL_PREPOSITIONS.filter((prep) =>
      input.includes(` ${prep} `),
    ).length;

    // Combine factors - higher values suggest visual content
    return Math.min(
      1.0,
      adjectiveRatio * 2 + spatialCount * 0.1 + descriptorCount * 0.05,
    );
  }

  private calculateContextScore(context: ConversationContext): number {
    if (context.messages.length === 0) {
      return 0.5;
    }

    const recentMessages = context.messages.slice(-3);
    let imageContext = 0;
    let textContext = 0;

    for (const message of recentMessages) {
      if (message.actionLog?.toolUsed === "image-generation") {
        imageContext += 1;
      } else if (message.actionLog?.toolUsed === "text-generation") {
        textContext += 1;
      }
    }

    return imageContext / (imageContext + textContext + 1);
  }

  private calculateLengthScore(input: string): number {
    // Longer descriptive text often suggests image generation
    // Shorter queries often suggest text help
    const length = input.length;

    if (length < 10) {
      return 0.2; // Short = likely text help
    }
    if (length < 30) {
      return 0.4; // Medium-short = neutral
    }
    if (length < 60) {
      return 0.6; // Medium = slight image bias
    }
    if (length < 100) {
      return 0.8; // Long = likely descriptive image
    }
    return 0.9; // Very long = almost certainly image description
  }

  private async executeTextGeneration(
    userInput: string,
    context: ConversationContext,
  ): Promise<ToolResult> {
    const contextMessages = this.extractContextMessages(context);

    const request: TextGenerationRequest = {
      prompt: userInput,
      context: contextMessages,
    };

    return this.textService.generateText(request);
  }

  private async executeImageGeneration(
    userInput: string,
    context: ConversationContext,
  ): Promise<ToolResult> {
    const previousImageUrl = this.findPreviousImageUrl(context);

    const request: ImageGenerationRequest = {
      prompt: userInput,
      previousImageUrl,
    };

    return this.imageService.generateImage(request);
  }

  private async executeClarification(userInput: string): Promise<ToolResult> {
    const request: ClarificationRequest = {
      userInput,
      suggestions: [],
    };

    return this.clarificationService.requestClarification(request);
  }

  private extractContextMessages(context: ConversationContext): string[] {
    return context.messages
      .slice(-6)
      .map((msg) => `${msg.role}: ${msg.content}`)
      .filter((content) => content.length > 0);
  }

  private findPreviousImageUrl(
    context: ConversationContext,
  ): string | undefined {
    return context.messages.findLast(
      (message) => message.imageUrl !== undefined,
    )?.imageUrl;
  }
}
