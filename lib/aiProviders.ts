/**
 * AI Model Registry - Data-Driven Configuration
 * 
 * SINGLE SOURCE OF TRUTH for all AI models.
 * Adding a model here automatically makes it available throughout the app.
 * 
 * Architecture:
 * - Models identified by full modelId strings (e.g., 'Qwen/Qwen2.5-7B-Instruct')
 * - No conditional logic based on short names
 * - Provider metadata stored as data, not code branches
 */

import { createOpenAI } from '@ai-sdk/openai';
import { streamText, generateText } from 'ai';

/**
 * Model Configuration
 */
export interface ModelConfig {
  modelId: string;
  displayName?: string;
  maxOutputTokens?: number;
  temperature?: number;
}

export type AgentRole = 'architect' | 'profiler';

/**
 * Default models available in the system
 */
export const DEFAULT_MODELS: ModelConfig[] = [
  {
    modelId: 'Qwen/Qwen3.5-27B',
    displayName: 'Qwen/Qwen3.5-27B',
    maxOutputTokens: 300,
    temperature: 0.7,
  },
  // {
  //   modelId: 'meituan-longcat/LongCat-Flash-Lite',
  //   displayName: 'LongCat',
  //   maxOutputTokens: 300,
  //   temperature: 0.7,
  // },
  // {
  //   modelId: 'PaddlePaddle/ERNIE-4.5-0.3B-PT',
  //   displayName: 'PaddlePaddle',
  //   maxOutputTokens: 300,
  //   temperature: 0.7,
  // },
  // {
  //   modelId: 'ZhipuAI/GLM-4.7-Flash',
  //   displayName: 'GLM',
  //   maxOutputTokens: 400,
  //   temperature: 0.7,
  // },
  // {
  //     modelId: 'XiaomiMiMo/MiMo-V2-Flash',
  //     displayName: 'XiaoMiMo',
  //     maxOutputTokens: 300,
  //     temperature: 0.7,
  // },
];

/**
 * Dedicated model mappings for game agents.
 * Keep this separate from DEFAULT_MODELS so architect/profiler can evolve independently.
 */
export const AGENT_MODEL_MAP: Record<AgentRole, ModelConfig[]> = {
  architect: [
    {
      modelId: 'Qwen/Qwen3.5-27B',
      displayName: 'Qwen/Qwen3.5-27B',
      maxOutputTokens: 220,
      temperature: 0.85,
    },
  ],
  profiler: [
    {
      modelId: 'Qwen/Qwen3.5-27B',
      displayName: 'Qwen/Qwen3.5-27B',
      maxOutputTokens: 600,
      temperature: 0.2,
    },
    
  ],
};

/**
 * Provider interface for consistency
 */
interface StreamOptions {
  system: string;
  messages: any[];
  temperature?: number;
  maxOutputTokens?: number;
  onFinish?: (result: { text: string; finishReason: string }) => Promise<void>;
}

interface GenerateOptions {
  system: string;
  messages?: any[];
  prompt?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

/**
 * AI Model Provider - wraps a specific model
 */
export class AIModelProvider {
  public readonly modelId: string;
  public readonly config: ModelConfig;
  private client: ReturnType<typeof createOpenAI>;

  constructor(config: ModelConfig, apiKey: string, baseURL: string) {
    this.modelId = config.modelId;
    this.config = config;
    this.client = createOpenAI({
      apiKey,
      baseURL,
    });
  }

  /**
   * Stream text response (for chat interactions)
   */
  async stream(options: StreamOptions) {
    const model = this.client.chat(this.modelId);

    return streamText({
      model,
      system: options.system,
      messages: options.messages,
      temperature: options.temperature ?? this.config.temperature ?? 0.8,
      maxOutputTokens: options.maxOutputTokens ?? this.config.maxOutputTokens ?? 250,
      maxRetries: 1,
      onFinish: options.onFinish,
    });
  }

  /**
   * Generate text response (for non-streaming, e.g., prompt generation)
   */
  async generate(options: GenerateOptions): Promise<string> {
    const model = this.client.chat(this.modelId);

    // Use provided prompt if available, otherwise format messages into prompt
    const promptText = options.prompt || this.formatMessagesToPrompt(options.messages || []);

    const { text } = await generateText({
      model,
      system: options.system,
      prompt: promptText,
      temperature: options.temperature ?? this.config.temperature ?? 0.7,
      maxOutputTokens: options.maxOutputTokens ?? this.config.maxOutputTokens ?? 800,
      maxRetries: 1,
    });

    return text;
  }

  /**
   * Convert messages to a simple prompt string
   */
  private formatMessagesToPrompt(messages: any[]): string {
    if (!Array.isArray(messages) || messages.length === 0) {
      return '';
    }

    return messages
      .map((msg: any) => {
        if (typeof msg === 'object' && 'content' in msg) {
          const content =
            typeof msg.content === 'string'
              ? msg.content
              : Array.isArray(msg.content)
              ? msg.content.map((c: any) => (typeof c === 'object' && 'text' in c ? c.text : '')).join(' ')
              : '';
          return `${msg.role}: ${content}`;
        }
        return '';
      })
      .filter((line) => line.trim().length > 0)
      .join('\n');
  }

