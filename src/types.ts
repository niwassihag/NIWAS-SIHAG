export type SubjectType = 'Math' | 'English' | 'GK' | 'Reasoning';

export type MockTier = 'Tier 1 (Prelims)' | 'Tier 2 (Mains)';

export interface SectionalScores {
  math: number;
  english: number;
  gk: number;
  reasoning: number;
  computer?: number;
}

export interface SectionalMaxScores {
  math: number;
  english: number;
  gk: number;
  reasoning: number;
  computer?: number;
}

export interface Topic {
  id: number;
  subject: SubjectType;
  name: string;
  isDone: boolean;
}

export interface MockTest {
  id: number;
  type: MockTier;
  date: string; // ISO date YYYY-MM-DD
  score: number;
  maxScore: number;
  sections?: SectionalScores;
  note: string;
}

export interface SubjectMeta {
  key: SubjectType;
  displayName: string;
  shortName: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  tier1Max: number;
  tier2Max: number;
}

export interface SubjectTestStats {
  subject: SubjectType;
  displayName: string;
  shortName: string;
  color: string;
  avgPercentage: number;
  highestPercentage: number;
  latestPercentage: number;
  trend: 'improving' | 'declining' | 'stable';
  trendDelta: number;
  status: 'Strong' | 'Good' | 'On Track' | 'Needs Attention';
}

export type ScreenTab = 'Dashboard' | 'Syllabus' | 'Mock Tests';
