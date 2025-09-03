import { ClarificationRequest, ToolResult } from "@/types/chat";
import {
  IMAGE_KEYWORDS,
  TEXT_KEYWORDS,
  VISUAL_ANALYSIS_PATTERNS,
  TEXTUAL_ANALYSIS_PATTERNS,
} from "@/lib/decision-constants";

export interface IClarificationService {
  requestClarification(request: ClarificationRequest): Promise<ToolResult>;
}

export class ClarificationService implements IClarificationService {
  async requestClarification(
    request: ClarificationRequest,
  ): Promise<ToolResult> {
    const analysis = this.analyzeInput(request.userInput);
    const suggestions = this.generateAdvancedSuggestions(
      request.userInput,
      analysis,
    );
    const clarificationMessage = this.buildDetailedClarificationMessage(
      suggestions,
      analysis,
    );

    return {
      type: "clarification",
      content: clarificationMessage,
      reasoning: `Input analysis: ${analysis.confidence < 0.3 ? "very ambiguous" : analysis.confidence < 0.6 ? "somewhat unclear" : "moderately clear"} (${(analysis.confidence * 100).toFixed(1)}% confidence)`,
      modelUsed: "enhanced-clarification-engine",
      executionTime: 75,
    };
  }

  private analyzeInput(userInput: string): {
    confidence: number;
    likelyIntent: string;
    keywords: string[];
  } {
    const input = userInput.toLowerCase();
    const length = input.length;

    const imageKeywordMatches = IMAGE_KEYWORDS.filter((keyword) =>
      input.includes(keyword),
    );
    const textKeywordMatches = TEXT_KEYWORDS.filter((keyword) =>
      input.includes(keyword),
    );

    // Advanced patterns for better analysis
    const visualPatternCount = VISUAL_ANALYSIS_PATTERNS.filter((pattern) =>
      pattern.test(input),
    ).length;
    const textualPatternCount = TEXTUAL_ANALYSIS_PATTERNS.filter((pattern) =>
      pattern.test(input),
    ).length;

    // Calculate confidence and likely intent
    let confidence = 0;
    let likelyIntent = "unclear";
    let allKeywords: string[] = [];

    if (
      imageKeywordMatches.length > textKeywordMatches.length ||
      visualPatternCount > textualPatternCount
    ) {
      confidence = Math.min(
        0.8,
        imageKeywordMatches.length * 0.2 +
          visualPatternCount * 0.3 +
          (length > 20 ? 0.2 : 0),
      );
      likelyIntent = "visual";
      allKeywords = imageKeywordMatches;
    } else if (
      textKeywordMatches.length > imageKeywordMatches.length ||
      textualPatternCount > visualPatternCount
    ) {
      confidence = Math.min(
        0.8,
        textKeywordMatches.length * 0.2 +
          textualPatternCount * 0.3 +
          (length < 50 ? 0.2 : 0),
      );
      likelyIntent = "textual";
      allKeywords = textKeywordMatches;
    } else {
      confidence = Math.max(0.1, Math.min(0.4, length / 100));
      likelyIntent = length > 30 ? "possibly visual" : "possibly textual";
      allKeywords = [...imageKeywordMatches, ...textKeywordMatches];
    }

    return { confidence, likelyIntent, keywords: allKeywords };
  }

  private generateAdvancedSuggestions(
    userInput: string,
    analysis: ReturnType<typeof this.analyzeInput>,
  ): string[] {
    const input = userInput.toLowerCase();
    const suggestions: string[] = [];

    // Context-aware suggestions based on analysis
    if (analysis.likelyIntent.includes("visual")) {
      suggestions.push(
        'Try: "Create a detailed image of [subject] in [setting] with [style]"',
        'Example: "A majestic lion in a savanna at sunset, photorealistic style"',
        'Or: "Design a colorful cartoon character wearing [clothing] in [environment]"',
      );
    } else if (analysis.likelyIntent.includes("textual")) {
      suggestions.push(
        'Try: "Write a [type] about [topic] for [audience]"',
        'Example: "Help me write an engaging email subject line for a product launch"',
        'Or: "Create a compelling description for [your specific need]"',
      );
    } else {
      // Ambiguous input - provide both options with clear distinctions
      suggestions.push(
        '🎨 **For Image Creation**: "Create/Draw/Generate [detailed visual description]"',
        '✍️ **For Text Help**: "Write/Help me with/Compose [specific text type]"',
        "💡 **Be Specific**: Include details about style, purpose, audience, or visual elements",
      );
    }

    // Length-based suggestions
    if (input.length < 5) {
      suggestions.push(
        "📝 **Too Brief**: Please provide more details about what you need",
        "🎯 **Be Specific**: What type of content are you looking for?",
      );
    } else if (input.length > 100 && analysis.confidence < 0.6) {
      suggestions.push(
        "🔍 **Clarify Intent**: Your description is detailed but I need to know if you want an image or text",
        '✨ **Choose One**: Add "create an image of" or "write about" to clarify your intent',
      );
    }

    // Keyword-based specific suggestions
    if (analysis.keywords.length > 0) {
      const keywordHint = analysis.keywords.slice(0, 3).join(", ");
      suggestions.push(
        `🔑 **Detected Keywords**: ${keywordHint} - ${analysis.likelyIntent.includes("visual") ? "this suggests image creation" : "this suggests text generation"}`,
      );
    }

    return suggestions.slice(0, 4); // Limit to most relevant suggestions
  }

  private buildDetailedClarificationMessage(
    suggestions: string[],
    analysis: ReturnType<typeof this.analyzeInput>,
  ): string {
    const baseMessage =
      "I'd love to help you create something amazing! However, I need a bit more clarity to provide exactly what you're looking for.";

    let intentMessage = "";
    if (analysis.confidence > 0.5) {
      intentMessage = `\n\n🤔 **My Analysis**: Based on your input, you ${analysis.likelyIntent.includes("visual") ? "likely want visual content" : analysis.likelyIntent.includes("textual") ? "likely want text content" : "might want either visual or text content"} (${(analysis.confidence * 100).toFixed(0)}% confidence).`;
    } else {
      intentMessage =
        "\n\n🤔 **Unclear Intent**: I'm not sure whether you want me to create an image or generate text content.";
    }

    if (suggestions.length === 0) {
      return `${baseMessage}${intentMessage}\n\nCould you please be more specific about:\n• What type of content you need (image or text)\n• The subject matter or topic\n• The style or format you prefer`;
    }

    const suggestionList = suggestions
      .map((suggestion) => `${suggestion}`)
      .join("\n\n");

    return `${baseMessage}${intentMessage}\n\n**💡 Here's how to get better results:**\n\n${suggestionList}\n\n---\n\n**🚀 Pro Tip**: The more specific you are, the better I can help you create exactly what you envision!`;
  }
}
