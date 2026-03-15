'use client';

import { useState } from 'react';
import Link from 'next/link';

// 评价标准数据
const criteria = [
  {
    title: "1. 底层动力：主动生存 vs 被动反应（Instinct/Passive）",
    content: "人是主动索取、主动思考、主动行动的动物，因此在聊天中会具有主动产出的能力，去展开一些未在规定范围之内的行动。反之，AI是受指令限制的机器，绝对不会做出违背指令的行为。这一项考量了人的“主体性思维”。"
  },
  {
    title: "2. 情绪体验：共情体验 vs 语意映射（Empathy/Linguistic）",
    content: "人理解事物的方式是将一段故事和经历代入自身，即，直接而感性的。因此，聊天的走向也将是符合感情波动的。AI对聊天走向的判断是根据语意进行分析的，是判断多种潜在意思的可能性并挑出最可能的那个。所以AI的聊天总会显得那么圆滑，却又，那么不像人。"
  },
  {
    title: "3. 思维方式：发散创造 vs 理性计算（Creativity/Rationality）",
    content: "正常人的思维方式一定无法做到事事有理、句句有理，而是常常有逻辑断裂，不符合最佳解的行动和话语。这种秩序性的缺乏反倒成为人性不可或缺的评价标准。而AI的理性计算会省去所有不符合最佳解的行为，是实用价值拉满但是其他不纳入考虑的绝对理性决策。"
  },
  {
    title: "4. 成长轨迹：实体生命 vs 数据拟合（Authenticity/Simulation）",
    content: "人之所以深邃，是因为他人生经历的广博酿造了独一无二的价值观和思考。因此，在不同阶段的人、不同年龄的人所表现出的思考和语言表达是截然不同的，这正是因为人的语言取决于他的经验和思想。AI是通过海量数据采集产生的“博物馆”，他并不会认为哪一种价值观更正确，也不会认为哪一种价值观为他所有。因此，AI的对话缺乏的人性来自于它对自己身份认同的无知。"
  }
];

export default function DetailsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % criteria.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + criteria.length) % criteria.length);
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden">
      {/* 背景效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)]"></div>

      {/* 内容 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* 返回按钮 */}
        <div className="absolute top-8 left-8">
          <Link href="/" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded transition-colors">
            ← 返回主页
          </Link>
        </div>

        {/* 标题 */}
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          评价标准详解
        </h1>

        {/* 滚动内容 */}
        <div className="w-full max-w-4xl">
          <div className="relative overflow-hidden rounded-lg bg-black/50 backdrop-blur-sm border border-purple-500/30 p-8">
            {/* 当前内容 */}
            <div className="min-h-[400px] flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-purple-300 mb-6">
                {criteria[currentIndex].title}
              </h2>
              <p className="text-lg leading-relaxed text-gray-300">
                {criteria[currentIndex].content}
              </p>
            </div>

            {/* 导航按钮 */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={prev}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded transition-colors disabled:opacity-50"
                disabled={currentIndex === 0}
              >
                上一条
              </button>

              {/* 指示器 */}
              <div className="flex space-x-2">
                {criteria.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentIndex ? 'bg-purple-400' : 'bg-gray-600'
                    }`}
                  ></div>
                ))}
              </div>

              <button
                onClick={next}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded transition-colors disabled:opacity-50"
                disabled={currentIndex === criteria.length - 1}
              >
                下一条
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}