  metadata: undefined,
  prediction: undefined,
  reasoning_effort: undefined,
  service_tier: undefined,
  prompt_cache_key: undefined,
  prompt_cache_retention: undefined,
  safety_identifier: undefined,
  messages: [
  {
  role: 'system',
  content: 'You are a character generator. Output only valid JSON.'
},
  {
  role: 'user',
  content: '请**严格生成一个符合以下格式的JSON角色对象**。**仅输出纯JSON，不包含任何额外说明或注释**\n\nJSON结构：{ "character": { id:number, name:string, avatar:string, status:\'online\', profile:{ nickname, gender, age, occupation, location, difficulty, interests[], personality, shortTags[] }, systemPrompt:string, starterMessage:string } }\n\n关键要求：\n1. 头像：**仅使用单个表情符号**（例如：🌸、🎨、🧑‍💻、☕、🚀、🌟）。禁止URL或多个表情符号。\n2. 人物性格：创造独特、令人难忘的角色。包含生活化细节（"通常"、"我觉得"）和生动个人特征。**描述必须简洁（50-80个字符）**。\n3. 难度：使用\'简单\'、\'中等\'或\'困难\'。\'简单\'角色增加轻松日常趣事；\'困难\'角色需更专业深度。\n4. 系统提示：用1-3段文字指导AI如何真实扮演此角色（不暴露AI身份）。包含语气、风格、简洁度要求。**必须简洁**。\n5. 开场白：1-2句话，符合角色性格。**必须简洁**。\n6. 名称/标签：简短、聊天友好关键词。禁止Markdown或特殊转义。\n每次生成需随机创建新角色。打造真实感强的个体：具体兴趣、生活细节、独特小习惯。背景、地点、性格需多样化。**所有描述保持简洁精炼**。'
}
],
  tools: undefined,
  tool_choice: undefined
},
  statusCode: 400,
  responseHeaders: {
  access-control-allow-credentials: 'true',
  access-control-allow-headers: 'DNT,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization',
  access-control-allow-methods: 'OPTION,HEAD,GET,POST',
  access-control-allow-origin: '*',
  access-control-max-age: '1728000',
  connection: 'keep-alive',
  content-length: '143',
  content-type: 'application/json; charset=utf-8',
  date: 'Sat, 14 Mar 2026 15:26:14 GMT',
  modelscope-ratelimit-model-requests-limit: '500',
  modelscope-ratelimit-model-requests-remaining: '477',
  modelscope-ratelimit-requests-limit: '2000',
  modelscope-ratelimit-requests-remaining: '1895',
  set-cookie: 'acw_tc=2f5c8ddc17735019749506330e3a4feb8d0ba27c262d9224de46d2ab5a54f8;path=/;HttpOnly;Max-Age=1800',
  strict-transport-security: 'max-age=15724800; includeSubDomains'
},
  responseBody: '{"errors":{"message":"Model id : Qwen/Qwen2.5-7B-Instruct-1M , has no provider supported","request_id":"f31f863f-9024-4fcb-bafd-f5411f927b73"}}',
  isRetryable: false,
  data: undefined
}
[Match] Total characters successfully generated: 0
[Match] No characters generated, falling back to deterministic mock
[Match] Using deterministic mock for character generation
 POST /api/match 200 in 16.2s
📡 Triggering Pusher event on channel: private-session-match_222_111_1773501975566 with data: {
  sender: '111',
  content: '1',
  role: 'user',
  timestamp: 2026-03-14T15:26:20.713Z
}
📡 Pusher trigger result: Response {
  size: 0,
  timeout: 0,
  Symbol(Body internals): {
    body: PassThrough {
      _events: [Object],
      _readableState: [ReadableState],
      _writableState: [WritableState],
      allowHalfOpen: true,
      _maxListeners: undefined,
      _eventsCount: 2,
      Symbol(shapeMode): true,
      Symbol(kCapture): false,
      Symbol(kCallback): null
    },
    disturbed: false,
    error: null
  },
  Symbol(Response internals): {
    url: 'https://api-ap3.pusher.com/apps/2103224/events?auth_key=3b43f68c976d7b71fa42&auth_timestamp=1773501980&auth_version=1.0&body_md5=1f18847e67a0762842097cb88a7e01a7&auth_signature=927f70bb095645a0425348ea7591b3ba9c93dbcf618b1bf24da51b92ec3531ab',
    status: 200,
    statusText: 'OK',
    headers: Headers { Symbol(map): [Object: null prototype] },
    counter: 0
  }
}
 POST /api/talk 200 in 381ms (compile: 34ms, render: 346ms)
📡 Triggering Pusher event on channel: private-session-match_222_111_1773501975566 with data: {
  sender: '222',
  content: '2',
  role: 'user',
  timestamp: 2026-03-14T15:26:22.304Z
}
📡 Pusher trigger result: Response {
  size: 0,
  timeout: 0,
  Symbol(Body internals): {
    body: PassThrough {
      _events: [Object],
      _readableState: [ReadableState],
      _writableState: [WritableState],
      allowHalfOpen: true,
      _maxListeners: undefined,
      _eventsCount: 2,
      Symbol(shapeMode): true,
      Symbol(kCapture): false,
      Symbol(kCallback): null
    },
    disturbed: false,
    error: null
  },
  Symbol(Response internals): {
    url: 'https://api-ap3.pusher.com/apps/2103224/events?auth_key=3b43f68c976d7b71fa42&auth_timestamp=1773501982&auth_version=1.0&body_md5=80e5789cb5009f0b8d90855da67f7dcb&auth_signature=fe6dc10a1e0c6aa5bbd41857a0c6457c0c8299efa41aabaa43a1e8b7a7187948',
    status: 200,
    statusText: 'OK',
    headers: Headers { Symbol(map): [Object: null prototype] },
    counter: 0
  }
}
 POST /api/talk 200 in 328ms (compile: 38ms, render: 290ms)
