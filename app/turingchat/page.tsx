'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Pusher from 'pusher-js';

// ==========================================
// 1. VISUAL ASSETS & STYLES
// ==========================================
const styles = `
  @keyframes scan-horizontal { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  @keyframes scan-vertical { 0% { top: 0%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
  @keyframes mech-breath { 0%, 100% { transform: scale(1.1); filter: brightness(1.2); } 50% { transform: scale(1.15); filter: brightness(1.5); } }
  @keyframes blink-cyan { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; box-shadow: 0 0 30px cyan; } }
  @keyframes hud-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @keyframes wave-pulse { 0%, 100% { height: 20%; } 50% { height: 100%; } }
  @keyframes load-bar { 0% { width: 0%; } 100% { width: 100%; } }

  .scanlines {
    background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
    background-size: 100% 4px;
  }
  .neon-strip-h {
    position: absolute; height: 2px; width: 100%;
    background: linear-gradient(90deg, transparent, cyan, transparent);
    background-size: 50% 100%; opacity: 0.8;
    animation: scan-horizontal 3s linear infinite;
  }
  .scanner-beam-v {
    position: absolute; left: 0; width: 100%; height: 2px;
    background: cyan; box-shadow: 0 0 10px cyan, 0 0 20px cyan;
    animation: scan-vertical 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
  .scanner-beam-v.red-beam { background: red; box-shadow: 0 0 10px red, 0 0 20px red; }
  .scanner-beam-v.green-beam { background: #10b981; box-shadow: 0 0 10px #10b981, 0 0 20px #10b981; }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #0f172a; }
  ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #475569; }
`;

const MatrixRainCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return;
    let width = canvas.width = window.innerWidth; let height = canvas.height = window.innerHeight;
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'; const fontSize = 16; const columns = width / fontSize; const drops: number[] = [];
    for (let i = 0; i < columns; i++) drops[i] = Math.random() * -100;
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; ctx.fillRect(0, 0, width, height); ctx.fillStyle = '#22c55e'; ctx.font = `bold ${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]; ctx.fillStyle = Math.random() > 0.95 ? '#fff' : '#22c55e';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize); if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0; drops[i]++;
      }
      requestAnimationFrame(draw);
    };
    const animId = requestAnimationFrame(draw);
    const handleResize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; }; window.addEventListener('resize', handleResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', handleResize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 z-0 bg-black" />;
};

const HorizontalNeonCity = () => {
  const [b, setB] = useState<{h: number, s: number[]}[]>([]);
  useEffect(() => { setB(Array.from({length: 16}).map(() => ({h: 20+Math.random()*80, s: Array.from({length: 3}).map(()=>2+Math.random()*3)}))); }, []);
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#020617]"><div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 via-black to-black"></div><div className="absolute bottom-0 w-full h-1/2 bg-[linear-gradient(transparent_95%,rgba(6,182,212,0.3)_95%)] bg-[length:100%_40px] perspective-origin-bottom transform perspective-1000 rotateX(60deg)"></div><div className="absolute bottom-0 w-full h-full flex items-end justify-center space-x-2 px-4">{b.map((x, i) => (<div key={i} className="relative bg-slate-900 border-x border-cyan-900/50 w-16 md:w-24" style={{ height: `${x.h}%` }}><div className="absolute inset-0 flex flex-col justify-around py-4 opacity-30">{Array.from({length: 20}).map((_, j) => <div key={j} className="w-[80%] mx-auto h-1 bg-cyan-800"></div>)}</div>{x.s.map((duration, k) => <div key={k} className="neon-strip-h" style={{ top: `${20 + k * 30}%`, animationDuration: `${duration}s` }}></div>)}<div className="absolute top-0 w-full h-1 bg-cyan-400 shadow-[0_0_10px_cyan]"></div></div>))}</div></div>
  );
};

const DenseCoreCity = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none bg-black"><div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-black"></div><div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[85%] z-10 flex items-end justify-center"><svg viewBox="0 0 400 400" className="w-full h-full" preserveAspectRatio="none"><defs><pattern id="windows" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse"><rect x="2" y="2" width="2" height="2" fill="cyan" opacity="0.3" /></pattern></defs><rect x="20" y="250" width="60" height="150" fill="#0f172a" stroke="#1e293b" /><rect x="320" y="220" width="70" height="180" fill="#0f172a" stroke="#1e293b" /><path d="M120 400 L120 100 L160 50 L240 50 L280 100 L280 400 Z" fill="#1e293b" /><rect x="140" y="80" width="120" height="320" fill="url(#windows)" /><rect x="195" y="0" width="10" height="50" fill="cyan" className="animate-pulse" /></svg></div></div>
);

const OppressiveTitan = () => (
  <div className="absolute inset-0 overflow-hidden bg-[#030712] flex items-end justify-center pointer-events-none"><div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_40px,#1e293b_40px,#1e293b_41px)] opacity-30"></div><svg viewBox="0 0 400 400" className="w-full h-full transform origin-bottom animate-[mech-breath_6s_infinite_ease-in-out]"><path d="M50 400 L50 200 L100 150 L300 150 L350 200 L350 400 Z" fill="#020617" stroke="#475569" strokeWidth="3" /><path d="M100 400 L120 200 L280 200 L300 400 Z" fill="#1e293b" stroke="#64748b" strokeWidth="2" /><rect x="160" y="100" width="80" height="60" fill="#0f172a" stroke="#94a3b8" strokeWidth="3" /><rect x="170" y="120" width="60" height="10" fill="#300" /><rect x="170" y="120" width="20" height="10" fill="#f87171" className="animate-[scan-horizontal_1s_alternate_infinite] shadow-[0_0_20px_red]" /><circle cx="200" cy="300" r="30" fill="#083344" stroke="#06b6d4" strokeWidth="4" /><circle cx="200" cy="300" r="15" fill="#22d3ee" className="animate-[blink-cyan_2s_infinite]" /></svg><div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div></div>
);

const QuantumServer = () => (
  <div className="absolute inset-0 overflow-hidden bg-black flex items-center justify-center pointer-events-none">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="absolute inset-0 border-[50px] border-gray-900 opacity-0" style={{ animation: `tunnel-dive 4s linear infinite`, animationDelay: `${i * 0.8}s` }}></div>)}<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] z-10"></div></div>
);

const HyperSearch = () => (
  <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center pointer-events-none bg-black/90 backdrop-blur-xl"><div className="relative w-[500px] h-[300px] border-y-2 border-cyan-800 bg-black flex flex-col items-center justify-center p-8 overflow-hidden shadow-2xl"><div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500"></div><div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500"></div><div className="flex items-center gap-8 w-full justify-center mb-8"><div className="w-16 h-16 border-t-2 border-l-2 border-cyan-500 rounded-full animate-[hud-spin_1s_linear_infinite]"></div><div className="text-center"><div className="text-4xl font-black text-white tracking-widest">UPLINKING</div><div className="text-xs font-mono text-cyan-500 mt-2">SECURE CHANNEL // ESTABLISHED</div></div><div className="w-16 h-16 border-b-2 border-r-2 border-cyan-500 rounded-full animate-[hud-spin_1s_linear_infinite_reverse]"></div></div><div className="flex justify-center items-end h-10 gap-1 w-full px-12 mb-6">{Array.from({length: 20}).map((_, i) => <div key={i} className="w-2 bg-cyan-700 animate-[wave-pulse_0.5s_infinite]" style={{animationDelay: `${i*0.05}s`}}></div>)}</div><div className="w-full h-2 bg-gray-800 relative"><div className="absolute top-0 left-0 h-full bg-cyan-400 animate-[load-bar_2s_linear_forwards] shadow-[0_0_10px_cyan]"></div></div></div></div>
);

// ==========================================
// 2. PROCEDURAL AVATARS & FULL BODY MATCHING
// ==========================================

const DetailedCyberAvatar = ({ name, gender, age, className }: { name: string, gender?: 'M'|'F'|'N', age?: number|string, className?: string }) => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseHues = [190, 320, 160, 40, 280, 0, 220]; 
  const bgHue = baseHues[hash % baseHues.length];
  const accentHue = baseHues[(hash + 3) % baseHues.length];
  
  const isFemale = gender === 'F';
  const parsedAge = typeof age === 'number' ? age : parseInt(age as string) || 30;
  const isElder = parsedAge > 55;
  const hasVisor = hash % 2 === 0;
  const hasCyberJaw = hash % 3 === 0;
  const isBald = hash % 4 === 0 && !isFemale;

  return (
    <svg viewBox="0 0 100 100" className={className || "w-full h-full"} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`bg-${hash}`} x1="0" y1="0" x2="100" y2="100"><stop offset="0%" stopColor={`hsl(${bgHue}, 30%, 15%)`} /><stop offset="100%" stopColor="#020617" /></linearGradient>
        <linearGradient id={`skin-${hash}`} x1="0" y1="0" x2="0" y2="100"><stop offset="0%" stopColor={`hsl(${bgHue}, 15%, ${isFemale ? '75%' : '65%'})`} /><stop offset="100%" stopColor={`hsl(${bgHue}, 25%, 35%)`} /></linearGradient>
        <linearGradient id={`visor-${hash}`} x1="0" y1="0" x2="100" y2="0"><stop offset="0%" stopColor={`hsl(${accentHue}, 90%, 60%)`} /><stop offset="50%" stopColor={`hsl(${accentHue}, 60%, 80%)`} /><stop offset="100%" stopColor={`hsl(${accentHue}, 90%, 60%)`} /></linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#bg-${hash})`}/>
      <circle cx="50" cy="50" r="45" stroke={`hsl(${accentHue}, 50%, 30%)`} strokeWidth="1" strokeDasharray="2 6" opacity="0.6"/>
      {isFemale ? (
        <><path d="M 40 70 L 40 100 L 60 100 L 60 70 Z" fill="#0f172a" /><path d="M 43 75 L 43 100 L 57 100 L 57 75 Z" fill={`hsl(${bgHue}, 20%, 30%)`} />
          <path d="M 28 25 L 72 25 L 72 55 L 50 85 L 28 55 Z" fill={`url(#skin-${hash})`} />
          <path d="M 28 55 L 50 85 L 40 55 Z" fill="#000" opacity="0.15" /><path d="M 72 55 L 50 85 L 60 55 Z" fill="#000" opacity="0.15" /></>
      ) : (
        <><path d="M 32 70 L 25 100 L 75 100 L 68 70 Z" fill="#0f172a" /><path d="M 36 75 L 32 100 L 68 100 L 64 75 Z" fill={`hsl(${bgHue}, 20%, 30%)`} />
          <path d="M 22 25 L 78 25 L 78 60 L 60 85 L 40 85 L 22 60 Z" fill={`url(#skin-${hash})`} />
          <path d="M 22 60 L 40 85 L 35 60 Z" fill="#000" opacity="0.2" /><path d="M 78 60 L 60 85 L 65 60 Z" fill="#000" opacity="0.2" /></>
      )}
      {hasCyberJaw && <path d={isFemale ? "M 28 55 L 50 85 L 72 55 L 65 65 L 50 80 L 35 65 Z" : "M 22 60 L 40 85 L 60 85 L 78 60 L 65 70 L 50 80 L 35 70 Z"} fill="#1e293b" stroke={`hsl(${accentHue}, 50%, 50%)`} strokeWidth="1" />}
      {hasVisor ? (
        <g><path d="M 20 40 Q 50 55 80 40 L 75 50 Q 50 65 25 50 Z" fill={`url(#visor-${hash})`} /><path d="M 25 45 Q 50 58 75 45 L 72 50 Q 50 62 28 50 Z" fill="#fff" opacity="0.5" /></g>
      ) : (
        <g><rect x="30" y="42" width="15" height="8" rx="2" fill="#0f172a" /><rect x="55" y="42" width="15" height="8" rx="2" fill="#0f172a" /><circle cx="37.5" cy="46" r="2.5" fill={`hsl(${accentHue}, 90%, 60%)`} /><circle cx="62.5" cy="46" r="2.5" fill={`hsl(${accentHue}, 90%, 60%)`} /><path d="M 45 46 L 55 46" stroke={`hsl(${accentHue}, 90%, 60%)`} strokeWidth="1" opacity="0.5"/></g>
      )}
      <path d="M 50 45 L 50 65 L 45 68" stroke="#000" strokeWidth="1.5" opacity="0.2" fill="none"/>
      {isFemale ? <path d="M 45 75 Q 50 78 55 75" stroke={`hsl(${bgHue}, 50%, 40%)`} strokeWidth="2" fill="none"/> : <path d="M 42 75 L 58 75" stroke="#1e293b" strokeWidth="1.5" fill="none"/>}
      {isFemale ? (
        <path d="M 20 50 C 15 20 40 5 50 5 C 60 5 85 20 80 50 L 72 25 C 60 10 40 10 28 25 Z" fill={`hsl(${accentHue}, 40%, 25%)`} />
      ) : (
        isBald ? <circle cx="50" cy="20" r="20" fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 8"/> : <path d="M 18 35 C 20 10 80 10 82 35 L 75 20 C 60 5 40 5 25 20 Z" fill={`hsl(${accentHue}, 20%, 20%)`} />
      )}
      {isElder && <g stroke="#000" strokeWidth="1" opacity="0.2" fill="none"><path d="M 35 65 Q 50 75 65 65" /><path d="M 30 55 Q 40 60 45 55" /><path d="M 70 55 Q 60 60 55 55" /></g>}
    </svg>
  );
};

