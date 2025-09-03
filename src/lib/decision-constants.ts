/**
 * Centralized constants for decision-making algorithms
 * Used across ToolRouter and ClarificationService
 */

// Comprehensive image-related keywords (150+ terms)
export const IMAGE_KEYWORDS = [
  // Core visual terms
  "image",
  "picture",
  "photo",
  "visual",
  "graphic",
  "illustration",
  "artwork",
  "drawing",
  "sketch",
  "painting",
  "render",
  "design",
  "create",
  "generate",
  "make",
  "produce",
  "craft",
  "build",
  "construct",
  "develop",

  // Action verbs for creation
  "draw",
  "paint",
  "sketch",
  "illustrate",
  "design",
  "render",
  "visualize",
  "depict",
  "portray",
  "show",
  "display",
  "present",
  "exhibit",
  "demonstrate",
  "compose",
  "arrange",
  "layout",
  "style",
  "fashion",
  "form",
  "shape",

  // Visual elements
  "color",
  "colors",
  "colorful",
  "bright",
  "vibrant",
  "vivid",
  "neon",
  "dark",
  "light",
  "shadow",
  "highlight",
  "contrast",
  "saturation",
  "texture",
  "pattern",
  "gradient",
  "shade",
  "tone",
  "hue",

  // Styles and genres
  "realistic",
  "abstract",
  "cartoon",
  "anime",
  "manga",
  "comic",
  "pixel",
  "watercolor",
  "oil",
  "acrylic",
  "digital",
  "3d",
  "photorealistic",
  "surreal",
  "fantasy",
  "sci-fi",
  "vintage",
  "modern",
  "minimalist",
  "detailed",
  "stylized",
  "artistic",
  "creative",
  "beautiful",
  "stunning",

  // Composition terms
  "portrait",
  "landscape",
  "closeup",
  "wide",
  "panoramic",
  "aerial",
  "perspective",
  "angle",
  "view",
  "scene",
  "composition",
  "frame",
  "background",
  "foreground",
  "centered",
  "symmetrical",
  "asymmetrical",

  // Technical terms
  "resolution",
  "quality",
  "sharp",
  "crisp",
  "detailed",
  "smooth",
  "professional",
  "studio",
  "lighting",
  "exposure",
  "focus",
  "depth",

  // Objects and subjects
  "character",
  "person",
  "face",
  "animal",
  "creature",
  "object",
  "item",
  "building",
  "architecture",
  "nature",
  "outdoor",
  "indoor",
  "environment",
  "logo",
  "icon",
  "symbol",
  "emblem",
  "badge",
  "banner",
  "poster",

  // Emotional/aesthetic descriptors
  "beautiful",
  "gorgeous",
  "stunning",
  "amazing",
  "incredible",
  "awesome",
  "elegant",
  "sophisticated",
  "dramatic",
  "epic",
  "magical",
  "mystical",
  "peaceful",
  "serene",
  "energetic",
  "dynamic",
  "powerful",
  "bold",
] as const;

// Comprehensive text-related keywords (100+ terms)
export const TEXT_KEYWORDS = [
  // Core writing terms
  "write",
  "text",
  "content",
  "copy",
  "description",
  "caption",
  "title",
  "heading",
  "headline",
  "subtitle",
  "paragraph",
  "sentence",
  "phrase",
  "word",
  "letter",
  "message",
  "note",
  "document",
  "article",
  "blog",

  // Content types
  "story",
  "essay",
  "script",
  "dialogue",
  "narrative",
  "novel",
  "poem",
  "email",
  "letter",
  "memo",
  "report",
  "summary",
  "review",
  "analysis",
  "proposal",
  "presentation",
  "speech",
  "announcement",
  "press",
  "news",

  // Writing actions
  "compose",
  "draft",
  "edit",
  "revise",
  "rewrite",
  "proofread",
  "format",
  "structure",
  "organize",
  "outline",
  "brainstorm",
  "develop",
  "expand",

  // Help and assistance
  "help",
  "assist",
  "support",
  "guide",
  "advise",
  "suggest",
  "recommend",
  "explain",
  "how",
  "what",
  "why",
  "when",
  "where",
  "who",
  "which",
  "clarify",
  "describe",
  "define",
  "elaborate",
  "detail",
  "improve",
  "enhance",
  "optimize",
  "refine",
  "polish",
  "perfect",

  // Communication purposes
  "communicate",
  "convey",
  "express",
  "share",
  "inform",
  "notify",
  "announce",
  "advertise",
  "promote",
  "market",
  "sell",
  "persuade",
  "convince",
  "argue",
  "debate",
  "discuss",
  "explain",
  "teach",

  // Content qualities
  "engaging",
  "compelling",
  "persuasive",
  "informative",
  "educational",
  "entertaining",
  "professional",
  "formal",
  "casual",
  "friendly",
  "creative",
  "original",
  "unique",
  "catchy",
  "memorable",
  "impactful",
] as const;