[Providers] Model Qwen/Qwen3.5-27B not found in DEFAULT_MODELS
[GameInit] Architect question generated {
  sessionId: 'match_222_111_1773501975566',
  requestedModelId: 'Qwen/Qwen3.5-27B',
  resolvedModelId: 'Qwen/Qwen3.5-27B',
  usedFallback: true
}
 POST /api/game/init 200 in 493ms (compile: 22ms, render: 471ms)
📡 Triggering round question on channel: private-session-match_222_111_1773501975566 {
  sessionId: 'match_222_111_1773501975566',
  question: 'When fairness and compassion conflict, which one deserves to lose this time?',
  round: 2,
  timestamp: 1773501983310
}
📡 Round question trigger result: Response {
  size: 0,
  timeout: 0,
  Symbol(Body internals): {
    body: PassThrough {
      _events: [Object],
      _readableState: [ReadableState],
      _writableState: [WritableState],
      allowHalfOpen: true,
      _maxListeners: undefined,
      _eventsCount: 2,
      Symbol(shapeMode): true,
      Symbol(kCapture): false,
      Symbol(kCallback): null
    },
    disturbed: false,
    error: null
  },
  Symbol(Response internals): {
    url: 'https://api-ap3.pusher.com/apps/2103224/events?auth_key=3b43f68c976d7b71fa42&auth_timestamp=1773501983&auth_version=1.0&body_md5=1061fbd9a205a50d25d9e8dfcdd7fa9e&auth_signature=06cb7f5c7abc39cfc9b7243c7929421fc9eab3f3d18daeb260e81e8bb3eb0ff0',
    status: 200,
    statusText: 'OK',
    headers: Headers { Symbol(map): [Object: null prototype] },
    counter: 0
  }
}
 POST /api/talk 200 in 110ms (compile: 41ms, render: 69ms)
[LongCat] Generation failed: AI_RetryError: Failed after 3 attempts. Last error: AppId:**wP34 达到使用量上限
    at async AIModelProvider.generate (lib/aiProviders.ts:155:22)
    at async POST (app/api/match/route.ts:180:24)
  153 |     const promptText = options.prompt || this.formatMessagesToPrompt(options.messages || []);
  154 |