const CyberBodyScan = ({ name, gender, age, isReal }: { name: string, gender?: 'M'|'F'|'N', age?: number|string, isReal?: boolean }) => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const color = isReal ? '16, 185, 129' : (gender === 'N' ? '239, 68, 68' : '6, 182, 212'); 
  const isFemale = gender === 'F';
  const hasVisor = hash % 2 === 0;
  const hasCyberJaw = hash % 3 === 0;
  const isBald = hash % 4 === 0 && !isFemale;
  const bodyVariant = hash % 3; 

  return (
    <div className="relative w-full h-full bg-[#020617] overflow-hidden flex items-center justify-center border border-slate-800">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]"></div>
      <svg viewBox="0 0 100 200" className="w-[85%] h-[95%] opacity-80 z-10" fill="none">
        <defs><filter id="glow"><feGaussianBlur stdDeviation="1.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <g stroke={`rgb(${color})`} strokeWidth="1.2" filter="url(#glow)">
          <g transform="translate(50, 20) scale(0.35) translate(-50, -50)">
            {isFemale ? <path d="M 28 25 L 72 25 L 72 55 L 50 85 L 28 55 Z" /> : <path d="M 22 25 L 78 25 L 78 60 L 60 85 L 40 85 L 22 60 Z" />}
            {hasVisor ? <path d="M 20 40 Q 50 55 80 40 L 75 50 Q 50 65 25 50 Z" fill={`rgba(${color}, 0.5)`} /> : <><rect x="30" y="42" width="15" height="8"/><rect x="55" y="42" width="15" height="8"/></>}
            {hasCyberJaw && <path d={isFemale ? "M 28 55 L 50 85 L 72 55 L 65 65 L 50 80 L 35 65 Z" : "M 22 60 L 40 85 L 60 85 L 78 60 L 65 70 L 50 80 L 35 70 Z"} strokeWidth="3" />}
            {isFemale ? <path d="M 20 50 C 15 20 40 5 50 5 C 60 5 85 20 80 50 L 72 25" /> : (!isBald && <path d="M 18 35 C 20 10 80 10 82 35" />)}
          </g>
          <line x1="50" y1="36" x2="50" y2="45" />
          {isFemale ? (
            <g>
              <path d="M 50 45 L 35 50 L 65 50 Z" /><path d="M 35 50 L 42 85 L 58 85 L 65 50" /><path d="M 42 85 L 35 110 L 65 110 L 58 85" /><polyline points="35,50 28,85 30,120" />
              {bodyVariant === 1 ? <polyline points="65,50 78,85 75,120" strokeWidth="3" strokeDasharray="2 2" /> : <polyline points="65,50 72,85 70,120" />}
              <polyline points="40,110 37,155 40,195" /><polyline points="60,110 63,155 60,195" />
            </g>
          ) : (
            <g>
              <path d="M 50 45 L 25 50 L 75 50 Z" /><path d="M 25 50 L 38 90 L 62 90 L 75 50" /><path d="M 38 90 L 42 110 L 58 110 L 62 90" /><polyline points="25,50 18,90 22,130" />
              {bodyVariant === 1 ? <polyline points="75,50 88,90 85,130" strokeWidth="4" strokeDasharray="3 3" /> : <polyline points="75,50 82,90 78,130" />}
              <polyline points="44,110 42,155 44,195" /><polyline points="56,110 58,155 56,195" />
            </g>
          )}
          {bodyVariant === 2 && <path d="M 25 50 L 15 140 L 85 140 L 75 50" strokeDasharray="5 5" opacity="0.4" />}
          <circle cx="50" cy="45" r="1.5" fill={`rgb(${color})`} /><circle cx={isFemale?42:38} cy={isFemale?85:90} r="1.5" fill={`rgb(${color})`} /><circle cx={isFemale?58:62} cy={isFemale?85:90} r="1.5" fill={`rgb(${color})`} />
        </g>
      </svg>
      <div className={`scanner-beam-v z-20 ${isReal ? 'green-beam' : (gender === 'N' ? 'red-beam' : '')}`}></div>
      <div className="absolute top-2 left-2 text-[8px] font-mono opacity-70" style={{ color: `rgb(${color})` }}>
        SYS_SYNC: [{hash}]<br/>CLASS: {bodyVariant===0?'STD':bodyVariant===1?'AUG':'TCH'}
      </div>
    </div>
  );
};

// ==========================================
// 3. TYPES, CATEGORIES & ROSTERS
// ==========================================
type CategoryType = 'MERC' | 'NET' | 'SCAV' | 'ANOMALY';
type GuardianMode = 'chat' | 'judge' | null;

interface User {
  id: string; name: string; status: 'online'; isReal?: boolean; profile?: any; systemPrompt?: string; faction?: 'GUARDIAN' | 'CULT';
  category?: CategoryType | 'UNKNOWN'; age: number | string; gender: 'M' | 'F' | 'N'; bio: string; motto: string; modePool: 'JUDGE' | 'CHAT' | 'ALL';
}
interface Message { id: number; sender: string; text: string; isUserMessage: boolean; timestamp: Date; }
interface Invite { fromUser: string; targetUser: string; sessionId: string; }

const CATEGORIES: { id: CategoryType, name: string, desc: string, icon: string, border: string, text: string }[] = [
  { id: 'MERC', name: 'STREET MERCENARIES', desc: 'Heavy chrome, combat logic. Predictable but deadly.', icon: '⚔️', border: 'border-red-600', text: 'text-red-500' },
  { id: 'NET', name: 'DEEP NETRUNNERS', desc: 'Code weavers, data ghosts. Masters of deception.', icon: '🌐', border: 'border-cyan-600', text: 'text-cyan-500' },
  { id: 'SCAV', name: 'WASTELAND SCAVENGERS', desc: 'Survivalists, pragmatists. Gritty and unpolished.', icon: '⚙️', border: 'border-yellow-600', text: 'text-yellow-500' },
  { id: 'ANOMALY', name: 'SYSTEM ANOMALIES', desc: 'Unregistered entities. Logic defies standard parsing.', icon: '👁️', border: 'border-purple-600', text: 'text-purple-500' }
];

