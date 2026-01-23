'use client';

type GraphEdgeProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  weight?: number;
  highlighted?: boolean;
};

export default function GraphEdge({ x1, y1, x2, y2, weight, highlighted }: GraphEdgeProps) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className={`transition-all ${highlighted ? 'stroke-blue-600 stroke-[3]' : 'stroke-gray-300 stroke-2'}`}
      />
      {weight !== undefined && (
        <text
          x={midX}
          y={midY}
          className="fill-gray-600 text-xs font-semibold"
          textAnchor="middle"
          dy="-5"
        >
          {weight}
        </text>
      )}
    </g>
  );
}
