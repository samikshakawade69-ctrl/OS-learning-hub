export type CategoryId = 'memory-management' | 'process-management' | 'deadlock-management' | 'process-synchronization';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface PracticeQuestion {
  question: string;
  answer: string;
  type: 'concept' | 'numerical' | 'exam';
}

export interface SubTopic {
  id: string;
  title: string;
  section: string; // e.g. "A. Memory Allocation", "B. Process Scheduling"
  categoryId: CategoryId;
  shortDescription: string;
  badge?: string;
  simulatorType?: 
    | 'cpu-scheduling' 
    | 'memory-allocation' 
    | 'page-replacement' 
    | 'bankers' 
    | 'rag' 
    | 'producer-consumer' 
    | 'dining-philosophers' 
    | 'readers-writers' 
    | 'peterson' 
    | 'paging-translation';
  content: {
    introduction: string;
    whyUsed: string;
    howItWorks: string[];
    diagramDescription: string;
    diagramType?: 'ascii' | 'flow' | 'table' | 'interactive';
    diagramData?: any;
    example: {
      title: string;
      scenario: string;
      solution: string;
    };
    advantages: string[];
    disadvantages: string[];
    examNotes: string[];
    practiceQuestions: PracticeQuestion[];
    quiz: QuizQuestion[];
  };
}

export interface Category {
  id: CategoryId;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  themeColor: {
    primary: string;
    light: string;
    border: string;
    text: string;
    badgeBg: string;
    gradient: string;
  };
  subtopics: SubTopic[];
}

export interface UserProgress {
  completedTopics: string[]; // subtopic ids
  bookmarkedTopics: string[]; // subtopic ids
  quizScores: Record<string, { score: number; total: number; completedAt: string }>;
  recentlyVisited: string[]; // subtopic ids
}