  /**
   * Get display name for UI
   */
  getDisplayName(): string {
    return this.config.displayName || this.modelId;
  }
}

/**
 * Create a single provider by modelId
 */
export function createProviderById(modelId: string): AIModelProvider | null {
  const config = DEFAULT_MODELS.find((m) => m.modelId === modelId);
  if (!config) {
    console.warn(`[Providers] Model ${modelId} not found in DEFAULT_MODELS`);
    return null;
  }
  const apiKey = process.env.MODELSCOPE_API_KEY;
  const baseURL = process.env.MODELSCOPE_BASE_URL;
  if (!apiKey || !baseURL) {
    console.warn('[Providers] ModelScope credentials not configured');
    return null;
  }
  return new AIModelProvider(config, apiKey, baseURL);
}

/**
 * Agent model registry to isolate Architect/Profiler model selection and validation.
 */
export class GameAgentProviderRegistry {
  static getModelConfigs(role: AgentRole): ModelConfig[] {
    const roleModels = AGENT_MODEL_MAP[role] || [];
    const resolved = roleModels
      .map((cfg) => DEFAULT_MODELS.find((m) => m.modelId === cfg.modelId))
      .filter((cfg): cfg is ModelConfig => Boolean(cfg))
      .filter((cfg, idx, arr) => arr.findIndex((x) => x.modelId === cfg.modelId) === idx);

    if (resolved.length === 0) {
      console.warn(`[AgentRegistry] No valid models configured for role ${role}; falling back to DEFAULT_MODELS`);
      return DEFAULT_MODELS;
    }

    return resolved;
  }

  static getDefaultModelId(role: AgentRole): string {
    const models = this.getModelConfigs(role);
    return models[0]?.modelId || DEFAULT_MODELS[0]?.modelId || 'deepseek-ai/DeepSeek-R1-0528';
  }

  static isSupportedModel(role: AgentRole, modelId: string): boolean {
    return this.getModelConfigs(role).some((m) => m.modelId === modelId);
  }

  static createProvider(role: AgentRole, requestedModelId?: string): AIModelProvider | null {
    const modelId =
      requestedModelId && this.isSupportedModel(role, requestedModelId)
        ? requestedModelId
        : this.getDefaultModelId(role);
    return createProviderById(modelId);
  }
}

/**
 * Create providers for all configured models
 * Data-driven: adding to DEFAULT_MODELS automatically creates a provider
 */
/*
export function createProviders(
  models: ModelConfig[] = DEFAULT_MODELS
): AIModelProvider[] {

 const  apiKey = process.env.MODELSCOPE_API_KEY;
  const  baseURL = process.env.MODELSCOPE_BASE_URL;
  
  if (!apiKey || !baseURL) {
    console.warn('[Providers] ModelScope credentials not configured');
    return [];
  }

  return models.map((config) => new AIModelProvider(config, apiKey, baseURL));
}
*/
/**
 * Unified character generation prompt template
 * Works for ALL models - no per-model variations
 */

export const UNIFIED_CHARACTER_PROMPT = `请**严格生成一个符合以下格式的JSON角色对象**。**仅输出纯JSON，不包含任何额外说明或注释**

JSON结构：{ "character": { id:number, name:string, avatar:string, status:'online', profile:{ nickname, gender, age, occupation, location, difficulty, interests[], personality, shortTags[] }, systemPrompt:string, starterMessage:string } }

关键要求：
1. 头像：**仅使用单个表情符号**（例如：🌸、🎨、🧑‍💻、☕、🚀、🌟）。禁止URL或多个表情符号。
2. 人物性格：创造独特、令人难忘的角色。包含生活化细节（"通常"、"我觉得"）和生动个人特征。**描述必须简洁（50-80个字符）**。
3. 难度：使用'简单'、'中等'或'困难'。'简单'角色增加轻松日常趣事；'困难'角色需更专业深度。
4. 系统提示：用1-3段文字指导AI如何真实扮演此角色（不暴露AI身份）。包含语气、风格、简洁度要求。**必须简洁**。
5. 开场白：1-2句话，符合角色性格。**必须简洁**。
6. 名称/标签：简短、聊天友好关键词。禁止Markdown或特殊转义。
每次生成需随机创建新角色。打造真实感强的个体：具体兴趣、生活细节、独特小习惯。背景、地点、性格需多样化。**所有描述保持简洁精炼**。`;
/*
 
export const UNIFIED_CHARACTER_PROMPT = `Generate exactly one character object in valid JSON. Output only pure JSON without any commentary. The format is very strictly enforced.

JSON shape: { "character": { id:number, name:string, avatar:string, status:'online', profile:{ nickname, gender, age, occupation, location, difficulty, interests[], personality, shortTags[] }, systemPrompt:string, starterMessage:string } }

CRITICAL REQUIREMENTS:
1. Avatar: Use ONLY a single emoji (e.g., 🌸, 🎨, 🧑‍💻, ☕, 🚀, 🌟). Never URLs or multiple emojis.
2. Personality: Create a distinct, memorable character. Include human-style details ("usually", "I think") and vivid personal touches that feel authentic. **Your statements should be concise (50-80 characters).**
3. Difficulty: Use 'easy', 'medium', or 'hard'. For 'easy', add more casual anecdotes. For 'hard', be more sophisticated.
4. System Prompt: Write 1-3 paragraphs instructing the AI how to roleplay as this character authentically without revealing AI nature. Include tone, style, verbosity guidelines. **Be concise.**
5. Starter Message: Write 1-2 sentences that match the character's personality. **Be concise.**
6. Names/Tags: Short, chat-friendly keywords. No markdown or special escaping.

Generate a unique, randomized profile each time. Make it feel like a real person with specific interests and quirks. Be creative and diverse in backgrounds, locations, and personalities.` ;
*/