export type LevelType = 'interactive' | 'assumption' | 'flowchart' | 'python_verify' | 'extension';

export interface Level {
  id: number;
  title: string;
  type: LevelType;
  heads: number;
  legs: number;
  targetC: number;
  targetR: number;
}

export const LEVELS: Level[] = [
  { id: 1, title: '初探农场', type: 'interactive', heads: 5, legs: 14, targetC: 3, targetR: 2 },
  { id: 2, title: '理论推导：假设法', type: 'assumption', heads: 6, legs: 18, targetC: 3, targetR: 3 },
  { id: 3, title: '算法基础：流程图', type: 'flowchart', heads: 35, legs: 94, targetC: 23, targetR: 12 },
  { id: 4, title: '上机实践：Python验证', type: 'python_verify', heads: 35, legs: 94, targetC: 23, targetR: 12 },
  { id: 5, title: '拓展提升：韩信点兵', type: 'extension', heads: 0, legs: 0, targetC: 0, targetR: 0 },
];
