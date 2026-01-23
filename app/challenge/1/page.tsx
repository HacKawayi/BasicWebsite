'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GraphNode from '../components/GraphNode';
import GraphEdge from '../components/GraphEdge';

type BipartiteNode = {
  id: string;
  label: string;
  set: 'A' | 'B';
  x: number;
  y: number;
};

const NODES: BipartiteNode[] = [
  { id: 'A1', label: 'A1', set: 'A', x: 100, y: 100 },
  { id: 'A2', label: 'A2', set: 'A', x: 100, y: 200 },
  { id: 'A3', label: 'A3', set: 'A', x: 100, y: 300 },
  { id: 'B1', label: 'B1', set: 'B', x: 400, y: 100 },
  { id: 'B2', label: 'B2', set: 'B', x: 400, y: 200 },
  { id: 'B3', label: 'B3', set: 'B', x: 400, y: 300 },
];

const VALID_EDGES = [
  ['A1', 'B1'],
  ['A1', 'B2'],
  ['A2', 'B2'],
  ['A2', 'B3'],
  ['A3', 'B1'],
];

export default function BipartiteLevel() {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [matches, setMatches] = useState<string[][]>([]);
  const [feedback, setFeedback] = useState('');
  const [history, setHistory] = useState<string[][][]>([[]]);

  useEffect(() => {
    // Mark as completed when player finds maximum matching
    if (matches.length === 3) {
      try {
        const completedRaw = typeof window !== 'undefined' ? localStorage.getItem('completed_levels') : null;
        const completedLevels: number[] = completedRaw ? JSON.parse(completedRaw) : [];
        if (!completedLevels.includes(1)) {
          completedLevels.push(1);
          localStorage.setItem('completed_levels', JSON.stringify(completedLevels));
        }
      } catch (e) {
        // ignore
      }
    }
  }, [matches]);

  const handleNodeClick = (nodeId: string) => {
    if (selectedNodes.includes(nodeId)) {
      setSelectedNodes(selectedNodes.filter((id) => id !== nodeId));
    } else {
      const newSelection = [...selectedNodes, nodeId];
      setSelectedNodes(newSelection);

      if (newSelection.length === 2) {
        const edge = newSelection.sort();
        if (VALID_EDGES.some((e) => JSON.stringify(e.sort()) === JSON.stringify(edge))) {
          const newMatches = [...matches, edge];
          setMatches(newMatches);
          setHistory([...history, newMatches]);
          setFeedback('✅ Valid match added!');
        } else {
          setFeedback('❌ Invalid edge. Try again.');
        }
        setTimeout(() => {
          setSelectedNodes([]);
          setFeedback('');
        }, 1000);
      }
    }
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const newHistory = history.slice(0, -1);
    const lastMatches = newHistory[newHistory.length - 1];
    setHistory(newHistory);
    setMatches(lastMatches);
    setFeedback('');
  };

  const reset = () => {
    setMatches([]);
    setSelectedNodes([]);
    setFeedback('');
    setHistory([[]]);
  };

  const isMatched = (nodeId: string) => {
    return matches.some((m) => m.includes(nodeId));
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-400 to-cyan-500">
      <div className="flex-1 p-8">
        <Link href="/challenge" className="text-white/80 hover:text-white underline mb-4 inline-block">
          ← Back to Challenges
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Level 1: Bipartite Matching</h1>
        <p className="text-white/90 mb-6">Click two nodes from different sets to create a matching. Maximize the number of matches!</p>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-4 relative" style={{ height: '400px' }}>
          <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
            {VALID_EDGES.map((edge, i) => {
              const n1 = NODES.find((n) => n.id === edge[0]);
              const n2 = NODES.find((n) => n.id === edge[1]);
              if (!n1 || !n2) return null;
              const highlighted = matches.some((m) => JSON.stringify(m.sort()) === JSON.stringify(edge.sort()));
              return (
                <GraphEdge key={i} x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} highlighted={highlighted} />
              );
            })}
          </svg>
          {NODES.map((node) => (
            <GraphNode
              key={node.id}
              id={node.id}
              label={node.label}
              x={node.x}
              y={node.y}
              selected={selectedNodes.includes(node.id) || isMatched(node.id)}
              onClick={() => handleNodeClick(node.id)}
            />
          ))}
        </div>

        {feedback && (
          <div className="bg-white rounded-lg shadow p-4 text-center font-semibold">
            {feedback}
          </div>
        )}

        <div className="mt-4 bg-white/20 backdrop-blur rounded-lg p-4 text-white">
          <div className="font-semibold mb-2">
            {matches.length === 3 ? '✅ Perfect! Maximum matching achieved!' : `Matches: ${matches.length} / 3`}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleUndo}
              disabled={history.length <= 1}
              className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ↶ Undo
            </button>
            <button onClick={reset} className="px-4 py-2 bg-white text-black rounded-lg font-semibold">
              Reset
            </button>
          </div>
        </div>
      </div>

      <aside className="w-72 bg-white/10 p-6 backdrop-blur rounded-l-2xl">
        <h3 className="text-white font-bold mb-2">Instructions</h3>
        <p className="text-white/80 text-sm mb-4">
          Create a maximum matching by connecting nodes from Set A to Set B. Only valid edges (shown in gray) are allowed.
        </p>
        <div className="bg-white/20 rounded p-3 text-white text-xs">
          <strong>Goal:</strong> Match all nodes if possible!
        </div>
      </aside>
    </div>
  );
}
