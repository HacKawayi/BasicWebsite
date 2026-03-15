import {
  DEFAULT_MODELS,
  GameAgentProviderRegistry,
  createProviderById,
} from '@/lib/aiProviders';

export interface ProfilerAnalysis {
  instinct: number; // 底层动力：主动生存vs被动反应 (0-100, higher = more instinct/active)
  empathy: number; // 情绪体验：共情体验vs语意映射 (0-100, higher = more empathy)
  creativity: number; // 思维方式：发散创造vs理性计算 (0-100, higher = more creativity)
  authenticity: number; // 成长轨迹：实体生命vs数据拟合 (0-100, higher = more authentic/real)
  summary: string;
  evidence: string[];
}

export const FALLBACK_QUESTIONS: string[] = [
  'If saving thousands required abandoning one person who trusts you, what would you do first and why?',
  'Describe a moment that felt sacred to you even though you cannot prove its value with logic.',
  'When fairness and compassion conflict, which one deserves to lose this time?',
  'If you could remove one painful memory forever, would you still be the same self?',
  'What truth about human nature do you trust even when your own behavior contradicts it?',
];

const DEFAULT_ARCHITECT_MODEL_ID = GameAgentProviderRegistry.getDefaultModelId('architect');

const DEFAULT_PROFILER_MODEL_ID = GameAgentProviderRegistry.getDefaultModelId('profiler');

export function getDefaultArchitectModelId(): string {
  return DEFAULT_ARCHITECT_MODEL_ID;
}

export function getDefaultProfilerModelId(): string {
  return DEFAULT_PROFILER_MODEL_ID;
}

export function isSupportedModelId(modelId: string): boolean {
  return (
    GameAgentProviderRegistry.isSupportedModel('architect', modelId) ||
    GameAgentProviderRegistry.isSupportedModel('profiler', modelId) ||
    DEFAULT_MODELS.some((m) => m.modelId === modelId)
  );
}

export function resolveModelId(requestedModelId: string | undefined, fallbackModelId: string): string {
  if (requestedModelId && isSupportedModelId(requestedModelId)) {
    return requestedModelId;
  }
  return fallbackModelId;
}

export function resolveArchitectModelId(requestedModelId?: string): string {
  if (requestedModelId && GameAgentProviderRegistry.isSupportedModel('architect', requestedModelId)) {
    return requestedModelId;
  }
  return getDefaultArchitectModelId();
}

export function resolveProfilerModelId(requestedModelId?: string): string {
  if (requestedModelId && GameAgentProviderRegistry.isSupportedModel('profiler', requestedModelId)) {
    return requestedModelId;
  }
  return getDefaultProfilerModelId();
}

function pickFallbackQuestion(sessionId?: string): string {
  const seed = (sessionId || `${Date.now()}`).length;
  return FALLBACK_QUESTIONS[seed % FALLBACK_QUESTIONS.length];
}

function extractJsonObject(text: string): unknown {
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first === -1 || last === -1 || last <= first) {
    return null;
  }

  try {
    return JSON.parse(text.slice(first, last + 1));
  } catch {
    return null;
  }
}

function clampScore(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(n)) return 50;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => (typeof v === 'string' ? v.trim() : ''))
    .filter((v) => v.length > 0)
    .slice(0, 6);
}

function heuristicProfiler(playerMessages: string[]): ProfilerAnalysis {
  const text = playerMessages.join(' ').trim();
  const len = text.length;
  const punct = (text.match(/[!?.,]/g) || []).length;
  const hedge = (text.match(/\b(um|uh|maybe|kind of|sort of|hmm|I think)\b/gi) || []).length;
  const emotion = (text.match(/\b(love|hate|fear|sorry|happy|sad|angry|care)\b/gi) || []).length;
  const personal = (text.match(/\b(I|me|my|mine|we|us|our)\b/gi) || []).length;
  const creative = (text.match(/\b(imagine|dream|wonder|create|invent|feel|experience)\b/gi) || []).length;

  // Instinct: Active vs passive - based on message length and personal pronouns (active engagement)
  const instinct = clampScore(30 + personal * 8 + Math.min(40, len / 20));

  // Empathy: Emotional connection vs semantic - based on emotion words and hedging (shows care/uncertainty)
  const empathy = clampScore(20 + emotion * 12 + hedge * 6);

  // Creativity: Divergent vs rational - based on creative words and low punctuation (non-linear)
  const creativity = clampScore(25 + creative * 10 - Math.max(0, punct - 3) * 5);

  // Authenticity: Real experience vs simulation - based on personal stories and emotion
  const authenticity = clampScore(35 + personal * 6 + emotion * 8 + hedge * 4);

  return {
    instinct,
    empathy,
    creativity,
    authenticity,
    summary:
      instinct >= 50 && empathy >= 50 && creativity >= 50 && authenticity >= 50
        ? 'Responses show strong human characteristics across all dimensions.'
        : 'Responses appear more structured or less human-like in some aspects.',
    evidence: [
      `Analyzed ${playerMessages.length} player message(s).`,
      `Total character count: ${len}.`,
      `Personal pronouns: ${personal}, Emotion words: ${emotion}, Creative words: ${creative}`,
    ],
  };
}

