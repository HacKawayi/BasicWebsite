export type LevelData = {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  algorithm: 'bipartite' | 'tsp' | 'dijkstra';
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
    title: 'Traveling Salesman',
    description: 'Visit all cities exactly once and return to start. Find the shortest route.',
    difficulty: 'medium',
    algorithm: 'tsp',
  },
  {
    id: 3,
    title: 'Dijkstra Shortest Path',
    description: 'Find the shortest path from the start node to the target in a weighted graph.',
    difficulty: 'hard',
    algorithm: 'dijkstra',
  },
];