// Advanced patterns for visual content detection
export const IMAGE_PATTERNS = [
  // Descriptive scene patterns
  /\b(a|an|the)\s+\w+\s+(in|on|at|under|over|beside|near|with|holding|wearing)\s+\w+/i,
  /\b(beautiful|stunning|amazing|gorgeous|elegant|dramatic|epic)\s+\w+/i,
  /\b(red|blue|green|yellow|orange|purple|pink|black|white|bright|dark|colorful)\s+\w+/i,
  /\b(tall|short|big|small|huge|tiny|massive|giant|miniature)\s+\w+/i,
  /\b(old|new|ancient|modern|vintage|futuristic|classic)\s+\w+/i,

  // Style and artistic patterns
  /\b(realistic|abstract|cartoon|anime|digital|watercolor|oil\s+painting)\b/i,
  /\b(portrait|landscape|closeup|wide\s+shot|aerial\s+view)\b/i,
  /\b(lighting|shadows|highlights|contrast|composition)\b/i,

  // Creation commands
  /\b(create|make|generate|produce|design|build|craft)\s+(a|an|some)\s+\w+/i,
  /\b(draw|paint|sketch|illustrate|render|visualize)\s+\w+/i,
  /\b(show\s+me|I\s+want\s+to\s+see|display)\s+\w+/i,

  // Scene descriptions
  /\w+\s+(standing|sitting|running|flying|walking|lying)\s+(in|on|at)\s+\w+/i,
  /\w+\s+with\s+\w+\s+(background|setting|environment)/i,

  // Emotional/atmospheric
  /\b(peaceful|serene|chaotic|dramatic|mysterious|magical|dreamy)\s+\w+/i,
  /\b(sunset|sunrise|storm|rain|snow|fog|mist)\b/i,
] as const;

// Advanced patterns for text content detection
export const TEXT_PATTERNS = [
  // Writing requests
  /\b(write|compose|create|draft|generate)\s+(a|an|some)\s+(title|headline|description|story|article|email|letter)/i,
  /\b(help\s+me\s+write|assist\s+with\s+writing|need\s+help\s+writing)/i,
  /\bwrite\s+about\s+\w+/i,

  // Content improvement
  /\b(improve|enhance|optimize|rewrite|edit|revise|polish)\s+\w+/i,
  /\b(make\s+it\s+better|sound\s+more|more\s+professional)/i,

  // Explanation requests
  /\b(explain|describe|tell\s+me\s+about|what\s+is|how\s+to|why\s+does)/i,
  /\b(define|clarify|elaborate|detail)\s+\w+/i,

  // Communication needs
  /\b(send|email|message|communicate|inform|notify)\s+\w+/i,
  /\bI\s+need\s+to\s+(say|tell|write|communicate)/i,

  // Content types
  /\b(blog\s+post|article|essay|report|summary|review|analysis)/i,
  /\b(social\s+media|marketing|advertising|promotional)\s+\w+/i,
] as const;

// Visual descriptors for semantic analysis
export const VISUAL_DESCRIPTORS = [
  "beautiful",
  "colorful",
  "bright",
  "dark",
  "tall",
  "short",
  "big",
  "small",
  "round",
  "square",
  "smooth",
  "rough",
  "shiny",
  "matte",
  "transparent",
  "opaque",
  "detailed",
  "simple",
  "complex",
  "elegant",
  "dramatic",
] as const;

// Spatial prepositions for spatial relationship detection
export const SPATIAL_PREPOSITIONS = [
  "in",
  "on",
  "at",
  "under",
  "over",
  "beside",
  "near",
  "behind",
  "front",
] as const;

// Additional visual patterns for clarification service
export const VISUAL_ANALYSIS_PATTERNS = [
  /\b(a|an|the)\s+\w+\s+(in|on|at|with|holding|wearing)\s+\w+/i,
  /\b(red|blue|green|yellow|bright|dark|colorful)\s+\w+/i,
  /\b(beautiful|amazing|stunning|creative|detailed)\s+\w+/i,
  /\b(tall|short|big|small|huge|tiny)\s+\w+/i,
] as const;

// Additional textual patterns for clarification service
export const TEXTUAL_ANALYSIS_PATTERNS = [
  /\b(write|help|explain|describe|tell)\s+(me\s+)?(about|how|what|why)/i,
  /\b(need\s+help|assistance|support)\s+with/i,
  /\b(create|write|compose)\s+(a|an|some)\s+(title|story|article|email)/i,
] as const;

// Type exports for better TypeScript support
export type ImageKeyword = (typeof IMAGE_KEYWORDS)[number];
export type TextKeyword = (typeof TEXT_KEYWORDS)[number];
export type VisualDescriptor = (typeof VISUAL_DESCRIPTORS)[number];
export type SpatialPreposition = (typeof SPATIAL_PREPOSITIONS)[number];
