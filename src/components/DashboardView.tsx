import React, { useState } from 'react';
import { useQuizContext } from '../context/QuizContext';
import { ALL_SUBJECTS } from '../data/subjects';
import type { Subject, ExamType } from '../types/quiz';
import {
  BookOpen,
  Award,
  TrendingUp,
  Play,
  ArrowRight,
  GraduationCap,
  Calculator,
  Atom,
  Cpu,
  Binary,
  BookOpenCheck,
  ShieldCheck,
  Dna,
  FlaskConical,
  Zap,
  Sprout,
  Feather,
  Landmark,
  HeartHandshake,
  Hourglass,
  Coins,
  ShoppingBag,
  Megaphone,
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Calculator,
  BookOpen,
  Atom,
  Cpu,
  Binary,
  BookOpenCheck,
  ShieldCheck,
  Dna,
  FlaskConical,
  Zap,
  Sprout,
  Feather,
  Landmark,
  HeartHandshake,
  Hourglass,
  Coins,
  ShoppingBag,
  TrendingUp,
  Megaphone,
};

interface Props {
  onStartQuiz: (
    subject: Subject,
    topicTitle: string,
    examType?: ExamType
  ) => void;
  onOpenClassModal: () => void;
  onSelectNav: (tab: any) => void;
}

export const DashboardView: React.FC<Props> = ({
  onStartQuiz,
  onOpenClassModal,
  onSelectNav,
}) => {
  const { profile } = useQuizContext();
  const [activeFilter, setActiveFilter] = useState<'all' | 'stream' | 'core'>('all');

  const isSenior = profile.classLevel.startsWith('SS');

  // Filter subjects based on class & stream
  const relevantSubjects = ALL_SUBJECTS.filter((sub) => {
    if (!isSenior) {
      // JSS only sees JSS subjects
      return sub.division === 'JSS';
    } else {
      // SSS sees General core subjects + their chosen stream
      if (sub.division !== 'SSS') return false;
      if (activeFilter === 'core') return sub.stream === 'General';
      if (activeFilter === 'stream') return sub.stream === profile.stream;
      return sub.stream === 'General' || sub.stream === profile.stream;
    }
  });

  const handleStartDailyChallenge = () => {
    // Pick 10 mixed questions for the daily challenge
    const subject = relevantSubjects[0] || ALL_SUBJECTS[0];
    onStartQuiz(subject, 'Daily 10-Question Knowledge Challenge');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 sm:p-10 shadow-xl border border-emerald-600/30">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-emerald-100 text-xs font-bold mb-3">
            <GraduationCap className="w-4 h-4" />
            <span>
              {profile.classLevel} {isSenior ? `• ${profile.stream} Department` : '• Junior Secondary'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
            Welcome back, {profile.name}! 👋
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed mb-6 font-medium">
            Practise with 20-second curriculum questions, conquer national exams (BECE/WAEC/JAMB),
            and climb the All-Naija Leaderboard!
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleStartDailyChallenge}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-lg shadow-amber-400/20 transition transform active:scale-95"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Start Daily Challenge (2x XP)</span>
            </button>

            <button
              onClick={onOpenClassModal}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm backdrop-blur-sm transition"
            >
              <span>Change Class / Stream</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block opacity-20 pointer-events-none">
          <GraduationCap className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* National Exam Prep Callout Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-orange-500/10 border-2 border-amber-300/80 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/30">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-slate-900 text-base sm:text-lg">
                National Exam Practice Mode Active
              </h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500 text-white">
                New
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Simulate real past questions for {isSenior ? 'WAEC, NECO & JAMB (UTME)' : 'BECE (Junior WAEC)'} with immediate curriculum explanations.
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectNav('exam')}
          className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider shrink-0 transition flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span>Open Exam Portal</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Subject Catalog Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Curriculum Subjects
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Select any subject to begin a 20-second topic assessment
            </p>
          </div>

          {/* SSS Filter Tabs */}
          {isSenior && (
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-200/70 text-xs font-bold text-slate-600">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  activeFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
                }`}
              >
                All Subjects
              </button>
              <button
                onClick={() => setActiveFilter('stream')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  activeFilter === 'stream' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
                }`}
              >
                {profile.stream}
              </button>
              <button
                onClick={() => setActiveFilter('core')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  activeFilter === 'core' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
                }`}
              >
                General Core
              </button>
            </div>
          )}
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {relevantSubjects.map((subject) => {
            const Icon = ICON_MAP[subject.iconName] || BookOpen;

            return (
              <div
                key={subject.id}
                className="group relative bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${subject.color} text-white flex items-center justify-center shadow-md`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      <span>{subject.totalTopics} Topics</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
                    {subject.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1 mb-4">
                    {subject.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400">
                    20s / question
                  </span>
                  <button
                    onClick={() => onStartQuiz(subject, 'General Revision & Topic Assessment')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 group-hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition transform active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start Quiz</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
