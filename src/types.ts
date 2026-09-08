export interface Module {
  id: string;
  name: string;
  description: string;
  modelUrl: string;
  category: string;
  difficulty: 'Standard' | 'Clinical' | 'Surgical' | 'Advanced' | 'Medical';
}

export interface UserModuleProgress {
  userId: string;
  moduleId: string;
  completion: number;
  status: 'In Progress' | 'Completed' | 'Locked' | 'Review';
  lastAccessed: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  questions: QuizQuestion[];
  createdBy: string;
  createdAt: string;
}

export interface UserQuizResult {
  userId: string;
  quizId: string;
  moduleId: string;
  score: number;
  total: number;
  completedAt: string;
}

export interface MemoryCard {
  id: string;
  userId: string;
  moduleId: string;
  front: string;
  back: string;
  nextReview: string;
  interval: number;
}
