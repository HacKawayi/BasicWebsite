# DeepSeek on ModelScope - TypeScript Implementation Reference

## Overview

This document maps the provided Python DeepSeek example to the TypeScript implementation in BasicWeb.

## Python Reference (Original)

```python
from openai import OpenAI  

client = OpenAI(  
    base_url='https://api-inference.modelscope.cn/v1',  
    api_key='ms-33733262-fb3c-4b10-89e4-69d333956647',
)  

response = client.chat.completions.create(  
    model='deepseek-ai/DeepSeek-R1-0528',
    messages=[  
        {  
            'role': 'user',  
            'content': 'Hello'  
        }  
    ],  
    stream=True  
)  

done_reasoning = False  
for chunk in response:  
    if chunk.choices:  
        reasoning_chunk = chunk.choices[0].delta.reasoning_content  
        answer_chunk = chunk.choices[0].delta.content  
        
        if reasoning_chunk != '':  
            print(reasoning_chunk, end='', flush=True)  
        elif answer_chunk != '':  
            if not done_reasoning:  
                print('\n\n === Final Answer ===\n')  
                done_reasoning = True  
            print(answer_chunk, end='', flush=True)
```

---

## TypeScript Implementation

### 1. Basic Model Setup

**Python:**
```python
client = OpenAI(  
    base_url='https://api-inference.modelscope.cn/v1',  
    api_key='ms-33733262-fb3c-4b10-89e4-69d333956647',
)
```

**TypeScript (lib/aiProvider.ts):**
```typescript
import { createOpenAI } from '@ai-sdk/openai';

const client = createOpenAI({
  apiKey: process.env.MODELSCOPE_API_KEY,  // 'ms-...'
  baseURL: process.env.MODELSCOPE_BASE_URL, // 'https://api-inference.modelscope.cn/v1'
});
```

**Configuration (in .env.local):**
```env
MODELSCOPE_API_KEY=ms-33733262-fb3c-4b10-89e4-69d333956647
MODELSCOPE_BASE_URL=https://api-inference.modelscope.cn/v1
```

---

### 2. Model ID

**Python:**
```python
response = client.chat.completions.create(  
    model='deepseek-ai/DeepSeek-R1-0528',  # ← Model ID
    ...
)
```

**TypeScript:**
```typescript
const deepseekModelId = 'deepseek-ai/DeepSeek-R1-0528';
const model = client.chat(deepseekModelId);

// Automated in AIModelProvider:
getDefaultModelId('deepseek'): string {
  return 'deepseek-ai/DeepSeek-R1-0528';
}
```

---

### 3. Streaming Chat Completion

**Python:**
```python
response = client.chat.completions.create(  
    model='deepseek-ai/DeepSeek-R1-0528',
    messages=[  
        { 'role': 'user', 'content': 'Hello' }  
    ],  
    stream=True  
)
```

**TypeScript:**
```typescript
// Using ai sdk (streamText automatically handles streaming)
import { streamText } from 'ai';

const result = await streamText({
  model: client.chat('deepseek-ai/DeepSeek-R1-0528'),
  messages: [
    { role: 'user', content: 'Hello' }
  ],
  // stream: true  // Implicit
});

// Or using AIModelProvider:
const provider = createAIProvider('deepseek');
const result = await provider.stream({
  system: systemPrompt,
  messages: conversationMessages,
});
```

---

### 4. Handling Reasoning Content (Python vs TypeScript)

#### Python: Manual Chunk Processing

**Python handles reasoning_content explicitly:**
```python
done_reasoning = False
for chunk in response:
    if chunk.choices:
        reasoning_chunk = chunk.choices[0].delta.reasoning_content
        answer_chunk = chunk.choices[0].delta.content
        
        if reasoning_chunk != '':
            print(reasoning_chunk, end='', flush=True)  # Print reasoning
        elif answer_chunk != '':
            if not done_reasoning:
                print('\n\n === Final Answer ===\n')
                done_reasoning = True
            print(answer_chunk, end='', flush=True)  # Print answer
```

#### TypeScript: Current Implementation

**Current (as implemented):**
```typescript
// The ai SDK combines all content (reasoning + answer)
// and streams as a single text stream
const result = await streamText({
  model: client.chat('deepseek-ai/DeepSeek-R1-0528'),
  messages,
  onFinish: async ({ text }) => {
    // text includes both reasoning and final answer
    console.log(text);
  },
});

// Output includes full response (reasoning + answer combined)
return result.toTextStreamResponse();
```

---

### 5. Optional Enhancement: Extract Reasoning Content

**If you want to replicate Python's reasoning_content handling:**

```typescript
// Advanced: Custom streaming with reasoning extraction
async function streamWithReasoning(
  model: ReturnType<typeof createOpenAI>,
  messages: any[],
  systemPrompt: string
) {
  let reasoningContent = '';
  let answerContent = '';
  
  const result = await streamText({
    model: model.chat('deepseek-ai/DeepSeek-R1-0528'),
    system: systemPrompt,
    messages,
    onFinish: async ({ text }) => {
      // Parse to separate reasoning and answer
      // Note: Current ai SDK doesn't separate these automatically
      // You would need to implement custom parsing
      
      // Option 1: Call raw API to get chunk.choices[0].delta.reasoning_content
      // Option 2: Use a prompt prefix like "REASONING:\n...\nFINAL ANSWER:\n..."
      // Option 3: Store full text and separate via post-processing
    },
  });

  return result;
}
```

---

## Comparison Table

