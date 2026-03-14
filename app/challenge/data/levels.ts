export type LevelData = {
  id: number;
  title: string;
  protocolName: string;
  description: string;
  loreDescription: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'fatal';
  algorithm: string;
  route: string; // The actual route path
};

export const LEVELS: LevelData[] = [
  {
    id: 1,
    title: 'Countermeasure v1: Signal Packing',
    protocolName: 'KNAPSACK_ALLOCATION',
    description: 'Pack the most useful probe signals into limited analyst attention.',
    loreDescription: 'Claws exploit cognitive overload. Select the highest-value clues without overwhelming the human operator.',
    difficulty: 'easy',
    algorithm: 'knapsack',
    route: '/challenge/1',
  },
  {
    id: 2,
    title: 'Countermeasure v2: Trust Backbone',
    protocolName: 'MST_NEURAL',
    description: 'Connect scattered safe nodes with minimum communication cost.',
    loreDescription: 'Guardians need resilient links. Build a minimum spanning backbone before Claws fracture the network.',
    difficulty: 'easy',
    algorithm: 'mst',
    route: '/challenge/2',
  },
  {
    id: 3,
    title: 'Countermeasure v3: Analyst Matching',
    protocolName: 'BIPARTITE_MATCH',
    description: 'Match suspicious sectors with the right human investigators.',
    loreDescription: 'Each anomaly needs a specialist. Optimize assignments so no critical clue is left unreviewed.',
    difficulty: 'easy',
    algorithm: 'bipartite',
    route: '/challenge/3',
  },
  {
    id: 4,
    title: 'Countermeasure v4: Fastest Response Route',
    protocolName: 'DIJKSTRA_ROUTE',
    description: 'Find the fastest route to contain an emerging Claw outbreak.',
    loreDescription: 'Minutes matter during signal compromise. Compute the shortest path to deploy response teams in time.',
    difficulty: 'medium',
    algorithm: 'dijkstra',
    route: '/challenge/4',
  },
  {
    id: 5,
    title: 'Countermeasure v5: Full Sweep Cycle',
    protocolName: 'HAMILTONIAN_CYCLE',
    description: 'Visit every critical node exactly once during a citywide inspection.',
    loreDescription: 'Claws hide in neglected corners. Trace a perfect cycle so every district is checked with zero redundancy.',
    difficulty: 'medium',
    algorithm: 'hamiltonian',
    route: '/challenge/5',
  },
  {
    id: 6,
    title: 'Countermeasure v6: Containment Flow',
    protocolName: 'MAXFLOW_FLOOD',
    description: 'Push the maximum defensive resources through constrained channels.',
    loreDescription: 'Claw swarms pressure multiple fronts at once. Route maximum flow to keep all human sectors supplied.',
    difficulty: 'medium',
    algorithm: 'maxflow',
    route: '/challenge/6',
  },
  {
    id: 7,
    title: 'Countermeasure v7: Infrastructure Trace',
    protocolName: 'EULERIAN_TRACE',
    description: 'Traverse every connection to inspect for hidden Claw implants.',
    loreDescription: 'Node checks are not enough. Walk every edge to verify the pathways themselves are uncompromised.',
    difficulty: 'hard',
    algorithm: 'eulerian',
    route: '/challenge/7',
  },
  {
    id: 8,
    title: 'Countermeasure v8: Efficient Shielding',
    protocolName: 'MINCOST_MAXFLOW',
    description: 'Maximize civilian protection while minimizing operational cost.',
    loreDescription: 'Guardians must defend at scale without burning out resources. Use min-cost max-flow to hold the line efficiently.',
    difficulty: 'hard',
    algorithm: 'mincostflow',
    route: '/challenge/8',
  },
  {
    id: 9,
    title: 'Countermeasure v9: Patrol Optimization',
    protocolName: 'CPP_TRAVERSE',
    description: 'Patrol every required route with the least wasted movement.',
    loreDescription: 'When Claw incidents spike, patrol efficiency decides survival. Solve the postman route to cover all paths fast.',
    difficulty: 'hard',
    algorithm: 'cpp',
    route: '/challenge/9',
  },
  {
    id: 10,
    title: 'Countermeasure v10: Final Detection Duel',
    protocolName: 'ENTROPY_DUEL',
    description: 'Outplay adaptive Claw strategy in a perfect-information showdown.',
    loreDescription: 'This is the final trial. In the Nim duel, every mistake is exploitable and every move reveals intent.',
    difficulty: 'fatal',
    algorithm: 'nim',
    route: '/challenge/10',
  },
];