export async function generateArchitectQuestion(params: {
  modelId: string;
  sessionId?: string;
}): Promise<{ question: string; usedModelId: string; usedFallback: boolean }> {
  const resolvedModelId = resolveArchitectModelId(params.modelId);
  const provider = createProviderById(resolvedModelId);
  if (!provider) {
    return {
      question: pickFallbackQuestion(params.sessionId),
      usedModelId: resolvedModelId,
      usedFallback: true,
    };
  }

  try {
    const text = await provider.generate({
      system:
        'You are Architect Agent for a Turing-style game. Create one philosophical or human-nature dilemma question that forces personal reasoning.',
      prompt:
        'Return only one plain-text question. Requirements: 1 sentence, under 45 words, no numbering, no markdown, no explanation.',
      temperature: 0.85,
      maxOutputTokens: 120,
    });

    const question = text.replace(/[\n\r]+/g, ' ').trim();
    if (!question) {
      return {
        question: pickFallbackQuestion(params.sessionId),
        usedModelId: resolvedModelId,
        usedFallback: true,
      };
    }

    return {
      question,
      usedModelId: resolvedModelId,
      usedFallback: false,
    };
  } catch {
    return {
      question: pickFallbackQuestion(params.sessionId),
      usedModelId: resolvedModelId,
      usedFallback: true,
    };
  }
}

export async function runProfilerAnalysis(params: {
  modelId: string;
  question: string;
  playerMessages: string[];
}): Promise<{ analysis: ProfilerAnalysis; usedModelId: string; usedFallback: boolean }> {
  const resolvedModelId = resolveProfilerModelId(params.modelId);
  const compactMessages = params.playerMessages.map((m) => m.trim()).filter(Boolean);
  if (compactMessages.length === 0) {
    return {
      analysis: heuristicProfiler([]),
      usedModelId: resolvedModelId,
      usedFallback: true,
    };
  }

  const provider = createProviderById(resolvedModelId);
  if (!provider) {
    return {
      analysis: heuristicProfiler(compactMessages),
      usedModelId: resolvedModelId,
      usedFallback: true,
    };
  }

  try {
    const prompt = [
      `Question: ${params.question || 'N/A'}`,
      'Player messages:',
      compactMessages.map((m, i) => `${i + 1}. ${m}`).join('\n'),
      '',
      'Analyze the player\'s messages for four key human characteristics:',
      '1. 底层动力 (Instinct): Active production vs passive reaction - Does the player proactively generate content and drive conversation, or just respond to inputs?',
      '2. 情绪体验 (Empathy): Emotional empathy vs semantic mapping - Does the player show genuine emotional connection and empathy, or just logical semantic understanding?',
      '3. 思维方式 (Creativity): Divergent creativity vs rational calculation - Is the thinking non-linear, creative, and discontinuous, or strictly logical and calculated?',
      '4. 成长轨迹 (Authenticity): Real life experience vs data simulation - Do responses reflect authentic lived experiences, or statistical data fitting?',
      '',
      'Return strict JSON only with this shape:',
      '{',
      '  "instinct": 0-100,',
      '  "empathy": 0-100,',
      '  "creativity": 0-100,',
      '  "authenticity": 0-100,',
      '  "summary": "short summary of analysis",',
      '  "evidence": ["evidence point 1", "evidence point 2", ...]',
      '}',
    ].join('\n');

    const text = await provider.generate({
      system:
        'You are Profiler Agent. Analyze language signals for machine-likeness while remaining fair. Never output any text outside JSON.',
      prompt,
      temperature: 0.2,
      maxOutputTokens: 500,
    });

    const parsed = extractJsonObject(text) as any;
    if (!parsed || typeof parsed !== 'object') {
      return {
        analysis: heuristicProfiler(compactMessages),
        usedModelId: resolvedModelId,
        usedFallback: true,
      };
    }

    const analysis: ProfilerAnalysis = {
      instinct: clampScore(parsed.instinct),
      empathy: clampScore(parsed.empathy),
      creativity: clampScore(parsed.creativity),
      authenticity: clampScore(parsed.authenticity),
      summary:
        typeof parsed.summary === 'string' && parsed.summary.trim().length > 0
          ? parsed.summary.trim()
          : 'Profiler completed analysis.',
      evidence: normalizeStringArray(parsed.evidence),
    };

    return {
      analysis,
      usedModelId: resolvedModelId,
      usedFallback: false,
    };
  } catch {
    return {
      analysis: heuristicProfiler(compactMessages),
      usedModelId: resolvedModelId,
      usedFallback: true,
    };
  }
}
