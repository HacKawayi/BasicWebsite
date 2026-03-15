'use client';

import { useState } from 'react';
import Link from 'next/link';

// 评价标准数据
const criteria = [
  {
    title: "1. 底层动力：主动生存 vs 被动反应（Instinct/Passive）",
    content: "人是主动索取、主动思考、主动行动的动物，因此在聊天中会具有主动产出的能力，去展开一些未在规定范围之内的行动。反之，AI是受指令限制的机器，绝对不会做出违背指令的行为。这一项考量了人的\"主体性思维\"。",
    image: (
      <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto mb-6">
        <defs>
          <linearGradient id="brainGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        {/* 简化的大脑形状 */}
        <path d="M20 50 Q20 30 35 25 Q50 20 65 25 Q80 30 80 50 Q80 70 65 75 Q50 80 35 75 Q20 70 20 50" fill="url(#brainGrad1)" stroke="#A855F7" strokeWidth="2"/>
        {/* 神经连接线 */}
        <line x1="35" y1="35" x2="50" y2="40" stroke="#06B6D4" strokeWidth="2"/>
        <line x1="65" y1="35" x2="50" y2="40" stroke="#06B6D4" strokeWidth="2"/>
        <line x1="35" y1="65" x2="50" y2="60" stroke="#06B6D4" strokeWidth="2"/>
        <line x1="65" y1="65" x2="50" y2="60" stroke="#06B6D4" strokeWidth="2"/>
        {/* 脉冲效果 */}
        <circle cx="50" cy="50" r="3" fill="#FFFFFF" opacity="0.8">
          <animate attributeName="r" values="3;8;3" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
        </circle>
      </svg>
    )
  },
  {
    title: "2. 情绪体验：共情体验 vs 语意映射（Empathy/Linguistic）",
    content: "人理解事物的方式是将一段故事和经历代入自身，即，直接而感性的。因此，聊天的走向也将是符合感情波动的。AI对聊天走向的判断是根据语意进行分析的，是判断多种潜在意思的可能性并挑出最可能的那个。所以AI的聊天总会显得那么圆滑，却又，那么不像人。",
    image: (
      <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto mb-6">
        <defs>
          <linearGradient id="heartGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        {/* 心形 */}
        <path d="M50 80 Q30 60 30 45 Q30 30 45 30 Q50 30 55 35 Q60 30 75 30 Q90 30 90 45 Q90 60 70 80 Q50 95 50 80" fill="url(#heartGrad2)" stroke="#EC4899" strokeWidth="2"/>
        {/* 波形线表示情感波动 */}
        <path d="M20 50 Q30 40 40 50 Q50 60 60 50 Q70 40 80 50" stroke="#8B5CF6" strokeWidth="3" fill="none" strokeLinecap="round">
          <animate attributeName="stroke-dasharray" values="0,100;100,0" dur="3s" repeatCount="indefinite"/>
        </path>
        {/* 脉动效果 */}
        <circle cx="50" cy="50" r="2" fill="#FFFFFF">
          <animate attributeName="r" values="2;6;2" dur="1.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite"/>
        </circle>
      </svg>
    )
  },
  {
    title: "3. 思维方式：发散创造 vs 理性计算（Creativity/Rationality）",
    content: "正常人的思维方式一定无法做到事事有理、句句有理，而是常常有逻辑断裂，不符合最佳解的行动和话语。这种秩序性的缺乏反倒成为人性不可或缺的评价标准。而AI的理性计算会省去所有不符合最佳解的行为，是实用价值拉满但是其他不纳入考虑的绝对理性决策。",
    image: (
      <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto mb-6">
        <defs>
          <linearGradient id="brainGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        {/* 电路板风格的思维网络 */}
        <rect x="10" y="10" width="80" height="80" fill="none" stroke="#06B6D4" strokeWidth="1" rx="5"/>
        {/* 节点 */}
        <circle cx="25" cy="25" r="4" fill="#8B5CF6"/>
        <circle cx="50" cy="25" r="4" fill="#8B5CF6"/>
        <circle cx="75" cy="25" r="4" fill="#8B5CF6"/>
        <circle cx="25" cy="50" r="4" fill="#06B6D4"/>
        <circle cx="50" cy="50" r="4" fill="#06B6D4"/>
        <circle cx="75" cy="50" r="4" fill="#06B6D4"/>
        <circle cx="25" cy="75" r="4" fill="#8B5CF6"/>
        <circle cx="50" cy="75" r="4" fill="#8B5CF6"/>
        <circle cx="75" cy="75" r="4" fill="#8B5CF6"/>
        {/* 连接线 */}
        <line x1="25" y1="25" x2="50" y2="25" stroke="#06B6D4" strokeWidth="2"/>
        <line x1="50" y1="25" x2="75" y2="25" stroke="#06B6D4" strokeWidth="2"/>
        <line x1="25" y1="50" x2="50" y2="50" stroke="#8B5CF6" strokeWidth="2"/>
        <line x1="50" y1="50" x2="75" y2="50" stroke="#8B5CF6" strokeWidth="2"/>
        <line x1="25" y1="75" x2="50" y2="75" stroke="#06B6D4" strokeWidth="2"/>
        <line x1="50" y1="75" x2="75" y2="75" stroke="#06B6D4" strokeWidth="2"/>
        {/* 交叉连接 */}
        <line x1="25" y1="25" x2="25" y2="75" stroke="#8B5CF6" strokeWidth="2"/>
        <line x1="50" y1="25" x2="50" y2="75" stroke="#06B6D4" strokeWidth="2"/>
        <line x1="75" y1="25" x2="75" y2="75" stroke="#8B5CF6" strokeWidth="2"/>
        {/* 发散箭头 */}
        <polygon points="85,50 95,45 95,55" fill="#8B5CF6">
          <animateTransform attributeName="transform" type="rotate" values="0 90 50;360 90 50" dur="4s" repeatCount="indefinite"/>
        </polygon>
      </svg>
    )
  },
  {
    title: "4. 成长轨迹：实体生命 vs 数据拟合（Authenticity/Simulation）",
    content: "人之所以深邃，是因为他人生经历的广博酿造了独一无二的价值观和思考。因此，在不同阶段的人、不同年龄的人所表现出的思考和语言表达是截然不同的，这正是因为人的语言取决于他的经验和思想。AI是通过海量数据采集产生的\"博物馆\"，他并不会认为哪一种价值观更正确，也不会认为哪一种价值观为他所有。因此，AI的对话缺乏的人性来自于它对自己身份认同的无知。",
    image: (
      <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto mb-6">
        <defs>
          <linearGradient id="growthGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        {/* 成长曲线 */}
        <path d="M15 80 Q25 70 35 75 Q45 65 55 70 Q65 60 75 65 Q85 55 85 50" stroke="url(#growthGrad4)" strokeWidth="4" fill="none" strokeLinecap="round">
          <animate attributeName="stroke-dasharray" values="0,200;200,0" dur="3s" repeatCount="indefinite"/>
        </path>
        {/* 数据点 */}
        <circle cx="15" cy="80" r="3" fill="#10B981"/>
        <circle cx="35" cy="75" r="3" fill="#10B981"/>
        <circle cx="55" cy="70" r="3" fill="#10B981"/>
        <circle cx="75" cy="65" r="3" fill="#10B981"/>
        <circle cx="85" cy="50" r="3" fill="#8B5CF6"/>
        {/* 网格背景 */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#06B6D4" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        {/* 脉动数据点 */}
        <circle cx="85" cy="50" r="5" fill="none" stroke="#8B5CF6" strokeWidth="2">
          <animate attributeName="r" values="5;10;5" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
        </circle>
      </svg>
    )
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
              {/* 图片 */}
              {criteria[currentIndex].image}
              
              <h2 className="text-2xl md:text-3xl font-bold text-purple-300 mb-6 text-center">
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