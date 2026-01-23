export type LevelData = {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  algorithm: 'bipartite' | 'dijkstra' | 'eulerian' | 'hamiltonian' | 'tsp';
};

export const LEVELS: LevelData[] = [
  {
    id: 1,
    title: 'Bipartite Matching',
    description: 'Match nodes from two distinct sets with valid edges. Find a maximum matching.',
    difficulty: 'easy',
    algorithm: 'bipartite',
  },
  {
    id: 2,
    title: 'Dijkstra Shortest Path',
    description: 'Find the shortest path from the start node to the target in a weighted graph.',
    difficulty: 'medium',
    algorithm: 'dijkstra',
  },
  {
    id: 3,
    title: 'Hamiltonian Cycle',
    description: 'Find a cycle that visits every vertex exactly once and returns to the start.',
    difficulty: 'medium',
    algorithm: 'hamiltonian',
  },
  {
    id: 4,
    title: 'Eulerian Circuit',
    description: 'Find a circuit that visits every edge exactly once and returns to the starting vertex.',
    difficulty: 'hard',
    algorithm: 'eulerian',
  },
  {
    id: 5,
    title: 'Traveling Salesman Problem',
    description: 'Visit all cities exactly once and return to start. Find the shortest route.',
    difficulty: 'hard',
    algorithm: 'tsp',
  },
];

