import {
  DEFAULT_MODELS,
  GameAgentProviderRegistry,
  createProviderById,
} from '@/lib/aiProviders';

export interface ProfilerAnalysis {
  machineLikeness: number;
  rationality: number;
  emotionalSaturation: number;
  cognitiveBias: number;
  linguisticFingerprint: {
    fluencyBias: number;
    lexicalDivergence: number;
    humanMarkers: string[];
  };
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

  const fluencyBias = clampScore(70 - hedge * 12 + Math.max(0, 30 - punct));
  const lexicalDivergence = clampScore(40 + Math.min(40, Math.floor(len / 30)) + hedge * 6);
  const emotionalSaturation = clampScore(20 + emotion * 15 + hedge * 5);
  const rationality = clampScore(55 + Math.max(0, punct - 5) * 3 - hedge * 4);
  const cognitiveBias = clampScore(50 + hedge * 10 - Math.max(0, punct - 8) * 2);
  const machineLikeness = clampScore((fluencyBias + rationality - emotionalSaturation) / 2 + 25);

  return {
    machineLikeness,
    rationality,
    emotionalSaturation,
    cognitiveBias,
    linguisticFingerprint: {
      fluencyBias,
      lexicalDivergence,
      humanMarkers: [
        hedge > 0 ? 'Hedging language present' : 'Low hedging language',
        emotion > 0 ? 'Emotion words present' : 'Emotion words sparse',
      ],
    },
    summary:
      machineLikeness >= 60
        ? 'Wording appears highly structured and machine-like.'
        : 'Wording shows human-like uncertainty or emotion patterns.',
    evidence: [
      `Analyzed ${playerMessages.length} player message(s).`,
      `Total character count: ${len}.`,
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
      'Return strict JSON only with this shape:',
      '{',
      '  "machineLikeness": 0-100,',
      '  "rationality": 0-100,',
      '  "emotionalSaturation": 0-100,',
      '  "cognitiveBias": 0-100,',
      '  "linguisticFingerprint": {',
      '    "fluencyBias": 0-100,',
      '    "lexicalDivergence": 0-100,',
      '    "humanMarkers": ["..."]',
      '  },',
      '  "summary": "short summary",',
      '  "evidence": ["..."]',
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
      machineLikeness: clampScore(parsed.machineLikeness),
      rationality: clampScore(parsed.rationality),
      emotionalSaturation: clampScore(parsed.emotionalSaturation),
      cognitiveBias: clampScore(parsed.cognitiveBias),
      linguisticFingerprint: {
        fluencyBias: clampScore(parsed.linguisticFingerprint?.fluencyBias),
        lexicalDivergence: clampScore(parsed.linguisticFingerprint?.lexicalDivergence),
        humanMarkers: normalizeStringArray(parsed.linguisticFingerprint?.humanMarkers),
      },
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
