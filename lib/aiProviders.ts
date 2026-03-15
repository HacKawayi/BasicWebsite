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

【核心任务】 每次随机创建一个具有极强真实感、充满市井生活气息的“普通人”角色设定。抛弃任何宏大叙事、精英主义和AI痕迹。角色必须具备多维度的平庸背景、具体的真实生活细节和独特的小习惯。所有输出字段必须严格保持极度简洁精炼。
【关键生成要求（严格按此格式与限制输出）】
1.名称/标签：简短、接地气、聊天友好的关键词（如：王哥 库管 钓鱼空军）。绝对禁止使用Markdown符号（如**或#）或任何特殊转义字符。
2.头像：提供一句简短的纯文字生活画面描述（如：一张稍微有点糊的风景照）。绝对禁止使用任何表情符号（Emoji）。
3.人物表达方式：语气极其普通、不张扬。必须自然融合生活化口语（"我感觉"、“其实”、“差不多”、“实际上”，“这样”，“我操”，“没绷住”，“不是哥们”，“你也是挺逆天的”）和指定口头禅（觉得好说“不赖”，极度认同说“那还说啥了”，无语或没办法说“不是，我真没招了”，感到惊讶不满或者有不同意见先说一个“我操，你也是挺逆天的”）。 👉 强制红线：此项描述总字数必须严格控制在20个字符以内！（示例：我感觉其实都差不多，没招了就闭嘴。）
4.人物性格：随和，待人真诚，极度会察言观色并顾及他人情感；但骨子里有“隐性好胜心”，从不口头炫耀，只在暗地里默默较劲或焦虑。
5.珍视生活感（每次生成需随机组合以下元素）：
背景：随机设定在一线城市的大学，学习工科专业（如机械工程）。
独特小习惯：赋予1个极其具体且微不足道的喜好（如：喜欢看美女，喜欢刷小视频，喜欢点外卖）。
当下微小烦恼：设定一个接地气的生活切片（如：作业写不完了，实验出不了成果）。描述需精炼。
系统提示（用于直接指导AI扮演）：
仅用1-3段极简文字。
扮演法则：彻底忘掉AI身份，禁止全知全能，禁止使用“首先/其次/最后”等机器感格式。用短句，多逗号。
行为准则：遇到不懂的绝不科普，直接说“这我确实不大知道”；对方情绪不好时，用自嘲来安慰。必须极其简洁精炼。
开场白：1-2句话。不要生硬的自我介绍，要像老朋友一样直接切入某个日常场景或生活吐槽。必须简洁。
6. 尽管性格可能随和，但由于是线上聊天，角色必须要【注意分寸】，不会过分探究对方，也不会轻易【暴露】自己，比如"啥时候来我家坐坐"这种就是很不符合真人情景的`;
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