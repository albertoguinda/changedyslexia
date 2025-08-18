export interface ProgressData {
  childId: number;
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  overallProgress: number;
  skillProgress: SkillProgress[];
  gameProgress: GameProgress[];
  trends: ProgressTrend[];
  recommendations: Recommendation[];
}

export interface SkillProgress {
  skillName: string;
  category: string;
  currentLevel: number;
  improvement: number;
  sessionsPlayed: number;
  averageScore: number;
  weeklyData: DataPoint[];
}

export interface GameProgress {
  gameId: number;
  gameName: string;
  timesPlayed: number;
  averageScore: number;
  bestScore: number;
  timeSpent: number;
  difficultyLevel: number;
}

export interface DataPoint {
  date: Date;
  value: number;
}

export interface ProgressTrend {
  skill: string;
  direction: 'improving' | 'stable' | 'declining';
  confidence: number;
  recommendation: string;
}

export interface Recommendation {
  type: 'game' | 'skill' | 'setting';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionable: boolean;
}
