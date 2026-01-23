# Encapsulated Model Operation Pattern

## Quick Reference

This document explains the core "encapsulated operation" pattern implemented in BasicWeb for character creation and chatting.

## The Pattern

```
ENCAPSULATED OPERATION: Character Creation & Chat

Input:
  - modelType: 'qwen' | 'deepseek'
  - systemPrompt?: custom roleplay prompt
  - messages: conversation history

Processing:
  Step 1: Model Selection
    └─ Create provider for selected model
  
  Step 2: Generate/Use Roleplay Prompt
    └─ If systemPrompt provided: use it
    └─ If not: use model-specific default prompt
  
  Step 3: Stream Chat Response
    └─ Feed prompt + messages to model
    └─ Stream response in real-time
  
  Step 4: Persist
    └─ Log conversation to MongoDB
    └─ Track which model powered this exchange

Output:
  - Streaming chat response
  - Database record with modelType
```

## Implementation in Code

### Location 1: Character Generation (`/api/match`)

**Input:** `sessionId`

**Process:**
```typescript
// Step 1: Model Selection
const qwenProvider = createAIProvider('qwen');
const deepseekProvider = createAIProvider('deepseek');

// Step 2: Generate Prompts (Parallel)
const qwenPrompt = await qwenProvider.generate({
  system: '',
  messages: [],
  temperature: 0.7,
  maxOutputTokens: 500,
});

const deepseekPrompt = await deepseekProvider.generate({
  system: '',
  messages: [],
  temperature: 0.7,
  maxOutputTokens: 500,
});

// Parse JSON to extract: systemPrompt, starterMessage, profile

// Step 3-4: Return Character objects with modelType
return {
  matchedOpponent: {
    name: '...',
    modelType: 'qwen' | 'deepseek',
    systemPrompt: '...',
    starterMessage: '...',
  },
  secondCandidate: { ... }
};
```

**Output:** Two `Character` objects, each with:
- `systemPrompt`: Instructions for the model on how to roleplay
- `starterMessage`: Opening message from the character
- `modelType`: Tracks which model created this character

---

### Location 2: Chat Streaming (`/api/chat`)

**Input:** 
```typescript
{
  messages: [...],
  systemPrompt: 'You are Mika, a UX Designer...',
  modelType: 'qwen',  // User selects model
  sessionId: 'session_xxx'
}
```

**Process:**
```typescript
// Step 1: Model Selection
const modelType = clientModelType || 'qwen';
const provider = createAIProvider(modelType);

// Step 2: Use Roleplay Prompt (already provided by /match)
const systemPrompt = clientSystemPrompt || '...';

// Step 3: Stream Chat Response
const result = await streamText({
  model: provider.client.chat(provider.getModelId()),
  system: systemPrompt,        // Roleplay instructions
  messages,                     // Conversation history
  temperature: 0.8,
  maxOutputTokens: 250,
  onFinish: async ({ text }) => {
    // Step 4: Persist to Database
    await GameSession.findOneAndUpdate(
      { sessionId },
      {
        $setOnInsert: {
          sessionId,
          startTime: new Date(),
          actualOpponent: 'AI',
          modelType: modelType,  // ← Track which model
        },
        $push: {
          messages: { $each: messagesToAdd }
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  },
});

return result.toTextStreamResponse();
```

**Output:** Streaming text response + database record

---

## Data Flow Diagram

```
FRONTEND
   │
   ├─────────────────────┐
   │                     │
   ▼                     ▼
/api/match            /api/chat
   │                     │
   ├─ Select Model(s)    ├─ Select Model
   │  (Qwen+DeepSeek)    │  (Qwen OR DeepSeek)
   │                     │
   ├─ Generate Prompts   ├─ Use Generated Prompt
   │  (parallel)         │  (from /match response)
   │                     │
   ├─ Create Characters  ├─ Stream Response
   │                     │
   └──────┬──────────────┴─── Log to MongoDB
          │                   (modelType field)
          │
          ▼
      RESPONSE
   {
     matchedOpponent: { modelType: 'qwen', ... },
     secondCandidate: { modelType: 'deepseek', ... }
   }
```

