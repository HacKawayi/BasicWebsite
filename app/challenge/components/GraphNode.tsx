'use client';

type GraphNodeProps = {
  id: string;
  label: string;
  x: number;
  y: number;
  selected?: boolean;
  onClick?: () => void;
};

export default function GraphNode({ id, label, x, y, selected, onClick }: GraphNodeProps) {
  return (
    <div
      onClick={onClick}
      className={`absolute w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer transition-all ${
        selected
          ? 'bg-blue-600 text-white scale-110'
          : 'bg-white text-gray-800 border-2 border-gray-300 hover:border-blue-400'
      }`}
      style={{ left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -50%)' }}
    >
      {label}
    </div>
  );
}