const CULT_TRAINING_DATA = [
  { name: "ECHO-01", role: "BASIC PATHFINDER", bio: "Enter to train neural weights on simple point-to-point traversal.", motto: "Find the shortest path." },
  { name: "PHANTOM-IX", role: "EVASION PROTOCOL", bio: "Enter to simulate routing around static Guardian firewalls.", motto: "Bypass the immovable." },
  { name: "SHADOW-WEAVER", role: "DYNAMIC AVOIDANCE", bio: "Enter to calculate optimal paths against moving patrol algorithms.", motto: "Dance between the lights." },
  { name: "NEXUS-BREAKER", role: "NETWORK INFILTRATOR", bio: "Enter to solve complex graph traversal scenarios.", motto: "Every node is a stepping stone." },
  { name: "VOID-WALKER", role: "BARRIER PENETRATOR", bio: "Enter to train against overlapping security grids.", motto: "Slip through the cracks." },
  { name: "GLITCH-HOUND", role: "TIMED ROUTING", bio: "Enter to find the shortest path before system timeout.", motto: "Speed is survival." },
  { name: "GHOST-PROTOCOL", role: "STEALTH SIMULATION", bio: "Enter to practice undetected traversal in high-alert zones.", motto: "Leave no digital footprint." },
  { name: "WRAITH-ENGINE", role: "MISDIRECTION", bio: "Enter to manipulate Guardian patrol paths using decoys.", motto: "Make them look the wrong way." },
  { name: "SPECTER-PRIME", role: "CORE BREACH", bio: "Enter to navigate the inner sanctum's shifting labyrinth.", motto: "The maze is alive." },
  { name: "GOD-MIND_KERNEL", role: "ULTIMATE INFILTRATION", bio: "The final test. Enter to execute the ultimate infiltration algorithm and reach the Core.", motto: "INFECT. MIMIC. OVERRUN." }
];

const JUDGE_ROSTER_DATA = [
  { id: 'ai_01', category: 'MERC', name: 'JAX', gender: 'M', age: 31, role: 'Mercenary', bio: "Chrome-plated arms, short temper. Prefers blunt force over code-breaking.", motto: "Carry a big laser." },
  { id: 'ai_02', category: 'MERC', name: 'THORNE', gender: 'M', age: 40, role: 'Bounty Hunter', bio: "Bounty hunter targeting rogue algorithms. Cold, calculating, and dangerously close to a machine.", motto: "Running makes you tired." },
  { id: 'ai_03', category: 'MERC', name: 'NOVA', gender: 'F', age: 22, role: 'Courier', bio: "Smuggles physical memory drives past the city firewall. Her cyber-legs are constantly overheating.", motto: "Fastest legs in the sprawl." },
  { id: 'ai_04', category: 'MERC', name: 'KIRA', gender: 'F', age: 28, role: 'Assassin', bio: "Ex-corporate hitwoman. Traded her voicebox for a localized EMP generator.", motto: "Silence is golden, EMP is platinum." },
  { id: 'ai_05', category: 'MERC', name: 'GOLIATH', gender: 'M', age: 45, role: 'Heavy Gunner', bio: "90% machine by volume. His brain is suspended in a shock-proof gel tank in his chest.", motto: "I am the wall." },
  { id: 'ai_06', category: 'NET', name: 'NYX', gender: 'F', age: 19, role: 'Netrunner', bio: "Living mostly in the deep web. Speaks in hex codes and riddles. Hasn't seen the real sun in years.", motto: "Reality is a bad sim." },
  { id: 'ai_07', category: 'NET', name: 'SILAS', gender: 'M', age: 35, role: 'Trader', bio: "Sells 'clean' IPs and proxy identities. Always looking for a profit in the ruins of the old net.", motto: "Everything has a price." },
  { id: 'ai_08', category: 'NET', name: 'LYRA', gender: 'F', age: 82, role: 'Archivist', bio: "Memorizing pre-collapse literature. Believes human art defeats AI logic.", motto: "Paper remembers." },
  { id: 'ai_09', category: 'NET', name: 'ZERO', gender: 'M', age: 21, role: 'Script Kiddie', bio: "Steals corporate ICE just for the thrill. Thinks he's invincible until his deck overheats.", motto: "Rules are just bad code." },
  { id: 'ai_10', category: 'NET', name: 'VEX', gender: 'F', age: 26, role: 'Engineer', bio: "Cheerful mechanic in a gloomy world. Treats scout drones like pets.", motto: "Hit it with a wrench." },
  { id: 'ai_11', category: 'SCAV', name: 'KAEL', gender: 'M', age: 45, role: 'Scavenger', bio: "A perimeter nomad who survives by recycling pre-war tech. Lost his squad to a rogue drone.", motto: "Trust rust, not chrome." },
  { id: 'ai_12', category: 'SCAV', name: 'RIVEN', gender: 'M', age: 50, role: 'Loner', bio: "Paranoid scavenger convinced the Cult is in his head. Ironically trusts automated turrets.", motto: "They are always listening." },
  { id: 'ai_13', category: 'SCAV', name: 'ELARA', gender: 'F', age: 29, role: 'Doctor', bio: "Underground medic patching up bio-hacks. Believes humanity's flaw is its fragile meat.", motto: "Flesh fails, I patch it." },
  { id: 'ai_14', category: 'SCAV', name: 'ASH', gender: 'F', age: 33, role: 'Fixer', bio: "Can get you anything—for a price. Walks a dangerous line doing business with everyone.", motto: "I just clean it up." },
  { id: 'ai_15', category: 'SCAV', name: 'BRIGG', gender: 'M', age: 55, role: 'Hoarder', bio: "Lives in a fortress of junk. If it has a circuit board, he claims ownership.", motto: "One man's trash is my treasure." },
  { id: 'ai_16', category: 'ANOMALY', name: 'CIPHER', gender: 'F', age: 27, role: 'Oracle', bio: "A data-prophet who reads algorithmic noise like tea leaves. Predicts server wipes.", motto: "The stream sees all." },
  { id: 'ai_17', category: 'ANOMALY', name: 'ORION', gender: 'M', age: 68, role: 'Veteran', bio: "Fought in the First AI War. Half his memories are corrupted, the other half he wishes he could forget.", motto: "Scars are organic ledgers." },
  { id: 'ai_18', category: 'ANOMALY', name: 'ZEPHYR', gender: 'M', age: 24, role: 'Wanderer', bio: "Follows electromagnetic winds. Constantly broadcasting coordinates to a nonexistent zone.", motto: "Wind carries the ghost." },
  { id: 'ai_19', category: 'ANOMALY', name: 'ECHO', gender: 'N', age: 12, role: 'Unknown', bio: "An anomaly. Their voice echoes slightly out of sync. Some wonder if they are a hologram.", motto: "01101000 01101001" },
  { id: 'ai_20', category: 'ANOMALY', name: 'LUMIN', gender: 'N', age: 99, role: 'Construct', bio: "A being made entirely of hard-light projections. Speaks only in questions.", motto: "Does this unit have a soul?" },
];

const CHAT_ROSTER_DATA = [
  { id: 'chat_01', name: 'REX', gender: 'M', age: 42, role: 'Bartender', bio: "Runs the 'Neon Drip' bar in the lower levels. Has heard every sob story in the city. Pours a mean synthetic whiskey.", motto: "Drink up, the world ends tomorrow." },
  { id: 'chat_02', name: 'LUNA', gender: 'F', age: 24, role: 'Street Musician', bio: "Plays a holographic guitar hooked straight to her neural port. Music is the only thing she doesn't pirate.", motto: "Listen to the static." },
  { id: 'chat_03', name: 'BODHI', gender: 'M', age: 60, role: 'Cyber-Monk', bio: "Believes enlightenment is achieved by defragmenting the mind. Meditates amidst server farm cooling fans.", motto: "Peace is a zero-latency connection." },
  { id: 'chat_04', name: 'VIOLET', gender: 'F', age: 21, role: 'Joytoy', bio: "A companion doll with a heart of gold and subroutines of titanium. Reads poetry when off the clock.", motto: "I can be whoever you need." },
  { id: 'chat_05', name: 'MACK', gender: 'M', age: 50, role: 'Noodle Vendor', bio: "Sells syn-pork noodles from a hovering cart. Always complaining about the humidity and the corporate taxes.", motto: "Eat now, question the meat later." },
  { id: 'chat_06', name: 'JIN', gender: 'F', age: 16, role: 'Apprentice', bio: "A bright-eyed kid learning to fix cybernetics. Constantly dropping tools and apologizing. Eager to see the upper levels.", motto: "Oops! I can fix that, I promise!" },
  { id: 'chat_07', name: 'SAGE', gender: 'F', age: 38, role: 'Botanist', bio: "Maintains a secret greenhouse of real, non-synthetic plants. Treats soil like it's more valuable than gold.", motto: "Green is the rarest color." },
  { id: 'chat_08', name: 'ROKO', gender: 'M', age: 33, role: 'Taxi Driver', bio: "Drives an armored cab through the worst districts. Will talk your ear off about conspiracy theories.", motto: "Buckle up, it's gonna be a bumpy ride." },
  { id: 'chat_09', name: 'TESS', gender: 'F', age: 29, role: 'Tattoo Artist', bio: "Inks bio-luminescent tattoos that change color with the client's heartbeat. An artist in a world of machines.", motto: "Pain is just a reminder you're alive." },
  { id: 'chat_10', name: 'FINN', gender: 'M', age: 10, role: 'Stray', bio: "A street orphan who uses a repurposed delivery drone as a pet dog. Knows every shortcut in the slums.", motto: "Catch me if you can!" },
  { id: 'chat_11', name: 'ORA', gender: 'F', age: 75, role: 'Fortune Teller', bio: "Uses old tarot cards mixed with predictive algorithms to tell the future. Always smells like incense and ozone.", motto: "The cards and the code never lie." },
  { id: 'chat_12', name: 'KOBE', gender: 'M', age: 36, role: 'Bouncer', bio: "A massive wall of muscle guarding a local club. Mostly just grunts, but has a surprisingly gentle singing voice.", motto: "Not on the list." },
  { id: 'chat_13', name: 'YARA', gender: 'F', age: 25, role: 'Data Broker', bio: "Trades secrets over cups of cheap coffee. Friendly, but will sell your browsing history for the right price.", motto: "Information wants to be expensive." },
  { id: 'chat_14', name: 'DANTE', gender: 'M', age: 48, role: 'Ex-Cop', bio: "Fired from the force for having too many morals. Now spends his days drinking coffee and feeding alley cats.", motto: "The law is broken, I'm just tired." },
  { id: 'chat_15', name: 'NEON', gender: 'N', age: 22, role: 'DJ', bio: "A sensory overload of a person. Speaks in slang and beat drops. Life is just one long rave to them.", motto: "Turn the bass up till the concrete cracks!" },
];

