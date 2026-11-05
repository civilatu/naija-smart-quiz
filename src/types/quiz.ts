export type Division = 'JSS' | 'SSS';

export type JSSClass = 'JSS 1' | 'JSS 2' | 'JSS 3';
export type SSSClass = 'SS 1' | 'SS 2' | 'SS 3';
export type AcademicClass = JSSClass | SSSClass;

export type Stream = 'Science' | 'Arts' | 'Commercial' | 'General';

export type ExamType = 'BECE' | 'WAEC' | 'NECO' | 'JAMB';

export interface Subject {
  id: string;
  name: string;
  division: Division;
  stream?: Stream; // for SSS
  iconName: string;
  color: string;
  description: string;
  totalTopics: number;
}

export interface Topic {
  id: string;
  subjectId: string;
  classLevel: AcademicClass;
  title: string;
  description?: string;
  questionCount: number;
}

export interface Question {
  id: string;
  subjectId: string;
  topicId: string;
  classLevel: AcademicClass;
  stream?: Stream;
  questionText: string;
  options: [string, string, string, string]; // exactly 4 options: A, B, C, D
  correctOptionIndex: number; // 0..3
  explanation: string; // 2-3 concise curriculum-aligned sentences
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  examTag?: ExamType; // e.g. "WAEC" or "BECE"
}

export interface UserAnswer {
  questionId: string;
  selectedOption: number | null; // null if timed out
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface QuizSessionResult {
  id: string;
  subjectId: string;
  topicTitle: string;
  classLevel: AcademicClass;
  stream?: Stream;
  examType?: ExamType;
  questions: Question[];
  userAnswers: UserAnswer[];
  score: number; // e.g. 16 out of 20
  percentage: number;
  totalTimeSeconds: number;
  completedAt: string;
  recommendedTopics: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
  unlockedAt?: string;
}

export interface UserProfile {
  id: string;
  isGuest: boolean;
  name: string;
  classLevel: AcademicClass;
  stream: Stream; // Default to 'General' for JSS or specific for SSS
  schoolName?: string;
  state?: string;
  xpPoints: number;
  streakDays: number;
  lastActiveDate: string;
  unlockedBadges: string[]; // badge IDs
  quizHistory: QuizSessionResult[];
  privacyShowOnLeaderboard: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  classLevel: AcademicClass;
  stream: Stream;
  schoolName: string;
  xpPoints: number;
  streakDays: number;
  rank: number;
}