> 155 |     const { text } = await generateText({
      |                      ^
  156 |       model,
  157 |       system: options.system,
  158 |       prompt: promptText, {
  cause: undefined,
  reason: 'maxRetriesExceeded',
  errors: [
  AI_APICallError: AppId:**wP34 达到使用量上限
    at ignore-listed frames {
  cause: undefined,
  url: 'https://api-inference.modelscope.cn/v1/chat/completions',
  requestBodyValues: {
  model: 'meituan-longcat/LongCat-Flash-Lite',
  logit_bias: undefined,
  logprobs: undefined,
  top_logprobs: undefined,
  user: undefined,
  parallel_tool_calls: undefined,
  max_tokens: 300,
  temperature: 0.7,
  top_p: undefined,
  frequency_penalty: undefined,
  presence_penalty: undefined,
  response_format: undefined,
  stop: undefined,
  seed: undefined,
  verbosity: undefined,
  max_completion_tokens: undefined,
  store: undefined,
  metadata: undefined,
  prediction: undefined,
  reasoning_effort: undefined,
  service_tier: undefined,
  prompt_cache_key: undefined,
  prompt_cache_retention: undefined,
  safety_identifier: undefined,
  messages: [
  {
  role: 'system',
  content: 'You are a character generator. Output only valid JSON.'
},
  {
  role: 'user',
  content: '请**严格生成一个符合以下格式的JSON角色对象**。**仅输出纯JSON，不包含任何额外说明或注释**\n\nJSON结构：{ "character": { id:number, name:string, avatar:string, status:\'online\', profile:{ nickname, gender, age, occupation, location, difficulty, interests[], personality, shortTags[] }, systemPrompt:string, starterMessage:string } }\n\n关键要求：\n1. 头像：**仅使用单个表情符号**（例如：🌸、🎨、🧑‍💻、☕、🚀、🌟）。禁止URL或多个表情符号。\n2. 人物性格：创造独特、令人难忘的角色。包含生活化细节（"通常"、"我觉得"）和生动个人特征。**描述必须简洁（50-80个字符）**。\n3. 难度：使用\'简单\'、\'中等\'或\'困难\'。\'简单\'角色增加轻松日常趣事；\'困难\'角色需更专业深度。\n4. 系统提示：用1-3段文字指导AI如何真实扮演此角色（不暴露AI身份）。包含语气、风格、简洁度要求。**必须简洁**。\n5. 开场白：1-2句话，符合角色性格。**必须简洁**。\n6. 名称/标签：简短、聊天友好关键词。禁止Markdown或特殊转义。\n每次生成需随机创建新角色。打造真实感强的个体：具体兴趣、生活细节、独特小习惯。背景、地点、性格需多样化。**所有描述保持简洁精炼**。'
}
],
  tools: undefined,
  tool_choice: undefined
},
  statusCode: 429,
  responseHeaders: {
  access-control-allow-credentials: 'true',
  access-control-allow-headers: 'DNT,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization',
  access-control-allow-methods: 'OPTION,HEAD,GET,POST',
  access-control-allow-origin: '*',
  access-control-max-age: '1728000',
  cache-control: 'no-cache',
  connection: 'keep-alive',
  content-type: 'application/json',
  date: 'Sat, 14 Mar 2026 15:26:13 GMT',
  modelscope-ratelimit-model-requests-limit: '500',
  modelscope-ratelimit-model-requests-remaining: '458',
  modelscope-ratelimit-requests-limit: '2000',
  modelscope-ratelimit-requests-remaining: '1897',
  set-cookie: 'acw_tc=2f5c8ddc17735019729176318e3a4f3bbc0c4ee1cbcd2f8af3f73a8b59bdbc;path=/;HttpOnly;Max-Age=1800',
  strict-transport-security: 'max-age=15724800; includeSubDomains',
  transfer-encoding: 'chunked'
},
  responseBody: '{"error":{"code":"too_many_requests","message":"AppId:**wP34 达到使用量上限","type":"rate_limit_error"},"request_id":"8874a169-04a0-4c7e-bb09-3b60b7c0521e"}',
  isRetryable: true,
  data: {
  error: {
  message: 'AppId:**wP34 达到使用量上限',
  type: 'rate_limit_error',
  code: 'too_many_requests'
}
}
},
  AI_APICallError: AppId:**wP34 达到使用量上限
    at ignore-listed frames {
  cause: undefined,
  url: 'https://api-inference.modelscope.cn/v1/chat/completions',
  requestBodyValues: {
  model: 'meituan-longcat/LongCat-Flash-Lite',
  logit_bias: undefined,
  logprobs: undefined,
  top_logprobs: undefined,
  user: undefined,
  parallel_tool_calls: undefined,
  max_tokens: 300,
  temperature: 0.7,
  top_p: undefined,
  frequency_penalty: undefined,
  presence_penalty: undefined,
  response_format: undefined,
  stop: undefined,
  seed: undefined,
  verbosity: undefined,
  max_completion_tokens: undefined,
  store: undefined,
  metadata: undefined,
  prediction: undefined,
  reasoning_effort: undefined,
  service_tier: undefined,
  prompt_cache_key: undefined,
  prompt_cache_retention: undefined,
  safety_identifier: undefined,
  messages: [
  {
  role: 'system',
  content: 'You are a character generator. Output only valid JSON.'
},
  {
  role: 'user',
  content: '请**严格生成一个符合以下格式的JSON角色对象**。**仅输出纯JSON，不包含任何额外说明或注释**\n\nJSON结构：{ "character": { id:number, name:string, avatar:string, status:\'online\', profile:{ nickname, gender, age, occupation, location, difficulty, interests[], personality, shortTags[] }, systemPrompt:string, starterMessage:string } }\n\n关键要求：\n1. 头像：**仅使用单个表情符号**（例如：🌸、🎨、🧑‍💻、☕、🚀、🌟）。禁止URL或多个表情符号。\n2. 人物性格：创造独特、令人难忘的角色。包含生活化细节（"通常"、"我觉得"）和生动个人特征。**描述必须简洁（50-80个字符）**。\n3. 难度：使用\'简单\'、\'中等\'或\'困难\'。\'简单\'角色增加轻松日常趣事；\'困难\'角色需更专业深度。\n4. 系统提示：用1-3段文字指导AI如何真实扮演此角色（不暴露AI身份）。包含语气、风格、简洁度要求。**必须简洁**。\n5. 开场白：1-2句话，符合角色性格。**必须简洁**。\n6. 名称/标签：简短、聊天友好关键词。禁止Markdown或特殊转义。\n每次生成需随机创建新角色。打造真实感强的个体：具体兴趣、生活细节、独特小习惯。背景、地点、性格需多样化。**所有描述保持简洁精炼**。'
}
],
  tools: undefined,
  tool_choice: undefined
},
  statusCode: 429,
  responseHeaders: {
  access-control-allow-credentials: 'true',
  access-control-allow-headers: 'DNT,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization',
  access-control-allow-methods: 'OPTION,HEAD,GET,POST',
  access-control-allow-origin: '*',
  access-control-max-age: '1728000',
  cache-control: 'no-cache',
  connection: 'keep-alive',
  content-type: 'application/json',
  date: 'Sat, 14 Mar 2026 15:26:15 GMT',
  modelscope-ratelimit-model-requests-limit: '500',
  modelscope-ratelimit-model-requests-remaining: '456',
  modelscope-ratelimit-requests-limit: '2000',
  modelscope-ratelimit-requests-remaining: '1894',
  set-cookie: 'acw_tc=2f5c8ddc17735019751986332e3a4f01bc3671d7ca76e37a4bcab95135e89a;path=/;HttpOnly;Max-Age=1800',
  strict-transport-security: 'max-age=15724800; includeSubDomains',
  transfer-encoding: 'chunked'
},
  responseBody: '{"error":{"code":"too_many_requests","message":"AppId:**wP34 达到使用量上限","type":"rate_limit_error"},"request_id":"e3b90fbe-213f-4166-a1d6-0ea8b7d71afd"}',
  isRetryable: true,
  data: {
  error: {
  message: 'AppId:**wP34 达到使用量上限',
  type: 'rate_limit_error',
  code: 'too_many_requests'
}
}
},
  AI_APICallError: AppId:**wP34 达到使用量上限
    at ignore-listed frames {
  cause: undefined,
  url: 'https://api-inference.modelscope.cn/v1/chat/completions',
  requestBodyValues: {
  model: 'meituan-longcat/LongCat-Flash-Lite',
  logit_bias: undefined,
  logprobs: undefined,
  top_logprobs: undefined,
  user: undefined,
  parallel_tool_calls: undefined,
  max_tokens: 300,
  temperature: 0.7,
  top_p: undefined,
  frequency_penalty: undefined,
  presence_penalty: undefined,
  response_format: undefined,
  stop: undefined,
  seed: undefined,
  verbosity: undefined,
  max_completion_tokens: undefined,
  store: undefined,
  metadata: undefined,
  prediction: undefined,
  reasoning_effort: undefined,
  service_tier: undefined,
  prompt_cache_key: undefined,
  prompt_cache_retention: undefined,
  safety_identifier: undefined,
  messages: [
  {
  role: 'system',
  content: 'You are a character generator. Output only valid JSON.'
},
  {
  role: 'user',
  content: '请**严格生成一个符合以下格式的JSON角色对象**。**仅输出纯JSON，不包含任何额外说明或注释**\n\nJSON结构：{ "character": { id:number, name:string, avatar:string, status:\'online\', profile:{ nickname, gender, age, occupation, location, difficulty, interests[], personality, shortTags[] }, systemPrompt:string, starterMessage:string } }\n\n关键要求：\n1. 头像：**仅使用单个表情符号**（例如：🌸、🎨、🧑‍💻、☕、🚀、🌟）。禁止URL或多个表情符号。\n2. 人物性格：创造独特、令人难忘的角色。包含生活化细节（"通常"、"我觉得"）和生动个人特征。**描述必须简洁（50-80个字符）**。\n3. 难度：使用\'简单\'、\'中等\'或\'困难\'。\'简单\'角色增加轻松日常趣事；\'困难\'角色需更专业深度。\n4. 系统提示：用1-3段文字指导AI如何真实扮演此角色（不暴露AI身份）。包含语气、风格、简洁度要求。**必须简洁**。\n5. 开场白：1-2句话，符合角色性格。**必须简洁**。\n6. 名称/标签：简短、聊天友好关键词。禁止Markdown或特殊转义。\n每次生成需随机创建新角色。打造真实感强的个体：具体兴趣、生活细节、独特小习惯。背景、地点、性格需多样化。**所有描述保持简洁精炼**。'
}
],
  tools: undefined,
  tool_choice: undefined
},
  statusCode: 429,
  responseHeaders: {
  access-control-allow-credentials: 'true',
  access-control-allow-headers: 'DNT,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization',
  access-control-allow-methods: 'OPTION,HEAD,GET,POST',
  access-control-allow-origin: '*',
  access-control-max-age: '1728000',
  cache-control: 'no-cache',
  connection: 'keep-alive',
  content-length: '163',
  content-type: 'application/json',
  date: 'Sat, 14 Mar 2026 15:26:19 GMT',
  modelscope-ratelimit-model-requests-limit: '500',
  modelscope-ratelimit-model-requests-remaining: '455',
  modelscope-ratelimit-requests-limit: '2000',
  modelscope-ratelimit-requests-remaining: '1893',
  set-cookie: 'acw_tc=2f5c8ddc17735019794466354e3a4f07f6a17df50647bb0a24ea5bfea5a42a;path=/;HttpOnly;Max-Age=1800',
  strict-transport-security: 'max-age=15724800; includeSubDomains'
},
  responseBody: '{"error":{"code":"too_many_requests","message":"AppId:**wP34 达到使用量上限","type":"rate_limit_error"},"request_id":"28ec3776-c922-4d1d-9e07-e72a6740265f"}',
  isRetryable: true,
  data: {
  error: {
  message: 'AppId:**wP34 达到使用量上限',
  type: 'rate_limit_error',
  code: 'too_many_requests'
}
}
}
],
  lastError: AI_APICallError: AppId:**wP34 达到使用量上限
    at ignore-listed frames {
  cause: undefined,
  url: 'https://api-inference.modelscope.cn/v1/chat/completions',
  requestBodyValues: {
  model: 'meituan-longcat/LongCat-Flash-Lite',
  logit_bias: undefined,
  logprobs: undefined,
  top_logprobs: undefined,
  user: undefined,
  parallel_tool_calls: undefined,
  max_tokens: 300,
  temperature: 0.7,
  top_p: undefined,
  frequency_penalty: undefined,
  presence_penalty: undefined,
  response_format: undefined,
  stop: undefined,
  seed: undefined,
  verbosity: undefined,
  max_completion_tokens: undefined,
  store: undefined,
  metadata: undefined,
  prediction: undefined,
  reasoning_effort: undefined,
  service_tier: undefined,
  prompt_cache_key: undefined,
  prompt_cache_retention: undefined,
  safety_identifier: undefined,
  messages: [
  {
  role: 'system',
  content: 'You are a character generator. Output only valid JSON.'
},
  {
  role: 'user',
  content: '请**严格生成一个符合以下格式的JSON角色对象**。**仅输出纯JSON，不包含任何额外说明或注释**\n\nJSON结构：{ "character": { id:number, name:string, avatar:string, status:\'online\', profile:{ nickname, gender, age, occupation, location, difficulty, interests[], personality, shortTags[] }, systemPrompt:string, starterMessage:string } }\n\n关键要求：\n1. 头像：**仅使用单个表情符号**（例如：🌸、🎨、🧑‍💻、☕、🚀、🌟）。禁止URL或多个表情符号。\n2. 人物性格：创造独特、令人难忘的角色。包含生活化细节（"通常"、"我觉得"）和生动个人特征。**描述必须简洁（50-80个字符）**。\n3. 难度：使用\'简单\'、\'中等\'或\'困难\'。\'简单\'角色增加轻松日常趣事；\'困难\'角色需更专业深度。\n4. 系统提示：用1-3段文字指导AI如何真实扮演此角色（不暴露AI身份）。包含语气、风格、简洁度要求。**必须简洁**。\n5. 开场白：1-2句话，符合角色性格。**必须简洁**。\n6. 名称/标签：简短、聊天友好关键词。禁止Markdown或特殊转义。\n每次生成需随机创建新角色。打造真实感强的个体：具体兴趣、生活细节、独特小习惯。背景、地点、性格需多样化。**所有描述保持简洁精炼**。'
}
],
  tools: undefined,
  tool_choice: undefined
},
  statusCode: 429,
  responseHeaders: {
  access-control-allow-credentials: 'true',
  access-control-allow-headers: 'DNT,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization',
  access-control-allow-methods: 'OPTION,HEAD,GET,POST',
  access-control-allow-origin: '*',
  access-control-max-age: '1728000',
  cache-control: 'no-cache',
  connection: 'keep-alive',
  content-length: '163',
  content-type: 'application/json',
  date: 'Sat, 14 Mar 2026 15:26:19 GMT',
  modelscope-ratelimit-model-requests-limit: '500',
  modelscope-ratelimit-model-requests-remaining: '455',
  modelscope-ratelimit-requests-limit: '2000',
  modelscope-ratelimit-requests-remaining: '1893',
  set-cookie: 'acw_tc=2f5c8ddc17735019794466354e3a4f07f6a17df50647bb0a24ea5bfea5a42a;path=/;HttpOnly;Max-Age=1800',
  strict-transport-security: 'max-age=15724800; includeSubDomains'
},
  responseBody: '{"error":{"code":"too_many_requests","message":"AppId:**wP34 达到使用量上限","type":"rate_limit_error"},"request_id":"28ec3776-c922-4d1d-9e07-e72a6740265f"}',
  isRetryable: true,
  data: {
  error: {
  message: 'AppId:**wP34 达到使用量上限',
  type: 'rate_limit_error',
  code: 'too_many_requests'
}
}
}
}
[Qwen] Generation failed: AI_APICallError: Bad Request
    at ignore-listed frames {
  cause: undefined,
  url: 'https://api-inference.modelscope.cn/v1/chat/completions',
  requestBodyValues: {
  model: 'Qwen/Qwen2.5-7B-Instruct-1M',
  logit_bias: undefined,
  logprobs: undefined,
  top_logprobs: undefined,
  user: undefined,
  parallel_tool_calls: undefined,
  max_tokens: 300,
  temperature: 0.7,
  top_p: undefined,
  frequency_penalty: undefined,
  presence_penalty: undefined,
  response_format: undefined,
  stop: undefined,
  seed: undefined,
  verbosity: undefined,
  max_completion_tokens: undefined,
  store: undefined,
  metadata: undefined,
  prediction: undefined,
  reasoning_effort: undefined,
  service_tier: undefined,
  prompt_cache_key: undefined,
  prompt_cache_retention: undefined,
  safety_identifier: undefined,
  messages: [
  {
  role: 'system',
  content: 'You are a character generator. Output only valid JSON.'
},
  {
  role: 'user',
  content: '请**严格生成一个符合以下格式的JSON角色对象**。**仅输出纯JSON，不包含任何额外说明或注释**\n\nJSON结构：{ "character": { id:number, name:string, avatar:string, status:\'online\', profile:{ nickname, gender, age, occupation, location, difficulty, interests[], personality, shortTags[] }, systemPrompt:string, starterMessage:string } }\n\n关键要求：\n1. 头像：**仅使用单个表情符号**（例如：🌸、🎨、🧑‍💻、☕、🚀、🌟）。禁止URL或多个表情符号。\n2. 人物性格：创造独特、令人难忘的角色。包含生活化细节（"通常"、"我觉得"）和生动个人特征。**描述必须简洁（50-80个字符）**。\n3. 难度：使用\'简单\'、\'中等\'或\'困难\'。\'简单\'角色增加轻松日常趣事；\'困难\'角色需更专业深度。\n4. 系统提示：用1-3段文字指导AI如何真实扮演此角色（不暴露AI身份）。包含语气、风格、简洁度要求。**必须简洁**。\n5. 开场白：1-2句话，符合角色性格。**必须简洁**。\n6. 名称/标签：简短、聊天友好关键词。禁止Markdown或特殊转义。\n每次生成需随机创建新角色。打造真实感强的个体：具体兴趣、生活细节、独特小习惯。背景、地点、性格需多样化。**所有描述保持简洁精炼**。'
}
],
  tools: undefined,
  tool_choice: undefined
},
  statusCode: 400,
  responseHeaders: {
  access-control-allow-credentials: 'true',
  access-control-allow-headers: 'DNT,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization',
  access-control-allow-methods: 'OPTION,HEAD,GET,POST',
  access-control-allow-origin: '*',
  access-control-max-age: '1728000',
  connection: 'keep-alive',
  content-length: '143',
  content-type: 'application/json; charset=utf-8',
  date: 'Sat, 14 Mar 2026 15:26:21 GMT',
  modelscope-ratelimit-model-requests-limit: '500',
  modelscope-ratelimit-model-requests-remaining: '476',
  modelscope-ratelimit-requests-limit: '2000',
  modelscope-ratelimit-requests-remaining: '1892',
  set-cookie: 'acw_tc=2f5c8ddc17735019809936363e3a4f877a8a9af721ccb2b1e04abb72bb7195;path=/;HttpOnly;Max-Age=1800',
  strict-transport-security: 'max-age=15724800; includeSubDomains'
},
  responseBody: '{"errors":{"message":"Model id : Qwen/Qwen2.5-7B-Instruct-1M , has no provider supported","request_id":"e5933edd-019d-4c16-bd85-59714cdb7f2e"}}',
  isRetryable: false,
  data: undefined
}
[Match] Total characters successfully generated: 0
[Match] No characters generated, falling back to deterministic mock
[Match] Using deterministic mock for character generation
 POST /api/match 200 in 16.1s
📡 Triggering Pusher event on channel: private-session-match_222_111_1773501975566 with data: {
  sender: '111',
  content: '3',
  role: 'user',
  timestamp: 2026-03-14T15:26:30.033Z
}
📡 Pusher trigger result: Response {
  size: 0,
  timeout: 0,
  Symbol(Body internals): {
    body: PassThrough {
      _events: [Object],
      _readableState: [ReadableState],
      _writableState: [WritableState],
      allowHalfOpen: true,
      _maxListeners: undefined,
      _eventsCount: 2,
      Symbol(shapeMode): true,
      Symbol(kCapture): false,
      Symbol(kCallback): null
    },
    disturbed: false,
    error: null
  },
  Symbol(Response internals): {
    url: 'https://api-ap3.pusher.com/apps/2103224/events?auth_key=3b43f68c976d7b71fa42&auth_timestamp=1773501990&auth_version=1.0&body_md5=8fe80cbf94422ca7c944a33e7dc8e3bf&auth_signature=2d7d7210d6ad152bb9f8a8525a7e4634eaecde5b8eae4b840d6854a8ee58a807',
    status: 200,
    statusText: 'OK',
    headers: Headers { Symbol(map): [Object: null prototype] },
    counter: 0
  }
}
 POST /api/talk 200 in 442ms (compile: 48ms, render: 394ms)
📡 Triggering Pusher event on channel: private-session-match_222_111_1773501975566 with data: {
  sender: '222',
  content: '4',
  role: 'user',
  timestamp: 2026-03-14T15:26:33.767Z
}
📡 Pusher trigger result: Response {
  size: 0,
  timeout: 0,
  Symbol(Body internals): {
    body: PassThrough {
      _events: [Object],
      _readableState: [ReadableState],
      _writableState: [WritableState],
      allowHalfOpen: true,
      _maxListeners: undefined,
      _eventsCount: 2,
      Symbol(shapeMode): true,
      Symbol(kCapture): false,
      Symbol(kCallback): null
    },
    disturbed: false,
    error: null
  },
  Symbol(Response internals): {
    url: 'https://api-ap3.pusher.com/apps/2103224/events?auth_key=3b43f68c976d7b71fa42&auth_timestamp=1773501993&auth_version=1.0&body_md5=f71a1a1d4d1333c4087c1b6fcf2e3d86&auth_signature=52889c8d2e58e3a0456802fb1078176aa426fdc329903499bef878e438fb88e5',
    status: 200,
    statusText: 'OK',
    headers: Headers { Symbol(map): [Object: null prototype] },
    counter: 0
  }
}
 POST /api/talk 200 in 333ms (compile: 36ms, render: 297ms)
[Providers] Model Qwen/Qwen3.5-27B not found in DEFAULT_MODELS
[GameInit] Architect question generated {
  sessionId: 'match_222_111_1773501975566',
  requestedModelId: 'Qwen/Qwen3.5-27B',
  resolvedModelId: 'Qwen/Qwen3.5-27B',
  usedFallback: true
}
 POST /api/game/init 200 in 498ms (compile: 20ms, render: 477ms)
📡 Triggering round question on channel: private-session-match_222_111_1773501975566 {
  sessionId: 'match_222_111_1773501975566',
  question: 'When fairness and compassion conflict, which one deserves to lose this time?',
  round: 3,
  timestamp: 1773501994764
}
📡 Round question trigger result: Response {
  size: 0,
  timeout: 0,
  Symbol(Body internals): {
    body: PassThrough {
      _events: [Object],
      _readableState: [ReadableState],
      _writableState: [WritableState],
      allowHalfOpen: true,
      _maxListeners: undefined,
      _eventsCount: 2,
      Symbol(shapeMode): true,
      Symbol(kCapture): false,
      Symbol(kCallback): null
    },
    disturbed: false,
    error: null
  },
  Symbol(Response internals): {
    url: 'https://api-ap3.pusher.com/apps/2103224/events?auth_key=3b43f68c976d7b71fa42&auth_timestamp=1773501994&auth_version=1.0&body_md5=8c6c3576258a295297ff731a5e6bb8b1&auth_signature=a39b15ddcec961f1c3c3802daf96b7395e932b77c534238c70997829839e468f',
    status: 200,
    statusText: 'OK',
    headers: Headers { Symbol(map): [Object: null prototype] },
    counter: 0
  }
}
 POST /api/talk 200 in 107ms (compile: 36ms, render: 71ms)
📡 Triggering Pusher event on channel: private-session-match_222_111_1773501975566 with data: {
  sender: '111',
  content: '5',
  role: 'user',
  timestamp: 2026-03-14T15:26:36.223Z
}
📡 Pusher trigger result: Response {
  size: 0,
  timeout: 0,
  Symbol(Body internals): {
    body: PassThrough {
      _events: [Object],
      _readableState: [ReadableState],
      _writableState: [WritableState],
      allowHalfOpen: true,
      _maxListeners: undefined,
      _eventsCount: 2,
      Symbol(shapeMode): true,
      Symbol(kCapture): false,
      Symbol(kCallback): null
    },
    disturbed: false,
    error: null
  },
  Symbol(Response internals): {
    url: 'https://api-ap3.pusher.com/apps/2103224/events?auth_key=3b43f68c976d7b71fa42&auth_timestamp=1773501996&auth_version=1.0&body_md5=1e58dc3dba327a688a0b227698c70e66&auth_signature=41d0a5378a6f798ec324badcc5f6508d0c60b838bd42d71680148c0540beece9',
    status: 200,
    statusText: 'OK',
    headers: Headers { Symbol(map): [Object: null prototype] },
    counter: 0
  }
}
 POST /api/talk 200 in 329ms (compile: 40ms, render: 288ms)
📡 Triggering Pusher event on channel: private-session-match_222_111_1773501975566 with data: {
  sender: '222',
  content: '6',
  role: 'user',
  timestamp: 2026-03-14T15:26:39.132Z
}
📡 Pusher trigger result: Response {
  size: 0,
  timeout: 0,
  Symbol(Body internals): {
    body: PassThrough {
      _events: [Object],
      _readableState: [ReadableState],
      _writableState: [WritableState],
      allowHalfOpen: true,
      _maxListeners: undefined,
      _eventsCount: 2,
      Symbol(shapeMode): true,
      Symbol(kCapture): false,
      Symbol(kCallback): null
    },
    disturbed: false,
    error: null
  },
  Symbol(Response internals): {
    url: 'https://api-ap3.pusher.com/apps/2103224/events?auth_key=3b43f68c976d7b71fa42&auth_timestamp=1773501999&auth_version=1.0&body_md5=ba52e8dded337f81d6fc7b0723e1d4b2&auth_signature=643ba7b12ee9ce37c594ec36c0e70664abf6ad4f077d2c0651fda1985fb94334',
    status: 200,
    statusText: 'OK',
    headers: Headers { Symbol(map): [Object: null prototype] },
    counter: 0
  }
}
 POST /api/talk 200 in 333ms (compile: 42ms, render: 291ms)
[Providers] Model Qwen/Qwen3.5-27B not found in DEFAULT_MODELS
[GameInit] Architect question generated {
  sessionId: 'match_222_111_1773501975566',
  requestedModelId: 'Qwen/Qwen3.5-27B',
  resolvedModelId: 'Qwen/Qwen3.5-27B',
  usedFallback: true
}
 POST /api/game/init 200 in 493ms (compile: 19ms, render: 474ms)
📡 Triggering round question on channel: private-session-match_222_111_1773501975566 {
  sessionId: 'match_222_111_1773501975566',
  question: 'When fairness and compassion conflict, which one deserves to lose this time?',
  round: 4,
  timestamp: 1773502000149
}
📡 Round question trigger result: Response {
  size: 0,
  timeout: 0,
  Symbol(Body internals): {
    body: PassThrough {
      _events: [Object],
      _readableState: [ReadableState],
      _writableState: [WritableState],
      allowHalfOpen: true,
      _maxListeners: undefined,
      _eventsCount: 2,
      Symbol(shapeMode): true,
      Symbol(kCapture): false,
      Symbol(kCallback): null
    },
    disturbed: false,
    error: null
  },
  Symbol(Response internals): {
    url: 'https://api-ap3.pusher.com/apps/2103224/events?auth_key=3b43f68c976d7b71fa42&auth_timestamp=1773502000&auth_version=1.0&body_md5=e804ebc0b06e12a91818901a7bda558a&auth_signature=5aa902893dc9db6d7840790ada751f3062fbe2a197e75c6a0c224a0d677260dd',
    status: 200,
    statusText: 'OK',
    headers: Headers { Symbol(map): [Object: null prototype] },
    counter: 0
  }
}
 POST /api/talk 200 in 114ms (compile: 40ms, render: 74ms)
📡 Triggering Pusher event on channel: private-session-match_222_111_1773501975566 with data: {
  sender: '111',
  content: '7',
  role: 'user',
  timestamp: 2026-03-14T15:26:41.161Z
}
📡 Pusher trigger result: Response {
  size: 0,
  timeout: 0,
  Symbol(Body internals): {
    body: PassThrough {
      _events: [Object],
      _readableState: [ReadableState],
      _writableState: [WritableState],
      allowHalfOpen: true,
      _maxListeners: undefined,
      _eventsCount: 2,
      Symbol(shapeMode): true,
      Symbol(kCapture): false,
      Symbol(kCallback): null
    },
    disturbed: false,
    error: null
  },
  Symbol(Response internals): {
    url: 'https://api-ap3.pusher.com/apps/2103224/events?auth_key=3b43f68c976d7b71fa42&auth_timestamp=1773502001&auth_version=1.0&body_md5=5326c5d0c85a902fb3ff44f2b36a006f&auth_signature=4f6130c514129ea848fc70c7c1a50df39c82acd18b20be33f7bc86a69717d7ca',
    status: 200,
    statusText: 'OK',
    headers: Headers { Symbol(map): [Object: null prototype] },
    counter: 0
  }
}
 POST /api/talk 200 in 346ms (compile: 45ms, render: 301ms)
📡 Triggering Pusher event on channel: private-session-match_222_111_1773501975566 with data: {
  sender: '222',
  content: '8',
  role: 'user',
  timestamp: 2026-03-14T15:26:43.064Z
}
📡 Pusher trigger result: Response {
  size: 0,
  timeout: 0,
  Symbol(Body internals): {
    body: PassThrough {
      _events: [Object],
      _readableState: [ReadableState],
      _writableState: [WritableState],
      allowHalfOpen: true,
      _maxListeners: undefined,
      _eventsCount: 2,
      Symbol(shapeMode): true,
      Symbol(kCapture): false,
      Symbol(kCallback): null
    },
    disturbed: false,
    error: null
  },
  Symbol(Response internals): {
    url: 'https://api-ap3.pusher.com/apps/2103224/events?auth_key=3b43f68c976d7b71fa42&auth_timestamp=1773502003&auth_version=1.0&body_md5=1891091112504ef913ff15c33181cf6d&auth_signature=ee86f83c123601dab1e393796c033252f01e0e18b41bc2c45422c260496aa2f8',
    status: 200,
    statusText: 'OK',
    headers: Headers { Symbol(map): [Object: null prototype] },
    counter: 0
  }
}
 POST /api/talk 200 in 336ms (compile: 42ms, render: 294ms)
[Providers] Model Qwen/Qwen3.5-27B not found in DEFAULT_MODELS
[GameInit] Architect question generated {
  sessionId: 'match_222_111_1773501975566',
  requestedModelId: 'Qwen/Qwen3.5-27B',
  resolvedModelId: 'Qwen/Qwen3.5-27B',
  usedFallback: true
}
 POST /api/game/init 200 in 503ms (compile: 23ms, render: 480ms)
📡 Triggering round question on channel: private-session-match_222_111_1773501975566 {
  sessionId: 'match_222_111_1773501975566',
  question: 'When fairness and compassion conflict, which one deserves to lose this time?',
  round: 5,
  timestamp: 1773502004070
}
📡 Round question trigger result: Response {
  size: 0,
  timeout: 0,
  Symbol(Body internals): {
    body: PassThrough {
      _events: [Object],
      _readableState: [ReadableState],
      _writableState: [WritableState],
      allowHalfOpen: true,
      _maxListeners: undefined,
      _eventsCount: 2,
      Symbol(shapeMode): true,
      Symbol(kCapture): false,
      Symbol(kCallback): null
    },
    disturbed: false,
    error: null
  },
  Symbol(Response internals): {
    url: 'https://api-ap3.pusher.com/apps/2103224/events?auth_key=3b43f68c976d7b71fa42&auth_timestamp=1773502004&auth_version=1.0&body_md5=9a9aa173b94fa38980989b810b7d1e2c&auth_signature=886c20f3231a09ac90a39beb1dede41d620133858a51a09254ab3776a817bfcd',
    status: 200,
    statusText: 'OK',
    headers: Headers { Symbol(map): [Object: null prototype] },
    counter: 0
  }
}
 POST /api/talk 200 in 114ms (compile: 43ms, render: 72ms)
📡 Triggering Pusher event on channel: private-session-match_222_111_1773501975566 with data: {
  sender: '111',
  content: '9',
  role: 'user',
  timestamp: 2026-03-14T15:26:45.172Z
}
📡 Pusher trigger result: Response {
  size: 0,
  timeout: 0,
  Symbol(Body internals): {
    body: PassThrough {
      _events: [Object],
      _readableState: [ReadableState],
      _writableState: [WritableState],
      allowHalfOpen: true,
      _maxListeners: undefined,
      _eventsCount: 2,
      Symbol(shapeMode): true,
      Symbol(kCapture): false,
      Symbol(kCallback): null
    },
    disturbed: false,
    error: null
  },
  Symbol(Response internals): {
    url: 'https://api-ap3.pusher.com/apps/2103224/events?auth_key=3b43f68c976d7b71fa42&auth_timestamp=1773502005&auth_version=1.0&body_md5=4169a8ef5f9516dab0e287bd30af9477&auth_signature=a8bd73d18f3da3e8dff3aab8f25debd781d94dbe0786e67fc4355a97808a7e34',
    status: 200,
    statusText: 'OK',
    headers: Headers { Symbol(map): [Object: null prototype] },
    counter: 0
  }
}
 POST /api/talk 200 in 341ms (compile: 39ms, render: 302ms)
📡 Triggering phase change on channel: private-session-match_222_111_1773501975566 {
  sessionId: 'match_222_111_1773501975566',
  phase: 'judging',
  timestamp: 1773502005700
}
📡 Phase trigger result: Response {
  size: 0,
  timeout: 0,
  Symbol(Body internals): {
    body: PassThrough {
      _events: [Object],
      _readableState: [ReadableState],
      _writableState: [WritableState],
      allowHalfOpen: true,
      _maxListeners: undefined,
      _eventsCount: 2,
      Symbol(shapeMode): true,
      Symbol(kCapture): false,
      Symbol(kCallback): null
    },
    disturbed: false,
    error: null
  },
  Symbol(Response internals): {
    url: 'https://api-ap3.pusher.com/apps/2103224/events?auth_key=3b43f68c976d7b71fa42&auth_timestamp=1773502005&auth_version=1.0&body_md5=dfe9016fc4a6a74a938efadb5d444c44&auth_signature=65c75e7509c019fda27f5ef7815171eca3e50da28366b2fccf9586860afc0175',
    status: 200,
    statusText: 'OK',
    headers: Headers { Symbol(map): [Object: null prototype] },
    counter: 0
  }
}
 POST /api/talk 200 in 113ms (compile: 40ms, render: 74ms)
[Providers] Model Qwen/Qwen3.5-27B not found in DEFAULT_MODELS
[GameSubmit] Profiler analysis completed {
  sessionId: 'match_222_111_1773501975566',
  playerName: '222',
  requestedModelId: 'Qwen/Qwen3.5-27B',
  resolvedModelId: 'Qwen/Qwen3.5-27B',
  usedFallback: true,
  messageCount: 4
}
 POST /api/game/submit 200 in 900ms (compile: 384ms, render: 515ms)
[Providers] Model Qwen/Qwen3.5-27B not found in DEFAULT_MODELS
[GameSubmit] Profiler analysis completed {
  sessionId: 'match_222_111_1773501975566',
  playerName: '111',
  requestedModelId: 'Qwen/Qwen3.5-27B',
  resolvedModelId: 'Qwen/Qwen3.5-27B',
  usedFallback: true,
  messageCount: 5
}