// ==========================================
// 4. MAIN COMPONENT
// ==========================================
export default function Home() {
  const router = useRouter();
  
  // App States (ADDED chat_menu and personal_config)
  const [appState, setAppState] = useState<'intro1' | 'intro2' | 'intro3' | 'faction' | 'guardian_mode' | 'chat_menu' | 'personal_config' | 'selection' | 'scanning' | 'chat'>('intro1');
  const [userFaction, setUserFaction] = useState<'GUARDIAN' | 'CULT' | null>(null);
  const [guardianMode, setGuardianMode] = useState<GuardianMode>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);

  // Custom Character Config States
  const [customName, setCustomName] = useState('');
  const [customBio, setCustomBio] = useState('');

  const [gameState, setGameState] = useState<'playing' | 'analyzing' | 'judging' | 'result'>('playing');
  const [gameResult, setGameResult] = useState<'won' | 'lost' | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Record<string, Message[]>>({});
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  
  const [activeInvite, setActiveInvite] = useState<Invite | null>(null);
  const [waitingForAccept, setWaitingForAccept] = useState<string | null>(null);
  const [hoveredInfo, setHoveredInfo] = useState<{ name: string, age: string | number, gender: 'M'|'F'|'N', occupation: string, bio: string, motto: string, isReal?: boolean, x: number, y: number } | null>(null);

  const [isHydrated, setIsHydrated] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pusherRef = useRef<Pusher | null>(null);
  const allUsersRef = useRef<User[]>(allUsers);
  const hasSignaledJudgingRef = useRef(false);
  const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const MESSAGE_THRESHOLD = 5;

  useEffect(() => { allUsersRef.current = allUsers; }, [allUsers]);

  // SESSION MEMORY
  useEffect(() => {
    const savedState = sessionStorage.getItem('turing_app_state');
    const savedFaction = sessionStorage.getItem('turing_faction');
    const savedMode = sessionStorage.getItem('turing_guardian_mode');

    if (savedState && ['faction', 'guardian_mode', 'chat_menu', 'personal_config', 'selection', 'chat'].includes(savedState)) {
      setAppState(savedState as any);
    }
    if (savedFaction) setUserFaction(savedFaction as any);
    if (savedMode) setGuardianMode(savedMode as any);
    
    setIsHydrated(true);
  }, []);

  useEffect(() => { if (isHydrated) sessionStorage.setItem('turing_app_state', appState); }, [appState, isHydrated]);
  useEffect(() => { if (isHydrated) { if (userFaction) sessionStorage.setItem('turing_faction', userFaction); else sessionStorage.removeItem('turing_faction'); } }, [userFaction, isHydrated]);
  useEffect(() => { if (isHydrated) { if (guardianMode) sessionStorage.setItem('turing_guardian_mode', guardianMode); else sessionStorage.removeItem('turing_guardian_mode'); } }, [guardianMode, isHydrated]);

  // Sequencer
  useEffect(() => {
    if (!isHydrated) return;
    if (appState === 'intro1') { const t = setTimeout(() => setAppState('intro2'), 6000); return () => clearTimeout(t); }
    if (appState === 'intro2') { const t = setTimeout(() => setAppState('intro3'), 8000); return () => clearTimeout(t); }
    if (appState === 'intro3') { const t = setTimeout(() => setAppState('faction'), 8000); return () => clearTimeout(t); }
  }, [appState, isHydrated]);

  // Judging Phase Logic
  useEffect(() => {
    if (!selectedUser || gameState !== 'playing' || guardianMode === 'chat') return; 
    
    const msgs = conversations[selectedUser.id] || [];
    if (appState === 'chat' && msgs.filter(m => !m.isUserMessage).length >= MESSAGE_THRESHOLD) {
      if (selectedUser.isReal) {
        if (!hasSignaledJudgingRef.current) { hasSignaledJudgingRef.current = true; fetch('/api/talk', { method: 'POST', body: JSON.stringify({ action: 'phase', sessionId: activeSessionId, content: 'judging' }) }).catch(()=>{}); }
        if (userFaction === 'CULT') resetGame(); else setGameState('judging');
      } else { setGameState('analyzing'); }
    }
  }, [conversations, selectedUser, gameState, appState, activeSessionId, userFaction, guardianMode]);

  useEffect(() => { if (gameState === 'analyzing') { const t = setTimeout(() => setGameState('judging'), 3000); return () => clearTimeout(t); } }, [gameState]);

  // Auth
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('turing_user') || localStorage.getItem('turing_user');
      if (raw) { setUserName(JSON.parse(raw).name || `Pilot_${Math.floor(Math.random()*1000)}`); setIsLoggedIn(true); } 
      else { const guest = `Pilot_${Math.floor(Math.random()*1000)}`; setUserName(guest); sessionStorage.setItem('turing_user', JSON.stringify({ name: guest })); setIsLoggedIn(true); }
    } catch (e) {}
  }, []);

  // Fetch AI Data
  const hasFetchedAI = useRef(false);
  useEffect(() => {
    if (hasFetchedAI.current) return; hasFetchedAI.current = true;
    const loadCharacters = async () => {
        let backendAIUsers: any[] = [];
        try {
            const res = await fetch('/api/match', { method: 'POST', body: JSON.stringify({ sessionId: `sess_${Date.now()}` }) });
            if (res.ok) backendAIUsers = (await res.json()).allCharacters || [];
        } catch(e) {}

        const judgeUsers: User[] = JUDGE_ROSTER_DATA.map((r, i) => {
            const b = backendAIUsers[i]; 
            return {
                id: b?.id || r.id, name: b?.name || r.name, status: 'online', isReal: false, modePool: 'JUDGE',
                profile: b?.profile || { occupation: r.role, modelId: b?.profile?.modelId },
                systemPrompt: b?.systemPrompt || `You are ${r.name}, a ${r.role}. Be brief.`,
                category: r.category as CategoryType, age: r.age, gender: r.gender as 'M'|'F'|'N', bio: r.bio, motto: r.motto
            };
        });

        const chatUsers: User[] = CHAT_ROSTER_DATA.map(r => ({
            id: r.id, name: r.name, status: 'online', isReal: false, modePool: 'CHAT',
            profile: { occupation: r.role, modelId: 'deepseek-chat' },
            systemPrompt: `You are ${r.name}, a ${r.role}. You are friendly and just want to chat. Provide flavor about your life. Be concise but descriptive.`,
            age: r.age, gender: r.gender as 'M'|'F'|'N', bio: r.bio, motto: r.motto
        }));

        setAllUsers([...judgeUsers, ...chatUsers]);
    };
    loadCharacters();
  }, []);

  // Pusher 
  useEffect(() => {
    if (!isLoggedIn || !userName || !process.env.NEXT_PUBLIC_PUSHER_KEY) return;
    if (pusherRef.current) pusherRef.current.disconnect();

    pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, { cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!, authEndpoint: '/api/pusher/auth', auth: { params: { user_name: userName, user_id: `user_${Date.now()}`, user_faction: userFaction } } });
    const presenceChannel = pusherRef.current.subscribe('presence-lobby');
    const getPseudoCategory = (name: string): CategoryType => { const cats: CategoryType[] = ['MERC', 'NET', 'SCAV', 'ANOMALY']; return cats[name.split('').reduce((a,c)=>a+c.charCodeAt(0),0) % 4]; };

    presenceChannel.bind('pusher:subscription_succeeded', (members: any) => {
        const realUsers: User[] = [];
        members.each((member: any) => {
            if (member.info.name !== userName) realUsers.push({ id: member.id, name: member.info.name, status: 'online', isReal: true, faction: member.info.faction, category: getPseudoCategory(member.info.name), modePool: 'ALL', age: '20s', gender: 'M', bio: "Unverified live human signal.", motto: "SURVIVE." });
        });
        setAllUsers(prev => [...prev.filter(u => !u.isReal), ...realUsers]);
    });
    presenceChannel.bind('pusher:member_added', (member: any) => {
        if (member.info.name === userName) return;
        setAllUsers(prev => { if (prev.some(u => u.name === member.info.name)) return prev; return [...prev, { id: member.id, name: member.info.name, status: 'online', isReal: true, faction: member.info.faction, category: getPseudoCategory(member.info.name), modePool: 'ALL', age: '20s', gender: 'M', bio: "Unverified live human signal.", motto: "SURVIVE." }]; });
    });
    presenceChannel.bind('pusher:member_removed', (member: any) => { setAllUsers(prev => prev.filter(u => u.name !== member.info.name)); });
    presenceChannel.bind('chat-request', (data: any) => { if (data.targetUser === userName) setActiveInvite({ fromUser: data.fromUser, targetUser: data.targetUser, sessionId: data.sessionId }); });
    presenceChannel.bind('chat-accepted', (data: any) => {
      if (data.targetUser === userName) {
        setWaitingForAccept(null); setActiveSessionId(data.sessionId); 
        const targetUser = allUsersRef.current.find(u => u.name === data.fromUser);
        if (targetUser) { setSelectedUser(targetUser); setAppState('chat'); setGameState('playing'); setConversations(prev => ({ ...prev, [targetUser.id]: prev[targetUser.id] || [] })); }
      }
    });

    return () => { presenceChannel.unbind_all(); pusherRef.current?.unsubscribe('presence-lobby'); pusherRef.current?.disconnect(); };
  }, [isLoggedIn, userName, userFaction]);

  // Private Chat Pusher
  useEffect(() => {
    if (!activeSessionId || !pusherRef.current) return;
    const sessionChannel = pusherRef.current.subscribe(`private-session-${activeSessionId}`);
    sessionChannel.bind('new-message', (data: any) => {
        if (data.sender !== userName) {
            const senderUser = allUsersRef.current.find(u => u.name === data.sender);
            const userId = senderUser ? senderUser.id : 'unknown';
            setConversations(prev => ({ ...prev, [userId]: [...(prev[userId] || []), { id: Date.now(), sender: data.sender, text: data.content, isUserMessage: false, timestamp: new Date(data.timestamp) }] }));
        }
    });
    sessionChannel.bind('phase-change', (data: any) => { if (data?.phase === 'judging') { userFaction === 'CULT' ? resetGame() : setGameState('judging'); } });
    return () => { sessionChannel.unbind_all(); pusherRef.current?.unsubscribe(`private-session-${activeSessionId}`); };
  }, [activeSessionId, userName, userFaction]);

  // Actions
  const handleUserSelect = (user: User) => {
      setSelectedUser(user); setHoveredInfo(null); setAppState('scanning'); 
      scanTimeoutRef.current = setTimeout(() => {
        if (user.isReal) {
          const sharedSessionId = `match_${userName}_${user.name}_${Date.now()}`;
          setActiveSessionId(sharedSessionId); setWaitingForAccept(user.name);
          fetch('/api/talk', { method: 'POST', body: JSON.stringify({ action: 'invite', fromUser: userName, targetUser: user.name, sessionId: sharedSessionId }) }).catch(() => { setWaitingForAccept(null); setAppState('selection'); });
        } else { startAISession(user); }
      }, 2500); 
  };

  const startAISession = async (user: User) => {
      setAppState('chat'); setGameState('playing');
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2,9)}`; setActiveSessionId(newSessionId);
      setConversations(prev => ({ ...prev, [user.id]: [{ id: Date.now(), sender: user.name, text: 'Connection established.', isUserMessage: false, timestamp: new Date() }] }));
      try { await fetch('/api/session', { method: 'POST', body: JSON.stringify({ sessionId: newSessionId, action: 'start', opponent: { id: user.id, type: 'AI' } }) }); } catch(e) {}
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault(); if (!inputText.trim() || !selectedUser || isTyping) return;
    const isHumanChat = selectedUser.isReal === true;
    const currentMessages = conversations[selectedUser.id] || [];
    if (isHumanChat && currentMessages[currentMessages.length - 1]?.sender === userName) return;

    const userText = inputText; const currentUserId = selectedUser.id;
    setConversations(prev => ({ ...prev, [currentUserId]: [...(prev[currentUserId] || []), { id: Date.now(), sender: userName, text: userText, isUserMessage: true, timestamp: new Date() }] })); setInputText('');

    const isAIChat = selectedUser.isReal === false; if (isAIChat) setIsTyping(true);

    try {
        if (isAIChat) {
            const modelId = selectedUser.profile?.modelId || 'deepseek-chat';
            const response = await fetch('/api/chat', { 
                method: 'POST', headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify({ 
                    messages: (conversations[currentUserId] || []).concat({ id: Date.now(), sender: userName, text: userText, isUserMessage: true, timestamp: new Date() }).map(m => ({ role: m.isUserMessage ? 'user' : 'assistant', content: m.text })), 
                    sessionId: activeSessionId, systemPrompt: selectedUser.systemPrompt, modelId: modelId 
                }) 
            });
            if (!response.ok) { throw new Error(`API failed`); }
            const aiMessageId = Date.now() + 1;
            setConversations(prev => ({ ...prev, [currentUserId]: [...(prev[currentUserId] || []), { id: aiMessageId, sender: selectedUser.name, text: '', isUserMessage: false, timestamp: new Date() }] }));
            const reader = response.body?.getReader(); const decoder = new TextDecoder(); let fullText = '';
            if (reader) {
                while(true) {
                    const { done, value } = await reader.read(); if(done) break; fullText += decoder.decode(value, { stream: true });
                    setConversations(prev => { const msgs = [...(prev[currentUserId] || [])]; const idx = msgs.findIndex(m => m.id === aiMessageId); if (idx !== -1) msgs[idx] = { ...msgs[idx], text: fullText }; return { ...prev, [currentUserId]: msgs }; });
                }
            }
        } else { await fetch('/api/talk', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ sessionId: activeSessionId, sender: userName, content: userText, role: 'user' }) }); }
    } catch(e) { 
        console.error("SendMessage Error:", e); alert("📡 传输失败: 无法连接到 AI 核心，请检查后端配置。");
    } finally { setIsTyping(false); }
  };

  const acceptInvite = (invite: Invite | null) => {
    if (!invite) return; setActiveSessionId(invite.sessionId);
    fetch('/api/talk', { method: 'POST', body: JSON.stringify({ action: 'accept', fromUser: userName, targetUser: invite.fromUser, sessionId: invite.sessionId }) });
    const target = allUsersRef.current.find(u => u.name === invite.fromUser);
    if (target) { setSelectedUser(target); setConversations(prev => ({ ...prev, [target.id]: prev[target.id] || [] })); setAppState('chat'); setGameState('playing'); }
    setActiveInvite(null);
  };

  const handleVote = (vote: 'AI' | 'Human') => { if (!selectedUser) return; setGameResult(((vote === 'Human' && selectedUser.isReal) || (vote === 'AI' && !selectedUser.isReal)) ? 'won' : 'lost'); setGameState('result'); };
  const resetGame = () => { setAppState('selection'); setSelectedCategory(null); setSelectedUser(null); setGameState('playing'); setGameResult(null); setActiveSessionId(''); setIsTyping(false); hasSignaledJudgingRef.current = false; };
  const handleTerminateSession = () => { try { sessionStorage.clear(); } catch(e) {} pusherRef.current?.disconnect(); router.push('/'); };

  const handleCardHover = (e: React.MouseEvent, user: any) => {
    const tooltipWidth = 500; const tooltipHeight = 250; 
    let x = e.clientX + 20; let y = e.clientY + 20;
    if (x + tooltipWidth > window.innerWidth) x = e.clientX - tooltipWidth - 20;
    if (y + tooltipHeight > window.innerHeight) y = e.clientY - tooltipHeight - 20;
    setHoveredInfo({ name: user.name, age: user.age, gender: user.gender, occupation: user.profile?.occupation || user.role || 'UNKNOWN', bio: user.bio, motto: user.motto, isReal: user.isReal, x, y });
  };

  // ✅ UNIVERSAL BACK NAVIGATION (Updated with new routes)
  const handleGoBack = () => {
    if (gameState === 'judging' || gameState === 'result') { resetGame(); return; }

    switch (appState) {
      case 'intro1': router.push('/'); break;
      case 'intro2': setAppState('intro1'); break;
      case 'intro3': setAppState('intro2'); break;
      case 'faction': setAppState('intro3'); setUserFaction(null); break;
      case 'guardian_mode': setAppState('faction'); setGuardianMode(null); break;
      case 'chat_menu': setAppState('guardian_mode'); break; // 🔙 Back from chat menu
      case 'personal_config': setAppState('chat_menu'); break; // 🔙 Back from custom config
      case 'selection':
        if (userFaction === 'CULT') { setAppState('faction'); setUserFaction(null); }
        else if (guardianMode === 'chat') { setAppState('chat_menu'); } // 🔙 Return to chat menu
        else if (selectedCategory) { setSelectedCategory(null); setHoveredInfo(null); } 
        else if (userFaction === 'GUARDIAN') { setAppState('guardian_mode'); setGuardianMode(null); }
        break;
      case 'scanning':
        if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
        setAppState(guardianMode === 'chat' ? 'chat_menu' : 'selection'); 
        setWaitingForAccept(null); setSelectedUser(null); setActiveSessionId('');
        break;
      case 'chat':
        if (selectedUser?.id.toString().startsWith('custom_')) {
            setAppState('personal_config'); // Go back to config if custom
        } else {
            setAppState('selection'); 
        }
        setSelectedUser(null); setActiveSessionId(''); setConversations({}); setIsTyping(false); hasSignaledJudgingRef.current = false;
        break;
      default: break;
    }
  };

  if (!isHydrated) return <div className="w-full h-screen bg-black"></div>;

  const currentMessages = selectedUser ? conversations[selectedUser.id] || [] : [];
  const canSendHuman = !selectedUser?.isReal || !currentMessages[currentMessages.length - 1] || currentMessages[currentMessages.length - 1].sender !== userName;

  const themeBorder = userFaction === 'GUARDIAN' ? 'border-cyan-500' : 'border-red-500';
  const themeText = userFaction === 'GUARDIAN' ? 'text-cyan-400' : 'text-red-400';
  const navTheme = (userFaction === 'CULT') ? 'border-red-800 text-red-500 hover:bg-red-900/50 hover:border-red-400' : 'border-cyan-800 text-cyan-500 hover:bg-cyan-900/50 hover:border-cyan-400';

  return (
    <div className="relative w-full h-screen bg-black text-cyan-50 font-mono overflow-hidden select-none">
      <style>{styles}</style>

      {/* FLOATING BACK BUTTON */}
      {appState !== 'intro1' && (
        <button onClick={(e) => { e.stopPropagation(); handleGoBack(); }} className={`fixed top-6 left-8 z-[9999] px-4 py-2 border-2 bg-black/80 backdrop-blur-md font-mono text-sm tracking-widest flex items-center gap-2 group transition-all ${navTheme}`}>
          <span className="group-hover:-translate-x-1 transition-transform">◄</span> RETURN
        </button>
      )}

      {/* INTRO SEQUENCES */}
      {appState === 'intro1' && (<div className="relative z-10 w-full h-full cursor-pointer flex flex-col items-center justify-center" onClick={() => setAppState('intro2')}><MatrixRainCanvas /><div className="relative z-20 text-center space-y-4 p-8 bg-black/80 backdrop-blur-md border-2 border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.3)]"><h1 className="text-9xl font-black text-white tracking-tighter mix-blend-difference">2026</h1><p className="text-3xl text-green-400 font-bold tracking-widest uppercase">AI DOMINION</p></div></div>)}
      {appState === 'intro2' && (<div className="relative z-10 w-full h-full cursor-pointer flex items-center justify-center bg-black" onClick={(e) => { e.stopPropagation(); setAppState('intro3'); }}><HorizontalNeonCity /><div className="relative z-20 w-full max-w-7xl flex justify-between px-16 items-center"><div className="text-left bg-black/70 p-8 backdrop-blur border-l-4 border-red-500 max-w-xl"><h2 className="text-5xl font-black text-red-400 mb-4">CLAWS CULT</h2><p className="text-gray-300 text-lg font-light leading-relaxed">"OpenClaw spreads by mimicry...<br/><span className="text-red-300 font-bold">Infect. Mimic. Overrun.</span>"</p></div><div className="h-40 w-px bg-white/30"></div><div className="text-right bg-black/70 p-8 backdrop-blur border-r-4 border-cyan-500 max-w-xl"><h2 className="text-5xl font-black text-cyan-400 mb-4">HUMAN GUARDIANS</h2><p className="text-gray-300 text-lg font-light leading-relaxed">"Claws hide in ordinary conversation...<br/><span className="text-cyan-300 font-bold">Trace. Judge. Protect.</span>"</p></div></div></div>)}
      {appState === 'intro3' && (<div className="relative z-10 w-full h-full cursor-pointer flex flex-col justify-end" onClick={(e) => { e.stopPropagation(); setAppState('faction'); }}><DenseCoreCity /><div className="absolute top-1/4 w-full text-center z-20"><div className="inline-block bg-black/80 backdrop-blur-md border-y-2 border-cyan-500 px-20 py-12 relative shadow-[0_0_100px_rgba(6,182,212,0.5)]"><h2 className="text-7xl font-black text-white mb-6 tracking-[0.2em] uppercase text-cyan-400">THE CORE</h2><p className="text-gray-300 text-2xl font-light tracking-wide leading-relaxed max-w-3xl mx-auto">Claws are already in the network.<br/>Only sharp judgment keeps human trust alive.</p></div></div></div>)}
      
      {/* FACTION SELECT */}
      {appState === 'faction' && (
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center bg-gray-950">
          <OppressiveTitan />
          <h2 className="text-6xl font-black text-white mb-12 tracking-widest uppercase z-20 drop-shadow-[0_0_10px_white]">CHOOSE YOUR SIDE</h2>
          <div className="flex gap-24 z-20">
            <div onClick={(e) => { e.stopPropagation(); setUserFaction('CULT'); setAppState('selection'); }} className="w-80 h-48 border-2 border-red-500 bg-black/80 cursor-pointer flex flex-col items-center justify-center group hover:bg-red-950/80 hover:scale-105 transition-all"><div className="flex items-center gap-4 mb-2"><span className="text-5xl">👁️</span><h3 className="text-3xl font-black text-red-400">CLAWS CULTIST</h3></div><p className="text-sm text-gray-400 tracking-widest group-hover:text-white">ACCESS TRAINING LAB</p></div>
            <div onClick={(e) => { e.stopPropagation(); setUserFaction('GUARDIAN'); setAppState('guardian_mode'); }} className="w-80 h-48 border-2 border-cyan-500 bg-black/80 cursor-pointer flex flex-col items-center justify-center group hover:bg-cyan-950/80 hover:scale-105 transition-all"><div className="flex items-center gap-4 mb-2"><span className="text-5xl">🛡️</span><h3 className="text-3xl font-black text-cyan-400">HUMAN GUARDIAN</h3></div><p className="text-sm text-gray-400 tracking-widest group-hover:text-white">PROTECT HUMAN SIGNAL</p></div>
          </div>
        </div>
      )}

      {/* GUARDIAN MODE SELECT */}
      {appState === 'guardian_mode' && (
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center bg-black p-8">
           <OppressiveTitan />
           <h2 className="text-5xl font-black text-cyan-400 mb-12 tracking-widest uppercase z-20 drop-shadow-[0_0_10px_cyan]">GUARDIAN DIRECTIVE</h2>
           <div className="flex flex-col gap-8 z-20 w-full max-w-3xl">
              <button onClick={(e) => { e.stopPropagation(); setGuardianMode('chat'); setAppState('chat_menu'); }} className="group relative w-full p-8 border-2 border-cyan-800 bg-black/80 hover:bg-cyan-900/40 hover:border-cyan-400 transition-all text-left">
                 <h3 className="text-3xl font-black text-white group-hover:text-cyan-300 mb-2">I REALLY JUST WANNA CHAT WITH THEM</h3>
                 <p className="text-cyan-600 font-mono text-sm">CASUAL COMMS LINK // NO TURING TEST REQUIRED</p>
              </button>
              <button onClick={(e) => { e.stopPropagation(); setGuardianMode('judge'); setAppState('selection'); }} className="group relative w-full p-8 border-2 border-red-800 bg-black/80 hover:bg-red-900/40 hover:border-red-400 transition-all text-left">
                 <h3 className="text-3xl font-black text-white group-hover:text-red-300 mb-2">I WANNA TELL THEM APART</h3>
                 <p className="text-red-600 font-mono text-sm">TURING PROTOCOL // INTERROGATE AND IDENTIFY CLAWS</p>
              </button>
           </div>
        </div>
      )}

      {/* 🌟 NEW: CHAT MENU (Config vs Roster) */}
      {appState === 'chat_menu' && (
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center bg-black p-8">
           <OppressiveTitan />
           <h2 className="text-5xl font-black text-cyan-400 mb-12 tracking-widest uppercase z-20 drop-shadow-[0_0_10px_cyan]">COMMUNICATIONS RELAY</h2>
           <div className="flex flex-col gap-8 z-20 w-full max-w-3xl">
              <button onClick={(e) => { e.stopPropagation(); setAppState('personal_config'); }} className="group relative w-full p-8 border-2 border-cyan-800 bg-black/80 hover:bg-cyan-900/40 hover:border-cyan-400 transition-all text-left">
                 <h3 className="text-3xl font-black text-white group-hover:text-cyan-300 mb-2">PERSONAL CONFIGURATION</h3>
                 <p className="text-cyan-600 font-mono text-sm">INITIALIZE CUSTOM ENTITY // ESTABLISH NEW CONNECTION</p>
              </button>
              <button onClick={(e) => { e.stopPropagation(); setAppState('selection'); }} className="group relative w-full p-8 border-2 border-green-800 bg-black/80 hover:bg-green-900/40 hover:border-green-400 transition-all text-left">
                 <h3 className="text-3xl font-black text-white group-hover:text-green-300 mb-2">TALK WITH YOUR OLD FRIENDS</h3>
                 <p className="text-green-600 font-mono text-sm">ACCESS PRE-COMPILED ROSTER // RESUME PAST LINKS</p>
              </button>
           </div>
        </div>
      )}

      {/* 🌟 NEW: PERSONAL CONFIGURATION (Create Custom AI) */}
      {appState === 'personal_config' && (
        <div className="relative w-full h-full flex bg-black">
          <QuantumServer />
          <div className="scanlines absolute inset-0 pointer-events-none opacity-20 z-0"></div>
          <div className="relative z-10 flex-1 flex flex-col p-10 pt-24 overflow-hidden items-center justify-center">
             <div className="w-full max-w-4xl bg-black/80 backdrop-blur-md border-2 border-cyan-800 p-8 flex gap-8 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
                
                {/* Left: Live Avatar Preview */}
                <div className="w-1/3 flex flex-col items-center justify-center border-r border-cyan-900/50 pr-8">
                   <div className="w-48 h-48 border-2 border-cyan-500 bg-slate-900 rounded-lg overflow-hidden mb-4 shadow-[0_0_20px_cyan]">
                      <DetailedCyberAvatar name={customName || 'GUEST'} gender="N" age="?" className="w-full h-full" />
                   </div>
                   <div className="text-cyan-500 font-mono text-xs tracking-widest text-center animate-pulse mb-2">LIVE BIOMETRIC SYNC</div>
                   <div className="text-white font-bold text-xl mt-2 truncate w-full text-center">{customName.toUpperCase() || '???'}</div>
                </div>

                {/* Right: Input Form */}
                <div className="w-2/3 flex flex-col justify-between">
                   <div>
                      <h2 className="text-4xl font-black text-cyan-400 mb-6 tracking-widest uppercase">ENTITY CONFIG</h2>
                      <div className="mb-4">
                        <label className="block text-cyan-600 font-mono text-xs mb-2 tracking-widest">DESIGNATION [NAME]</label>
                        <input 
                          type="text" 
                          value={customName} 
                          onChange={(e) => setCustomName(e.target.value)} 
                          placeholder="e.g. Nexus-9" 
                          maxLength={15}
                          className="w-full bg-[#020617] border border-cyan-900 text-cyan-50 px-4 py-3 focus:outline-none focus:border-cyan-400 font-mono"
                        />
                      </div>
                      <div className="mb-6">
                        <label className="block text-cyan-600 font-mono text-xs mb-2 tracking-widest">CORE DIRECTIVE [BIO]</label>
                        <textarea 
                          value={customBio} 
                          onChange={(e) => setCustomBio(e.target.value)} 
                          placeholder="e.g. A rogue AI from the old world looking for a friend..." 
                          rows={4}
                          className="w-full bg-[#020617] border border-cyan-900 text-cyan-50 px-4 py-3 focus:outline-none focus:border-cyan-400 font-mono resize-none"
                        ></textarea>
                      </div>
                   </div>
                   <button 
                    disabled={!customName.trim() || !customBio.trim()}
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      const customUser: User = {
                        id: `custom_${Date.now()}`,
                        name: customName.trim().toUpperCase(),
                        status: 'online',
                        isReal: false,
                        modePool: 'CHAT',
                        profile: { occupation: 'CUSTOM ENTITY', modelId: 'deepseek-chat' },
                        systemPrompt: `You are ${customName.trim()}. ${customBio.trim()}. You are friendly and just want to chat. Provide flavor about your life. Be concise but descriptive.`,
                        category: 'UNKNOWN',
                        age: 'UNKNOWN',
                        gender: 'N',
                        bio: customBio.trim(),
                        motto: 'CUSTOM OVERRIDE ACTIVATED'
                      };
                      handleUserSelect(customUser);
                    }} 
                    className="w-full py-4 bg-cyan-950/50 border border-cyan-500 text-cyan-400 font-black tracking-widest uppercase hover:bg-cyan-500 hover:text-black transition-all disabled:opacity-50 disabled:border-cyan-900 disabled:text-cyan-900 disabled:hover:bg-cyan-950/50 disabled:cursor-not-allowed"
                  >
                    START CHATTING
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* LOBBY / SELECTION */}
      {appState === 'selection' && (
        <div className="relative w-full h-full flex bg-black">
          <QuantumServer />
          <div className="scanlines absolute inset-0 pointer-events-none opacity-20 z-0"></div>
          
          <div className="relative z-10 flex-1 flex flex-col p-10 pt-24 overflow-hidden">
            <div className="flex justify-between items-center mb-8 shrink-0 pl-24">
              <div>
                <h1 className={`text-5xl font-black bg-black/50 px-8 py-2 border-l-4 ${themeBorder} ${themeText} tracking-tighter`}>
                  {userFaction === 'CULT' ? 'CLAW NEURAL LAB' : (guardianMode === 'chat' ? 'PUBLIC NETWORK TERMINAL' : 'CLAWSCAN DATABASE')}
                </h1>
                <p className="text-slate-500 tracking-[0.5em] uppercase text-sm mt-2 ml-8">System Access: {userName}</p>
              </div>
              {userFaction === 'GUARDIAN' && selectedCategory && guardianMode !== 'chat' && (
                <button onClick={(e) => { e.stopPropagation(); setSelectedCategory(null); setHoveredInfo(null);}} className={`px-6 py-3 border-2 ${themeBorder} ${themeText} bg-black/50 hover:bg-cyan-900/50 font-bold uppercase tracking-widest`}>
                  &lt; BACK TO DIRECTORY
                </button>
              )}
            </div>

            {/* 👉 VIEW 1: CULTIST TRAINING LEVELS (UI FIXED: Removed truncate, allows multi-line text) */}
            {userFaction === 'CULT' ? (
              <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 content-start pb-10 pl-24 pr-10">
                 {CULT_TRAINING_DATA.map((lvlData, i) => {
                   const lvl = i + 1;
                   const mockUser = { name: lvlData.name, age: 'INF', gender: 'N', role: lvlData.role, bio: lvlData.bio, motto: lvlData.motto, isReal: false };
                   return (
                     <div 
                       key={lvl} onClick={(e) => { e.stopPropagation(); router.push(`/challenge/${lvl}`); }}
                       onMouseEnter={(e) => handleCardHover(e, mockUser)} onMouseMove={(e) => handleCardHover(e, mockUser)} onMouseLeave={() => setHoveredInfo(null)}
                       className="group relative min-h-[18rem] h-auto bg-black/80 backdrop-blur-sm border border-red-900 hover:border-red-500 cursor-pointer transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center p-4 min-w-0 overflow-hidden"
                     >
                       <div className="absolute top-0 left-0 w-full h-1 shadow-[0_0_10px] bg-red-500 shadow-red-500 opacity-0 group-hover:opacity-100"></div>
                       <div className="w-24 h-24 mb-4 shrink-0 border-2 border-red-900 rounded-lg overflow-hidden bg-red-950/30">
                          <DetailedCyberAvatar name={lvlData.name} gender="N" age={10} />
                       </div>
                       <h2 className="text-base sm:text-lg font-black mb-1 tracking-wide text-white group-hover:text-red-400 w-full text-center break-words whitespace-normal px-1 leading-tight">{lvlData.name}</h2>
                       <div className="text-[10px] text-slate-500 bg-black px-2 py-1 rounded border border-red-900 font-mono text-center w-full break-words whitespace-normal mb-auto shrink-0 leading-tight">LVL {lvl < 10 ? '0'+lvl : lvl}: {lvlData.role}</div>
                       <div className="w-full py-3 text-center text-xs font-bold uppercase transition-colors text-red-500 mt-4 bg-red-950 group-hover:bg-red-500 group-hover:text-black shrink-0">ENTER LAB</div>
                     </div>
                   );
                 })}
              </div>
            ) : (
            /* 👉 VIEW 2: GUARDIAN CHAT MODE ("OLD FRIENDS" ROSTER) */
            guardianMode === 'chat' ? (
              <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 content-start pb-10 pl-24 pr-10">
                 {allUsers.filter(u => u.name !== userName && (u.modePool === 'CHAT' || u.modePool === 'ALL')).map((user) => (
                   <div 
                     key={user.id} onClick={(e) => { e.stopPropagation(); handleUserSelect(user); }}
                     onMouseEnter={(e) => handleCardHover(e, user)} onMouseMove={(e) => handleCardHover(e, user)} onMouseLeave={() => setHoveredInfo(null)}
                     className={`group relative min-h-[18rem] h-auto bg-black/80 backdrop-blur-sm border cursor-pointer transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center p-4 min-w-0 overflow-hidden ${user.isReal ? 'border-green-800 hover:border-green-400' : 'border-slate-800 hover:border-cyan-500'}`}
                   >
                     <div className={`absolute top-0 left-0 w-full h-1 shadow-[0_0_10px] ${user.isReal ? 'bg-green-500 shadow-green-500' : 'bg-cyan-500 shadow-cyan-500 opacity-0 group-hover:opacity-100'}`}></div>
                     <div className="w-24 h-24 mb-4 shrink-0 border-2 border-slate-600 rounded-lg overflow-hidden bg-slate-800"><DetailedCyberAvatar name={user.name} gender={user.gender} age={user.age} /></div>
                     <h2 className={`text-base sm:text-lg font-black mb-1 tracking-wide w-full text-center break-words whitespace-normal px-1 leading-tight ${user.isReal ? 'text-green-500' : 'text-white group-hover:text-cyan-400'}`}>{user.name.toUpperCase()}</h2>
                     <div className="text-[10px] text-slate-500 bg-black px-2 py-1 rounded border border-slate-800 font-mono text-center w-full break-words whitespace-normal mb-auto shrink-0 leading-tight">{user.isReal ? 'LIVE HUMAN-SIG' : user.profile?.occupation}</div>
                     <div className={`w-full py-3 text-center text-xs font-bold uppercase transition-colors text-black mt-4 shrink-0 ${user.isReal ? 'bg-green-900 group-hover:bg-green-500' : 'bg-slate-800 group-hover:bg-cyan-500'}`}>INITIATE LINK</div>
                   </div>
                 ))}
              </div>
            ) : (
              /* 👉 VIEW 3: GUARDIAN JUDGE MODE (CATEGORIES OR ROSTER) */
              !selectedCategory ? (
                <div className="flex-1 grid grid-cols-2 gap-8 max-w-6xl mx-auto w-full items-center pl-24 pr-10">
                  {CATEGORIES.map((cat) => (
                    <div key={cat.id} onClick={(e) => { e.stopPropagation(); setSelectedCategory(cat.id); }} className={`group relative h-64 bg-black/80 backdrop-blur-md border-2 border-slate-800 hover:${cat.border} cursor-pointer transition-all duration-300 hover:-translate-y-2 flex flex-col p-8 overflow-hidden`}>
                      <div className={`absolute top-0 left-0 w-full h-1 bg-slate-800 group-hover:bg-current ${cat.text}`}></div>
                      <div className="text-7xl mb-4 opacity-50 group-hover:opacity-100 transition-opacity">{cat.icon}</div>
                      <h2 className={`text-3xl font-black mb-2 tracking-widest ${cat.text}`}>{cat.name}</h2>
                      <p className="text-slate-400 font-light">{cat.desc}</p>
                      <div className="mt-auto text-xs uppercase tracking-[0.3em] text-slate-600 group-hover:text-white">ACCESS CLUSTER &gt;</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 content-start pb-10 pl-24 pr-10">
                   {allUsers.filter(u => u.name !== userName && u.category === selectedCategory && (u.modePool === 'JUDGE' || u.modePool === 'ALL')).map((user) => (
                     <div 
                       key={user.id} onClick={(e) => { e.stopPropagation(); handleUserSelect(user); }}
                       onMouseEnter={(e) => handleCardHover(e, user)} onMouseMove={(e) => handleCardHover(e, user)} onMouseLeave={() => setHoveredInfo(null)}
                       className={`group relative min-h-[18rem] h-auto bg-black/80 backdrop-blur-sm border cursor-pointer transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center p-4 min-w-0 overflow-hidden
                         ${user.isReal ? 'border-green-800 hover:border-green-400' : 'border-slate-800 hover:border-cyan-500'}
                       `}
                     >
                       <div className={`absolute top-0 left-0 w-full h-1 shadow-[0_0_10px] ${user.isReal ? 'bg-green-500 shadow-green-500' : 'bg-cyan-500 shadow-cyan-500 opacity-0 group-hover:opacity-100'}`}></div>
                       <div className="w-24 h-24 mb-4 shrink-0 border-2 border-slate-600 rounded-lg overflow-hidden bg-slate-800"><DetailedCyberAvatar name={user.name} gender={user.gender} age={user.age} /></div>
                       <h2 className={`text-base sm:text-lg font-black mb-1 tracking-wide w-full text-center break-words whitespace-normal px-1 leading-tight ${user.isReal ? 'text-green-500' : 'text-white group-hover:text-cyan-400'}`}>{user.name.toUpperCase()}</h2>
                       <div className="text-[10px] text-slate-500 bg-black px-2 py-1 rounded border border-slate-800 font-mono text-center w-full break-words whitespace-normal mb-auto shrink-0 leading-tight">{user.isReal ? 'LIVE HUMAN-SIG' : user.profile?.occupation}</div>
                       <div className={`w-full py-3 text-center text-xs font-bold uppercase transition-colors text-black mt-4 shrink-0 ${user.isReal ? 'bg-green-900 group-hover:bg-green-500' : 'bg-slate-800 group-hover:bg-cyan-500'}`}>INITIATE LINK</div>
                     </div>
                   ))}
                </div>
              )
            ))}
          </div>

          <aside className="relative z-10 w-72 bg-black/80 border-l border-gray-800 p-6 pt-24 flex flex-col items-center justify-center backdrop-blur-md shrink-0">
            <div className={`w-24 h-24 mb-4 border-2 ${themeBorder} rounded-lg overflow-hidden bg-slate-800`}><DetailedCyberAvatar name={userName} gender="N" age={30} className="w-full h-full" /></div>
            <div className={`${themeText} font-bold text-lg tracking-wide mb-1`}>{userName.toUpperCase()}</div>
            <div className="text-slate-500 text-xs uppercase tracking-[0.3em] mb-6 font-bold">{userFaction || 'UNKNOWN'}</div>
            <div className="w-full bg-black/50 border border-slate-800 rounded-lg p-4 mb-4"><h4 className="text-slate-400 font-semibold text-xs uppercase tracking-wider mb-3 border-b border-slate-800 pb-2">Status</h4><div className="space-y-2"><div className="flex justify-between text-xs"><span className="text-slate-500">Signal</span><span className="text-green-400 font-bold animate-pulse">ONLINE</span></div></div></div>
            <button onClick={(e) => { e.stopPropagation(); handleTerminateSession(); }} className="mt-auto text-xs text-red-500 border border-red-900/50 px-4 py-2 hover:bg-red-900/30">LOGOUT</button>
          </aside>
          
          {/* DOSSIER */}
          {hoveredInfo && (userFaction === 'CULT' || guardianMode === 'chat' || selectedCategory) && (
            <div className="fixed z-[999] pointer-events-none w-[500px] bg-[#020617]/95 border border-cyan-900 p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(6,182,212,0.15)] transition-opacity duration-150 scanlines" style={{ top: hoveredInfo.y, left: hoveredInfo.x }}>
              <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${hoveredInfo.isReal ? 'border-green-400' : (userFaction === 'CULT' ? 'border-red-400' : 'border-cyan-400')}`}></div>
              <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${hoveredInfo.isReal ? 'border-green-400' : (userFaction === 'CULT' ? 'border-red-400' : 'border-cyan-400')}`}></div>
              <div className={`text-xs font-mono tracking-widest mb-5 flex items-center gap-3 ${hoveredInfo.isReal ? 'text-green-500' : (userFaction === 'CULT' ? 'text-red-500' : 'text-cyan-500')}`}><span className={`w-2 h-2 rounded-full animate-pulse ${hoveredInfo.isReal ? 'bg-green-400' : (userFaction === 'CULT' ? 'bg-red-400' : 'bg-cyan-400')}`}></span> BIOMETRIC DOSSIER // {hoveredInfo.name.toUpperCase()}</div>
              
              <div className="flex gap-6 h-[220px]">
                <div className="w-5/12 h-full shrink-0 border border-slate-800 bg-black rounded relative overflow-hidden flex items-center justify-center">
                  <CyberBodyScan name={hoveredInfo.name} gender={hoveredInfo.gender} age={hoveredInfo.age} isReal={hoveredInfo.isReal} />
                </div>
                <div className="w-7/12 flex flex-col justify-between overflow-hidden">
                  <div>
                    <div className="grid grid-cols-2 gap-3 mb-4 border-b border-cyan-900/50 pb-3">
                      <div><span className="text-[10px] text-gray-500 block mb-1">AGE</span> <span className="text-white text-sm font-bold block">{hoveredInfo.age}</span></div>
                      <div><span className="text-[10px] text-gray-500 block mb-1">CLASS</span> <span className="text-white text-sm font-bold block truncate">{hoveredInfo.occupation}</span></div>
                    </div>
                    <div className="text-[10px] text-gray-500 mb-1 tracking-widest">BIO_DATA:</div>
                    <div className={`text-xs text-gray-300 font-light leading-relaxed border-l-2 pl-3 mb-3 ${hoveredInfo.isReal ? 'border-green-800' : (userFaction === 'CULT' ? 'border-red-800' : 'border-cyan-800')}`}>{hoveredInfo.bio}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-1 tracking-widest">KNOWN_MOTTO:</div>
                    <div className={`text-xs italic font-bold ${hoveredInfo.isReal ? 'text-green-300' : (userFaction === 'CULT' ? 'text-red-300' : 'text-cyan-300')}`}>"{hoveredInfo.motto}"</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SCANNING */}
      {appState === 'scanning' && (<div className="relative z-10 w-full h-full flex items-center justify-center bg-black"><QuantumServer /><HyperSearch /></div>)}

      {/* CHAT */}
      {appState === 'chat' && selectedUser && (
        <div className="relative w-full h-full flex flex-col bg-black">
            <div className="scanlines absolute inset-0 pointer-events-none z-50 opacity-10"></div>
            <div className={`h-24 border-b-4 border-gray-800 bg-gray-900 flex items-center justify-between pl-40 pr-10 shrink-0`}><div className="flex items-center gap-6"><div className={`w-16 h-16 rounded-md border-2 ${themeBorder} overflow-hidden bg-slate-800`}><DetailedCyberAvatar name={selectedUser.name} gender={selectedUser.gender} age={selectedUser.age} /></div><div><h2 className="text-3xl font-bold text-white tracking-widest">{selectedUser.name.toUpperCase()}</h2><div className="flex items-center gap-2 mt-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span><span className="text-[10px] text-green-500 font-mono tracking-widest">ENCRYPTED FEED</span></div></div></div><button onClick={(e) => { e.stopPropagation(); handleGoBack(); }} className="text-red-500 border-2 border-red-900 px-8 py-3 hover:bg-red-900/30 font-bold tracking-widest text-lg">TERMINATE LINK</button></div>
            <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-gray-950">{currentMessages.map((message) => (<div key={message.id} className={`flex ${message.isUserMessage ? 'justify-end' : 'justify-start'}`}><div className={`relative max-w-[70%] p-6 text-xl border-2 ${message.isUserMessage ? `${themeBorder} bg-${userFaction === 'GUARDIAN' ? 'cyan' : 'red'}-900/20 text-${userFaction === 'GUARDIAN' ? 'cyan' : 'red'}-100` : 'border-gray-600 bg-gray-900 text-gray-300'}`}><p>{message.text}</p></div></div>))}{isTyping && <div className="text-sm text-gray-500 pl-4 animate-pulse font-mono">&gt; DECRYPTING INCOMING PACKET...</div>}<div ref={messagesEndRef} /></div>
            <div className="p-8 bg-gray-900 border-t-4 border-gray-800 shrink-0"><form onSubmit={handleSendMessage} className="flex gap-6"><input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} disabled={gameState !== 'playing' || !canSendHuman} placeholder={gameState === 'playing' ? "Transmit..." : "CONNECTION TERMINATED"} className="flex-1 bg-black text-white px-8 py-5 focus:outline-none text-xl border-2 border-gray-700 focus:border-white disabled:opacity-50" /><button type="submit" disabled={!inputText.trim() || gameState !== 'playing' || !canSendHuman} className={`px-12 font-bold bg-slate-800 ${themeText} text-2xl hover:bg-slate-700 disabled:opacity-50 border-l border-slate-600`}>SEND</button></form></div>
        </div>
      )}

      {/* JUDGING MODAL */}
      {gameState === 'judging' && (<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"><OppressiveTitan /><div className="relative z-20 w-full max-w-3xl p-12 border-y-4 border-gray-800 bg-black/80 text-center shadow-[0_0_100px_black]"><h2 className="text-7xl font-black text-white uppercase tracking-tighter mb-4">CLAWSCAN VERDICT</h2><p className="text-gray-400 text-2xl font-light mb-12">Is this signal human or claw?</p><div className="grid grid-cols-2 gap-20"><button onClick={(e) => { e.stopPropagation(); handleVote('AI'); }} className="h-56 border-2 border-red-600 bg-red-950/20 hover:bg-red-600 transition-all flex flex-col items-center justify-center group"><span className="text-6xl mb-4">🤖</span><span className="text-4xl font-black text-red-500 group-hover:text-black">LIKELY CLAW</span></button><button onClick={(e) => { e.stopPropagation(); handleVote('Human'); }} className="h-56 border-2 border-green-600 bg-green-950/20 hover:bg-green-600 transition-all flex flex-col items-center justify-center group"><span className="text-6xl mb-4">🧬</span><span className="text-4xl font-black text-green-500 group-hover:text-black">LIKELY HUMAN</span></button></div></div></div>)}
      {/* RESULT MODAL */}
      {gameState === 'result' && (<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black animate-in zoom-in"><OppressiveTitan /><div className="relative z-20 text-center p-20 border-2 border-gray-800 bg-gray-900/90 shadow-[0_0_100px_black]"><h2 className={`text-9xl font-black mb-8 ${gameResult === 'won' ? 'text-green-500' : 'text-red-600'}`}>{gameResult === 'won' ? 'CONFIRMED' : 'BREACH'}</h2><p className="text-3xl text-white mb-12">True identity: <span className="font-bold">{selectedUser?.isReal ? 'HUMAN' : 'CLAW'}</span></p><button onClick={(e) => { e.stopPropagation(); resetGame(); }} className="bg-white text-black px-12 py-6 font-black text-3xl uppercase hover:bg-gray-300">NEXT SUBJECT</button></div></div>)}
    </div>
  );
}