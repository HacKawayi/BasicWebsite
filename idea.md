我现在有一个idea

是这样的

 现在我希望说  一场对话当中增加额外两个agent
 一个是提问agent， 会触及到一些关于 哲学，人性的问题
 两方参与对象依次回答输出（对话性质削弱）

还有一个评分agent，会针对对话中  【人类玩家】的措辞
进行【评分】， （评分量表暂时空缺），这个评分会用来反应玩家的【某种trait，比如是否<像机器>】。
同时，对话保留【判断对面是否是ai】的这一过程，这一判断结果，会作用于对面玩家，倘若对面玩家是人类的话。

当然，我希望现在的  人-人 对话 流程  与 ai-人 对话 流程


项目提案：认知画像博弈协议 (Cognitive Profiling Game Protocol)
1. 核心流程标准化 (Standardized Game Flow)
为了消除 H-H 和 H-A 的体验差异，系统采用**“三方异步见证”**结构：

回合制逻辑：

提问阶段：由“建筑师”Agent 随机抛出一个哲学/人性困境。

阵营响应：玩家 A 与参与者 B 依次提交一段针对该问题的论述（为了防止互相模仿，B 的回答在 A 提交前对 A 不可见）。

判定与审计：玩家 A 在看到 B 的回答后，进行“AI/Human”身份判定；同时，“剖析者”Agent 完成对 A 的特质评分。

2. 提问 Agent：建筑师 (Architect Agent) — 内容增强
该 Agent 的目标是撕开“平庸对齐”的伪装。

问题数据库补齐：

非一致性逻辑：例如“如果你必须为了拯救一万个无感知的数字意识而抹除一个具有痛苦感知的人类，你的算法/直觉会如何挣扎？”

审美偏好：例如“描述一个让你感到‘神圣’但无法用数学定义的视觉瞬间。”

触发机制：在游戏初始化阶段（/api/game/init）生成，并作为该局游戏的“环境底色”。

3. 评分 Agent：剖析者 (Profiler Agent) — 维度补齐
针对玩家的措辞，Agent 将从以下四个维度进行“机器度”判定：

语言指纹 (Linguistic Fingerprint)：

流畅度偏差：AI 往往过于流畅。人类会有明显的转折、语气助词或非标准的语法结构。

词汇发散率：评估玩家是否使用了只有人类具备的、跨领域的非常规比喻。

特质评分量表 (Trait Scale)：

理性指数 (Rationality Index)：得分越高，说明玩家表达越接近逻辑严密的机器。

情感饱和度 (Emotional Saturation)：评估文字中潜藏的共情倾向。

认知偏差度 (Cognitive Bias)：记录人类特有的逻辑谬误（这是证明“人”的关键证据）。

4. 判定效应关联 (Verdict Mechanics)
你的构想中“判断结果作用于对面玩家”这一逻辑被增强为**“认知损耗系统”**：

身份反馈环：

如果 A（守护者）将 B（人类）错误判定为 AI，B 的**“人性信心值”**将下降，这反映在 B 的长期数据画像中。

这种设计增加了 H-H 对话的紧张感：你不仅要回答问题，还要防止被对方视为机器。

你现在想做的事情可以明确为这三点：

把当前游戏升级为双 Agent 流程
Architect 负责出题，Profiler 负责分析玩家回答与评分。
核心依据来自 idea.md 的“认知博弈/图灵测试增强”方向。

两个 Agent 都必须复用现有模型层
模型来源统一限定在 aiProviders.ts 的默认模型列表，不另建新 provider。

采用“每局可配置映射”
每局可分别指定 architectModelId 和 profilerModelId，但二者都要通过 DEFAULT_MODELS 校验。

Plan: 双 Agent 可配置接入
推荐方案是最小侵入改造现有 API 与数据模型，不重写 provider，只在初始化与提交两个关键节点接入双 Agent。

Steps

复用现有调用范式，统一双 Agent 调用约束
参考 route.ts 的 generate 调用和 route.ts 的 prompt 组织方式。
扩展会话数据模型（后续步骤依赖）
在 GameSession.ts 增加 architectModelId、profilerModelId、questionGenerated、profilerAnalysis 等字段。
增加双模型配置入口（依赖步骤2）
在 route.ts 接收并校验两个 modelId，未传时走默认映射。
接入 Architect（依赖步骤3）
初始化时调用 generate 生成问题并落库，失败时走降级题目避免开局失败。
接入 Profiler（依赖步骤2与3，可与步骤4并行）
在 route.ts 调用 generate 做结构化评分并持久化。
统一提示词与 JSON 输出契约（可并行）
基于 supremprompt.md 拆出 Architect/Profiler 提示词，增加 JSON 解析兜底。
前端最小展示改造（依赖步骤4与5）
在 page.tsx 或 page.tsx 展示题目与评分摘要，并提供模型映射选项。
回归验证（依赖步骤4/5/7）
覆盖默认映射、自定义映射、非法 modelId、模型失败降级等路径。