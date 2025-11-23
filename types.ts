
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  MODULE_DETAIL = 'MODULE_DETAIL',
  ECOSYSTEM = 'ECOSYSTEM',
  AI_TUTOR = 'AI_TUTOR',
}

export enum ModuleCategory {
  COMPUTE = 'COMPUTE',
  STORAGE = 'STORAGE',
  DATABASE = 'DATABASE',
  NETWORK = 'NETWORK',
  SECURITY = 'SECURITY',
  SERVERLESS = 'SERVERLESS',
  DEVOPS = 'DEVOPS',
  ARCH = 'ARCH',
  BILLING = 'BILLING',
}

export type TopicType = 'theory' | 'lab';

export interface Topic {
  id: string;
  title: string;
  type: TopicType;
  description?: string; // Short preview
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  iconName: string; // Lucide icon name
  category: ModuleCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: Topic[];
}

export interface CourseTrack {
  id: string;
  title: string;
  description: string;
  modules: CourseModule[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isError?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizResult {
  score: number;
  total: number;
  history: { question: string; isCorrect: boolean }[];
}

export interface UserStats {
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: number;
  title: string;
}

export interface ResourceItem {
  title: string;
  description: string;
  url: string;
  iconName: string;
  tags: string[];
}

export interface ResourceCategory {
  id: string;
  title: string;
  items: ResourceItem[];
}