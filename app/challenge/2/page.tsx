'use client';

import { useState } from 'react';
import Link from 'next/link';
import GraphNode from '../components/GraphNode';
import GraphEdge from '../components/GraphEdge';

type City = {
  id: string;
  name: string;
  x: number;
  y: number;
};

const CITIES: City[] = [
  { id: 'A', name: 'A', x: 250, y: 80 },
  { id: 'B', name: 'B', x: 450, y: 100 },
  { id: 'C', name: 'C', x: 400, y: 280 },
  { id: 'D', name: 'D', x: 150, y: 300 },
];

const DISTANCES: Record<string, Record<string, number>> = {
  A: { B: 8, C: 12, D: 10 },
  B: { A: 8, C: 6, D: 15 },
  C: { A: 12, B: 6, D: 9 },
  D: { A: 10, B: 15, C: 9 },
};

export default function TSPLevel() {
  const [path, setPath] = useState<string[]>([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleCityClick = (cityId: string) => {
    if (completed) return;

    if (path.length === 0) {
      setPath([cityId]);
      setTotalDistance(0);
    } else if (path.includes(cityId)) {
      return; // Can't revisit
    } else {
      const lastCity = path[path.length - 1];
      const distance = DISTANCES[lastCity][cityId];
      const newPath = [...path, cityId];
      const newTotal = totalDistance + distance;
      setPath(newPath);
      setTotalDistance(newTotal);

      if (newPath.length === CITIES.length) {
        const returnDistance = DISTANCES[cityId][newPath[0]];
        setTotalDistance(newTotal + returnDistance);
        setCompleted(true);
      }
    }
  };

  const reset = () => {
    setPath([]);
    setTotalDistance(0);
    setCompleted(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-orange-400 to-pink-500">
      <div className="flex-1 p-8">
        <Link href="/challenge" className="text-white/80 hover:text-white underline mb-4 inline-block">
          ← Back to Challenges
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Level 2: Traveling Salesman Problem</h1>
        <p className="text-white/90 mb-6">Visit all cities exactly once and return to start. Find the shortest route!</p>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-4 relative" style={{ height: '400px' }}>
          <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
            {CITIES.map((city, i) =>
              CITIES.slice(i + 1).map((other, j) => (
                <GraphEdge
                  key={`${i}-${j}`}
                  x1={city.x}
                  y1={city.y}
                  x2={other.x}
                  y2={other.y}
                  weight={DISTANCES[city.id][other.id]}
                />
              ))
            )}
            {path.length > 1 &&
              path.map((cityId, i) => {
                if (i === 0) return null;
                const c1 = CITIES.find((c) => c.id === path[i - 1]);
                const c2 = CITIES.find((c) => c.id === cityId);
                if (!c1 || !c2) return null;
                return <GraphEdge key={i} x1={c1.x} y1={c1.y} x2={c2.x} y2={c2.y} highlighted />;
              })}
            {completed && path.length > 0 && (
              <GraphEdge
                x1={CITIES.find((c) => c.id === path[path.length - 1])!.x}
                y1={CITIES.find((c) => c.id === path[path.length - 1])!.y}
                x2={CITIES.find((c) => c.id === path[0])!.x}
                y2={CITIES.find((c) => c.id === path[0])!.y}
                highlighted
              />
            )}
          </svg>
          {CITIES.map((city) => (
            <GraphNode
              key={city.id}
              id={city.id}
              label={city.name}
              x={city.x}
              y={city.y}
              selected={path.includes(city.id)}
              onClick={() => handleCityClick(city.id)}
            />
          ))}
        </div>

        <div className="mt-4 bg-white/20 backdrop-blur rounded-lg p-4 text-white">
          <div className="font-semibold mb-1">
            {completed ? `✅ Tour Complete! Total Distance: ${totalDistance}` : `Path: ${path.join(' → ') || 'Start by selecting a city'}`}
          </div>
          {completed && (
            <button onClick={reset} className="mt-2 px-4 py-2 bg-white text-black rounded-lg font-semibold">
              Try Again
            </button>
          )}
        </div>
      </div>

      <aside className="w-72 bg-white/10 p-6 backdrop-blur rounded-l-2xl">
        <h3 className="text-white font-bold mb-2">Instructions</h3>
        <p className="text-white/80 text-sm mb-4">
          Click cities in order to create a tour. Once you visit all cities, the path will automatically return to the start.
        </p>
        <div className="bg-white/20 rounded p-3 text-white text-xs">
          <strong>Goal:</strong> Minimize the total distance!
        </div>
      </aside>
    </div>
  );
}
