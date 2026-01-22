/**
 * Unified AI Model Provider
 * 
 * DATA-DRIVEN ENCAPSULATION PATTERN:
 * All models are configured via DEFAULT_MODELS array. Adding a new model
 * to this array automatically creates a chatbot for it.
 * 
 * Core Design:
 * 1. Single source of truth: modelId strings (e.g., 'Qwen/Qwen2.5-7B-Instruct')
 * 2. No conditional logic on model names - fully data-driven
 * 3. Provider metadata stored in config objects
 * 4. Automatic provider instantiation from config
 */

import { createOpenAI } from '@ai-sdk/openai';
import { streamText, generateText } from 'ai';

/**
 * Model configuration object
 */
export interface ModelConfig {
  modelId: string;              // Full model ID (e.g., 'Qwen/Qwen2.5-7B-Instruct')
  maxOutputTokens?: number;     // Optional per-model token limit
  temperature?: number;         // Optional per-model temperature
}

/**
 * Default models configuration
 * Add models here to automatically create chatbots for them
 */
export const DEFAULT_MODELS: ModelConfig[] = [
  { 
    modelId: 'Qwen/Qwen2.5-7B-Instruct',
    maxOutputTokens: 400,
    temperature: 0.7
  },
  { 
    modelId: 'deepseek-ai/DeepSeek-R1-0528',
    maxOutputTokens: 400,
    temperature: 0.7
  },
];

interface AIProviderConfig {
  apiKey: string;
  baseUrl: string;
}

interface StreamOptions {
  system: string;
  messages: any[];
  temperature?: number;
  maxOutputTokens?: number;
}

interface GenerateOptions {
  system: string;
  messages: any[];
  prompt?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

/**
 * AIModelProvider - Unified interface for any model
 */
export class AIModelProvider {
  private modelConfig: ModelConfig;
  client: ReturnType<typeof createOpenAI>;
  private config: AIProviderConfig;

  constructor(modelConfig: ModelConfig, providerConfig: AIProviderConfig) {
    this.modelConfig = modelConfig;
    this.config = providerConfig;
    this.client = createOpenAI({
      apiKey: providerConfig.apiKey,
      baseURL: providerConfig.baseUrl,
    });
  }

  /**
   * Get the model ID for this provider
   */
  getModelId(): string {
    return this.modelConfig.modelId;
  }

  /**
   * Get model configuration
   */
  getConfig(): ModelConfig {
    return this.modelConfig;
  }

  /**
   * Stream text response (for chat interactions)
   */
  async stream(options: StreamOptions & { onFinish?: (result: { text: string; finishReason: string }) => Promise<void> }) {
    const model = this.client.chat(this.modelConfig.modelId);

    return streamText({
      model,
      system: options.system,
      messages: options.messages,
      temperature: options.temperature ?? this.modelConfig.temperature ?? 0.8,
      maxOutputTokens: options.maxOutputTokens ?? this.modelConfig.maxOutputTokens ?? 250,
      onFinish: options.onFinish,
    });
  }

  /**
   * Generate text response (for non-streaming, e.g., prompt generation)
   */
  async generate(options: GenerateOptions): Promise<string> {
    const model = this.client.chat(this.modelConfig.modelId);

    // Use provided prompt if available, otherwise format messages into prompt
    const promptText = options.prompt || this.formatMessagesToPrompt(options.messages);

    const { text } = await generateText({
      model,
      system: options.system,
      prompt: promptText,
      temperature: options.temperature ?? this.modelConfig.temperature ?? 0.7,
      maxOutputTokens: options.maxOutputTokens ?? this.modelConfig.maxOutputTokens ?? 800,
    });

    return text;
  }

  /**
   * Convert messages to a simple prompt string for generateText
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
}

/**
 * Create AI providers for configured models
 * @param models - Array of model configurations (defaults to DEFAULT_MODELS)
 * @returns Map of modelId to AIModelProvider
 */
export function createProviders(
  models: ModelConfig[] = DEFAULT_MODELS
): Map<string, AIModelProvider> {
  const providers = new Map<string, AIModelProvider>();

  const apiKey = process.env.MODELSCOPE_API_KEY;
  const baseUrl = process.env.MODELSCOPE_BASE_URL;

  if (!apiKey || !baseUrl) {
    console.warn('[AIProvider] MODELSCOPE credentials not configured');
    return providers;
  }

  const providerConfig: AIProviderConfig = { apiKey, baseUrl };

  for (const modelConfig of models) {
    try {
      const provider = new AIModelProvider(modelConfig, providerConfig);
      providers.set(modelConfig.modelId, provider);
      console.log(`[AIProvider] Created provider for: ${modelConfig.modelId}`);
    } catch (error) {
      console.error(`[AIProvider] Failed to create provider for ${modelConfig.modelId}:`, error);
    }
  }

  return providers;
}

/**
 * Create a single AI provider by model ID
 * @param modelId - Full model ID string
 * @returns AIModelProvider instance or null if failed
 */
export function createAIProvider(modelId: string): AIModelProvider | null {
  const modelConfig = DEFAULT_MODELS.find(m => m.modelId === modelId);
  
  if (!modelConfig) {
    console.error(`[AIProvider] Model ${modelId} not found in DEFAULT_MODELS`);
    return null;
  }

  const apiKey = process.env.MODELSCOPE_API_KEY;
  const baseUrl = process.env.MODELSCOPE_BASE_URL;

  if (!apiKey || !baseUrl) {
    console.warn('[AIProvider] MODELSCOPE credentials not configured');
    return null;
  }

  try {
    return new AIModelProvider(modelConfig, { apiKey, baseUrl });
  } catch (error) {
    console.error(`[AIProvider] Failed to create provider for ${modelId}:`, error);
    return null;
  }
}