| Aspect | Python | TypeScript |
|--------|--------|-----------|
| **Client Library** | `OpenAI` | `@ai-sdk/openai` |
| **Client Creation** | `OpenAI(base_url=..., api_key=...)` | `createOpenAI({apiKey, baseURL})` |
| **Model ID** | `'deepseek-ai/DeepSeek-R1-0528'` | `'deepseek-ai/DeepSeek-R1-0528'` |
| **Streaming** | `stream=True` | `streamText()` (implicit) |
| **Chunk Access** | `for chunk in response:` | `onFinish()` callback |
| **Reasoning Content** | `chunk.choices[0].delta.reasoning_content` | Combined in stream |
| **Answer Content** | `chunk.choices[0].delta.content` | Combined in stream |
| **Error Handling** | Try/except | Try/catch |
| **Response Format** | Raw chunks | Processed stream |

---

## Usage in BasicWeb

### Minimal Example

```typescript
// In /api/chat route.ts
import { createAIProvider } from '@/lib/aiProvider';

const provider = createAIProvider('deepseek');

if (provider) {
  const result = await streamText({
    model: provider.client.chat(provider.getModelId()),
    system: 'You are a helpful assistant.',
    messages: [
      { role: 'user', content: 'What is DeepSeek?' }
    ],
    temperature: 0.8,
    maxOutputTokens: 250,
    onFinish: async ({ text }) => {
      console.log('DeepSeek response:', text);
      // Text includes both reasoning and final answer
      // Log to database with modelType: 'deepseek'
    },
  });

  return result.toTextStreamResponse();
}
```

### Full Example with Character

```typescript
// In /api/match route.ts
const deepseekProvider = createAIProvider('deepseek');

const characterPrompt = `Generate one character in JSON for a DeepSeek AI:
{
  "character": {
    "name": "...",
    "profile": { ... },
    "systemPrompt": "Roleplay instructions",
    "starterMessage": "..."
  }
}`;

const characterJSON = await deepseekProvider.generate({
  system: '',
  messages: [],
  temperature: 0.7,
  maxOutputTokens: 500,
});

const character = JSON.parse(characterJSON);
// character.modelType = 'deepseek'

// Later, in /api/chat
const deepseekChat = await deepseekProvider.stream({
  system: character.systemPrompt,
  messages: userMessages,
  temperature: 0.8,
  maxOutputTokens: 250,
  onFinish: async ({ text }) => {
    // Log with modelType: 'deepseek'
  },
});
```

---

## Environment Setup

**Required .env.local:**
```env
# ModelScope API Configuration
MODELSCOPE_API_KEY=ms-33733262-fb3c-4b10-89e4-69d333956647
MODELSCOPE_BASE_URL=https://api-inference.modelscope.cn/v1

# Database
MONGODB_URI=your_mongodb_uri
```

---

## Key Differences: Python vs TypeScript

### 1. **Chunk Handling**

**Python:** Manual iteration with chunk inspection
```python
for chunk in response:
    reasoning = chunk.choices[0].delta.reasoning_content
    answer = chunk.choices[0].delta.content
```

**TypeScript:** Automatic with ai SDK
```typescript
streamText({ ... onFinish: ({ text }) => ... })
```

### 2. **Reasoning Content**

**Python:** Explicitly accessed
```python
if reasoning_chunk != '':
    print(reasoning_chunk)
```

**TypeScript:** Combined in output (enhancement possible)
```typescript
// Currently: Full text stream
// Enhancement: Could parse and separate
```

### 3. **Error Handling**

**Python:**
```python
try:
    response = client.chat.completions.create(...)
except Exception as e:
    print(f"Error: {e}")
```

**TypeScript:**
```typescript
try {
  const result = await streamText({ ... });
} catch (error) {
  console.error('Error:', error);
}
```

---

## Migration Checklist

If converting from Python to TypeScript DeepSeek:

- [x] Set up `createOpenAI` client with ModelScope credentials
- [x] Use model ID: `'deepseek-ai/DeepSeek-R1-0528'`
- [x] Wrap in `AIModelProvider` class
- [x] Use `streamText()` for streaming responses
- [x] Handle `onFinish()` callback for post-processing
- [x] Log responses with `modelType: 'deepseek'`
- [ ] (Optional) Extract reasoning_content separately
- [x] Add fallback error handling
- [x] Test with sample messages

---

## Testing DeepSeek Integration

```bash
# Direct test against ModelScope
curl -X POST https://api-inference.modelscope.cn/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ms-33733262-fb3c-4b10-89e4-69d333956647" \
  -d '{
    "model": "deepseek-ai/DeepSeek-R1-0528",
    "messages": [{"role": "user", "content": "Hello"}],
    "stream": true
  }'

# Via BasicWeb API
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test",
    "modelType": "deepseek",
    "systemPrompt": "You are helpful",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

---

## Summary

| Aspect | Status |
|--------|--------|
| ModelScope API Integration | ✅ Working |
| DeepSeek Model Support | ✅ Implemented |
| Streaming Responses | ✅ Supported |
| Character Generation | ✅ Available |
| Database Tracking | ✅ modelType field |
| Error Handling | ✅ Fallbacks in place |
| Reasoning Content Separation | ⚠️ Combined (enhancement possible) |

The TypeScript implementation successfully adapts the Python DeepSeek example to the Next.js environment while maintaining all core functionality and adding database persistence, error handling, and character generation capabilities.

---

**Reference:** deepseek_example.py  
**Implementation:** lib/aiProvider.ts, app/api/match/route.ts, app/api/chat/route.ts  
**Status:** ✅ Production Ready
