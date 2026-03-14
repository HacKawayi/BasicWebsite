'use client';

import { useRouter } from 'next/navigation';

// 生成向内坠落的红色量子通道动画，和 CLAW NEURAL LAB 背景完全一致
const QuantumServer = () => (
  <div className="absolute inset-0 overflow-hidden bg-black flex items-center justify-center pointer-events-none z-0">
    {Array.from({ length: 5 }).map((_, i) => (
      <div 
        key={i} 
        className="absolute inset-0 border-[50px] border-red-900 opacity-0" 
        style={{ animation: `tunnel-dive 4s linear infinite`, animationDelay: `${i * 0.8}s` }}
      ></div>
    ))}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] z-10"></div>
  </div>
);

export default function ChallengeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="relative w-full min-h-screen bg-black text-red-50 font-mono overflow-hidden select-none">
      
      {/* 补充隧道动画和扫描线样式 */}
      <style>{`
        @keyframes tunnel-dive { 0% { opacity: 0; transform: scale(0.5); } 50% { opacity: 0.5; } 100% { opacity: 0; transform: scale(2); } }
        .scanlines {
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
          background-size: 100% 4px;
        }
      `}</style>
      
      {/* 沉浸式背景 */}
      <QuantumServer />
      <div className="scanlines absolute inset-0 pointer-events-none opacity-20 z-0"></div>

      {/* ✅ 悬浮返回按键 (深红骇客风格) */}
      <button
        onClick={() => {
          // 点击后跳回大厅，由于上一步我们写了 sessionStorage 记忆，
          // 这里会自动瞬间打开 CLAW NEURAL LAB 界面，无缝衔接！
          router.push('/turingchat');
        }}
        className="fixed top-6 left-8 z-[9999] px-4 py-2 border-2 bg-black/80 backdrop-blur-md font-mono text-sm tracking-widest flex items-center gap-2 group transition-all border-red-800 text-red-500 hover:bg-red-900/50 hover:border-red-400 cursor-pointer"
      >
        <span className="group-hover:-translate-x-1 transition-transform">◄</span> RETURN
      </button>

      {/* 关卡主体内容区域 (加了 pt-24 防止返回键挡住关卡内容) */}
      <div className="relative z-10 w-full h-full min-h-screen pt-24 px-8 pb-8">
         {children}
      </div>

    </div>
  );
}