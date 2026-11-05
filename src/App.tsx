import { useState } from 'react';
import { useQuizContext } from './context/QuizContext';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ExamPrepView } from './components/ExamPrepView';
import { LeaderboardView } from './components/LeaderboardView';
import { ProfileView } from './components/ProfileView';
import { QuizEngine } from './components/QuizEngine';
import { ResultsView } from './components/ResultsView';
import { ClassSelectorModal } from './components/ClassSelectorModal';
import { COMPREHENSIVE_QUESTIONS } from './data/questions';
import type { ExamType, Question, QuizSessionResult, Subject } from './types/quiz';

export function App() {
  const { profile, saveQuizResult } = useQuizContext();

  const [activeTab, setActiveTab] = useState<'home' | 'subjects' | 'exam' | 'leaderboard' | 'profile'>('home');
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);

  // Active Quiz State
  const [activeQuizSession, setActiveQuizSession] = useState<{
    subject: Subject;
    topicTitle: string;
    examType?: ExamType;
    questions: Question[];
  } | null>(null);

  // Active Results State
  const [completedResult, setCompletedResult] = useState<QuizSessionResult | null>(null);

  const startQuiz = (subject: Subject, topicTitle: string, examType?: ExamType) => {
    // 1. Filter questions strictly matching the chosen subject
    let filtered = COMPREHENSIVE_QUESTIONS.filter((q) => q.subjectId === subject.id);

    // 2. If specific exam requested, filter by examTag if available, or keep subject questions
    if (examType) {
      const examFiltered = filtered.filter((q) => q.examTag === examType);
      if (examFiltered.length > 0) {
        filtered = examFiltered;
      }
    }

    // 3. Fallback only within the same academic division (JSS vs SSS) if empty, NEVER cross-contaminate across subjects
    if (filtered.length === 0) {
      filtered = COMPREHENSIVE_QUESTIONS.filter(
        (q) => q.subjectId.startsWith(subject.division.toLowerCase())
      );
    }

    // Deduplicate and randomize order
    const uniquePool = Array.from(new Map(filtered.map((item) => [item.id, item])).values());
    const shuffled = uniquePool.sort(() => 0.5 - Math.random()).slice(0, 20); // up to 20 questions

    setActiveQuizSession({
      subject,
      topicTitle,
      examType,
      questions: shuffled,
    });
    setCompletedResult(null);
  };

  const handleFinishQuiz = (result: QuizSessionResult) => {
    saveQuizResult(result);
    setCompletedResult(result);
    setActiveQuizSession(null);
  };

  const handleRetake = () => {
    if (completedResult) {
      const subject = {
        id: completedResult.subjectId,
        name: completedResult.topicTitle,
        division: completedResult.classLevel.startsWith('SS') ? 'SSS' : 'JSS',
        iconName: 'BookOpen',
        color: 'from-emerald-600 to-teal-800',
        description: '',
        totalTopics: 10,
      } as Subject;
      startQuiz(subject, completedResult.topicTitle, completedResult.examType);
    }
  };

  const handleGoHome = () => {
    setCompletedResult(null);
    setActiveQuizSession(null);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      {!activeQuizSession && (
        <Header
          currentTab={activeTab}
          onSelectNav={(tab) => {
            setActiveTab(tab);
            setCompletedResult(null);
          }}
          onOpenClassModal={() => setIsClassModalOpen(true)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeQuizSession ? (
          <QuizEngine
            title={activeQuizSession.subject.name}
            subtitle={activeQuizSession.topicTitle}
            questions={activeQuizSession.questions}
            subjectId={activeQuizSession.subject.id}
            topicTitle={activeQuizSession.topicTitle}
            classLevel={profile.classLevel}
            stream={profile.stream}
            examType={activeQuizSession.examType}
            onFinishQuiz={handleFinishQuiz}
            onExit={handleGoHome}
          />
        ) : completedResult ? (
          <ResultsView
            result={completedResult}
            onRetake={handleRetake}
            onGoHome={handleGoHome}
          />
        ) : (
          <>
            {activeTab === 'home' || activeTab === 'subjects' ? (
              <DashboardView
                onStartQuiz={(subject, topicTitle) => startQuiz(subject, topicTitle)}
                onOpenClassModal={() => setIsClassModalOpen(true)}
                onSelectNav={setActiveTab}
              />
            ) : activeTab === 'exam' ? (
              <ExamPrepView
                onStartExamQuiz={(subject, examType) =>
                  startQuiz(subject, `${examType} Past Examination Practice`, examType)
                }
              />
            ) : activeTab === 'leaderboard' ? (
              <LeaderboardView />
            ) : (
              <ProfileView onOpenClassModal={() => setIsClassModalOpen(true)} />
            )}
          </>
        )}
      </main>

      {/* Class and Stream Selection Modal */}
      <ClassSelectorModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">NAIJA SMART QUIZ</span>
            <span>• Nigerian Secondary School Learning & Assessment Platform</span>
          </div>
          <div>
            <span>NERDC Curriculum Aligned • BECE, WAEC, NECO & JAMB Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
