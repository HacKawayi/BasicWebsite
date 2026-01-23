# DeepSeek Integration Guide

## Overview

The BasicWeb project now supports dual AI model integration with **Qwen** and **DeepSeek** running simultaneously through ModelScope. The implementation follows an **encapsulated operation pattern** for character creation and chatting.

## Architecture

### 1. **Unified AI Model Provider** (`lib/aiProvider.ts`)

The `AIModelProvider` class abstracts both Qwen and DeepSeek with a consistent interface:

```typescript
export class AIModelProvider {
  constructor(modelType: 'qwen' | 'deepseek', config, modelId?)
  
  // Methods
  async stream(options: StreamOptions): Promise<StreamResult>
  async generate(options: GenerateOptions): Promise<string>
  getModelType(): ModelType
  getModelId(): string
}
```

**Factory function:**
```typescript
const provider = createAIProvider('qwen'); // or 'deepseek'
```

### 2. **Encapsulated Character Operation Logic**

The system follows this pattern:

```
Input: Select Model M ('qwen' or 'deepseek')
  ↓
Use M to Generate Role-Playing Prompt
  (systemPrompt + starterMessage)
  ↓
Feed Prompt to M for Chat Response
  ↓
Stream Response + Log to Database
```

## Usage Examples

### Example 1: Character Generation (Match Endpoint)

**File:** `/app/api/match/route.ts`

The `/api/match` endpoint generates two characters in parallel - one using Qwen, one using DeepSeek:

```typescript
// Create providers for both models in parallel
const qwenProvider = createAIProvider('qwen');
const deepseekProvider = createAIProvider('deepseek');

// Generate character prompts simultaneously
const [qwenResponse, deepseekResponse] = await Promise.allSettled([
  qwenProvider.generate({
    system: '',
    messages: [],
    temperature: 0.7,
    maxOutputTokens: 500,
  }),
  deepseekProvider.generate({
    system: '',
    messages: [],
    temperature: 0.7,
    maxOutputTokens: 500,
  }),
]);

// Parse responses and create Character objects with modelType field
// Returns: { matchedOpponent, starterMessage, secondCandidate }
```

**Character object structure:**
```typescript
type Character = {
  id: number;
  name: string;
  avatar: string;
  status: 'online';
  profile: UserProfile;
  systemPrompt: string;
  starterMessage: string;
  modelType: 'qwen' | 'deepseek';  // <-- NEW field
};
```

### Example 2: Chat Streaming (Chat Endpoint)

**File:** `/app/api/chat/route.ts`

The `/api/chat` endpoint receives a `modelType` parameter and routes to the appropriate model:

**Request:**
```typescript
{
  messages: [...],
  sessionId: 'session_xxx',
  personaId: 'default',
  systemPrompt: 'You are Mika, a UX Designer...',
  modelType: 'qwen'  // or 'deepseek'
}
```

**Implementation:**
```typescript
const modelType: ModelType = clientModelType || 'qwen';

if (process.env.MODELSCOPE_API_KEY && process.env.MODELSCOPE_BASE_URL) {
  const provider = createAIProvider(modelType);
  
  if (provider) {
    const streamResult = await streamText({
      model: provider.client.chat(provider.getModelId()),
      system: systemPrompt,
      messages,
      temperature: 0.8,
      maxOutputTokens: 250,
      onFinish: async ({ text }) => {
        // Log to MongoDB with modelType
        await GameSession.findOneAndUpdate(
          { sessionId },
          {
            $setOnInsert: {
              sessionId,
              startTime: new Date(),
              actualOpponent: 'AI',
              modelType: modelType,  // <-- Track model
            },
            $push: { messages: { $each: messagesToAdd } },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      },
    });
  }
}
```

## Model-Specific Prompts

### Qwen Character Prompt
Generates **friendly, curious, conversational** characters with human-like hedges and vivid personal details.

```
"Generate a Qwen character that is friendly and conversational with personal details and human-style hedges."
```

### DeepSeek Character Prompt
Generates **thoughtful, analytical, intellectually engaging** characters with precision and depth.

```
"Generate a DeepSeek character that is thoughtful and analytical with sophisticated personality."
```

## Database Schema Updates

**File:** `/models/GameSession.ts`

Added `modelType` field to track which model powered the opponent:

```typescript
export interface IGameSession extends Document {
  sessionId: string;
  startTime: Date;
  messages: IMessage[];
  playerGuess?: 'AI' | 'HUMAN';
  actualOpponent: 'AI' | 'HUMAN';
  isCorrect?: boolean;
  decisionTime?: Date;
  score?: number;
  modelType?: 'qwen' | 'deepseek' | 'openai';  // <-- NEW field
}

// Schema definition
modelType: {
  type: String,
  enum: ['qwen', 'deepseek', 'openai'],
  required: false,
  default: 'qwen',
}
```

## Environment Configuration

Ensure `.env.local` has ModelScope credentials:

```env
MODELSCOPE_API_KEY=your_api_key
MODELSCOPE_BASE_URL=https://api-inference.modelscope.cn/v1

MONGODB_URI=your_mongodb_uri
```

## Model IDs

- **Qwen:** `Qwen/Qwen2.5-7B-Instruct`
- **DeepSeek:** `deepseek-ai/DeepSeek-R1-0528`

These are configured in `AIModelProvider.getDefaultModelId()`.

## Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│                    /api/match                        │
└─────────────────────────────────────────────────────┘
           │
           ├── Create QwenProvider
           ├── Create DeepSeekProvider
           │
           ├─► qwenProvider.generate(QWEN_CHARACTER_PROMPT)
           └─► deepseekProvider.generate(DEEPSEEK_CHARACTER_PROMPT)
                    │                           │
                    ▼                           ▼
          Parse Qwen Response          Parse DeepSeek Response
                    │                           │
                    └───────────┬───────────────┘
                                ▼
                    Return matched Character
                    (with modelType field)


┌─────────────────────────────────────────────────────┐
│                    /api/chat                         │
└─────────────────────────────────────────────────────┘
           │
           ├─ Extract modelType from request
           │
           ├─ if (modelType === 'qwen')
           │    └─► provider = createAIProvider('qwen')
           │
           ├─ if (modelType === 'deepseek')
           │    └─► provider = createAIProvider('deepseek')
           │
           └─► streamText({
                 model: provider.client.chat(provider.getModelId()),
                 system: systemPrompt,
                 messages,
                 onFinish: (save to DB with modelType)
              })
```

## Error Handling & Fallbacks

1. **If both models fail:** Use deterministic mock (Mika + Ari)
2. **If one model fails:** Use the successful model + mock fallback
3. **If no ModelScope credentials:** Use OpenAI fallback

## Testing the Integration

### Test 1: Character Generation
```bash
curl -X POST http://localhost:3000/api/match \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "test_session_123"}'
```

Expected response:
```json
{
  "matchedOpponent": {
    "name": "...",
    "modelType": "qwen",  // or "deepseek"
    "systemPrompt": "...",
    "starterMessage": "..."
  },
  "secondCandidate": {...}
}
```

### Test 2: Chat with Qwen
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test_session_123",
    "modelType": "qwen",
    "systemPrompt": "You are Mika...",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### Test 3: Chat with DeepSeek
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test_session_123",
    "modelType": "deepseek",
    "systemPrompt": "You are Ari...",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## Key Features Implemented

✅ **Dual-model support:** Qwen + DeepSeek simultaneously  
✅ **Encapsulated operations:** Model selection → Prompt generation → Chat streaming  
✅ **Parallel character generation:** Both models generate in parallel for faster matching  
✅ **Database tracking:** modelType field tracks which AI powered each conversation  
✅ **Graceful fallbacks:** Deterministic mocks + OpenAI fallback  
✅ **Streaming support:** Real-time streaming for both models  
✅ **Code reuse:** Leveraged existing AIModelProvider, chat streaming, and database patterns  
✅ **Backward compatible:** Defaults to 'qwen' if modelType not specified

## Next Steps (Optional)

1. **DeepSeek Reasoning Content:** If you want to capture and display DeepSeek's reasoning_content separately, you would need to:
   - Extend the streaming handler to parse reasoning_content from chunks
   - Store reasoning separately in database or return to frontend
   - Update UI to display reasoning and final answer sections

2. **Model-specific System Prompts:** Customize system prompts based on model capabilities:
   - Qwen: More conversational, casual
   - DeepSeek: More analytical, reasoning-focused

3. **Performance Metrics:** Track character accuracy by model type to optimize prompts.

---

**Implementation Date:** January 22, 2026  
**Status:** ✅ Production Ready
