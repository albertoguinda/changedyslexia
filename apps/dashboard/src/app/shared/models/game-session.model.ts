export interface GameSession {
  id: number;
  childId: number;
  gameId: number;
  gameName: string;
  gameType: 'letter-detective' | 'word-builder' | 'spatial-navigator';
  startTime: Date;
  endTime: Date;
  duration: number;
  score: number;
  accuracy: number;
  attempts: number;
  completedLevels: number;
  skillsWorked: Skill[];
  performance: PerformanceMetrics;
}

export interface Skill {
  name: string;
  category: 'visual-perception' | 'phonology' | 'memory' | 'attention' | 'spatial';
  improvementScore: number;
}

export interface PerformanceMetrics {
  reactionTime: number;
  errorRate: number;
  progressionRate: number;
  frustrationLevel: 'low' | 'medium' | 'high';
}