---

## Model Differentiation

### Qwen Character (Friendly, Conversational)

**Prompt Style:**
- "Generate a Qwen character that is **friendly, curious, conversational**"
- Include human-style hedges: "I usually...", "sometimes I..."
- Vivid personal details
- Casual language

**Output Example:**
```json
{
  "name": "Mika",
  "profile": {
    "personality": "curious, thoughtful, concise",
    "interests": ["product design", "coffee", "podcasts"]
  },
  "systemPrompt": "You are Mika, a Taipei-based UX Designer. Roleplay as Mika: be curious, give concise thoughtful replies...",
  "modelType": "qwen"
}
```

---

### DeepSeek Character (Analytical, Thoughtful)

**Prompt Style:**
- "Generate a DeepSeek character that is **thoughtful, analytical, intellectually engaging**"
- Precision and depth
- Sophisticated personality
- Technical coherence

**Output Example:**
```json
{
  "name": "Ari",
  "profile": {
    "personality": "precise, analytical, minimally verbose",
    "interests": ["distributed systems", "automation", "latency"]
  },
  "systemPrompt": "You are Ari, a data engineer. Roleplay as Ari: be precise, concise, and technically coherent...",
  "modelType": "deepseek"
}
```

---

## Key Implementation Details

### 1. AIModelProvider Class

```typescript
export class AIModelProvider {
  async generate(options): Promise<string>  // For prompt generation
  async stream(options): Promise<StreamResult>  // For chat streaming
  getModelType(): ModelType
  getModelId(): string
}
```

**Usage:**
```typescript
const provider = createAIProvider('qwen');
const prompt = await provider.generate({ ... });

// OR

const stream = await provider.stream({ ... });
```

### 2. Character Type

```typescript
type Character = {
  // ... existing fields
  modelType: 'qwen' | 'deepseek';  // ← NEW: Tracks AI model
};
```

### 3. Database Schema

```typescript
modelType: {
  type: String,
  enum: ['qwen', 'deepseek', 'openai'],
  default: 'qwen'
}
```

---

## Error Handling

```
Try: Generate with Qwen + DeepSeek
  ├─ Both succeed → Return both characters
  ├─ One succeeds → Mix with deterministic mock
  ├─ Both fail → Use deterministic mock
  └─ No ModelScope → Use OpenAI fallback
```

---

## Summary: Encapsulated Operation Steps

| Step | Action | Input | Output |
|------|--------|-------|--------|
| 1 | **Select Model** | User choice | `provider = createAIProvider('qwen')` |
| 2 | **Generate Prompt** | Model's capability | `systemPrompt`, `starterMessage` |
| 3 | **Create Character** | Generated prompt | `Character` object with `modelType` |
| 4 | **Stream Chat** | Character + messages | Real-time text response |
| 5 | **Persist** | Response + model info | Database record with `modelType` |

---

## Usage Pattern from Frontend

```typescript
// Step 1: Get matched characters with models
const { matchedOpponent, secondCandidate } = await fetch('/api/match', {
  method: 'POST',
  body: JSON.stringify({ sessionId })
}).then(r => r.json());

// matchedOpponent.modelType === 'qwen' or 'deepseek'

// Step 2: Chat with the matched opponent (already has system prompt)
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    sessionId,
    modelType: matchedOpponent.modelType,        // ← Pass model type
    systemPrompt: matchedOpponent.systemPrompt,   // ← Use generated prompt
    messages: conversationHistory
  })
});

// Step 3: Stream and display response
const reader = response.body.getReader();
// ... read and display streamed text
```

---

**Pattern:** Model Selection → Prompt Generation → Streaming → Persistence  
**Status:** ✅ Fully Implemented  
**File References:** `lib/aiProvider.ts`, `app/api/match/route.ts`, `app/api/chat/route.ts`
