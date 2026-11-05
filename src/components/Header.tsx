import React from 'react';
import { useQuizContext } from '../context/QuizContext';
import { Flame, Trophy, Award, BookOpen, ChevronRight, Zap } from 'lucide-react';

interface Props {
  onOpenClassModal: () => void;
  onSelectNav: (tab: 'home' | 'subjects' | 'exam' | 'leaderboard' | 'profile') => void;
  currentTab: string;
}

export const Header: React.FC<Props> = ({ onOpenClassModal, onSelectNav, currentTab }) => {
  const { profile } = useQuizContext();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div
            onClick={() => onSelectNav('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl tracking-tighter">₦Q</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  NAIJA<span className="text-emerald-600">SMART</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block font-medium">
                Learn • Practise • Compete • Excel
              </p>
            </div>
          </div>

          {/* Quick Stats: Streak, XP & Active Class Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak */}
            <div
              title={`${profile.streakDays} Day Learning Streak`}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 font-bold text-xs shadow-sm"
            >
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
              <span>{profile.streakDays}d</span>
            </div>

            {/* XP Points */}
            <div
              title={`${profile.xpPoints} Total Knowledge XP Points`}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-bold text-xs shadow-sm"
            >
              <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{profile.xpPoints} XP</span>
            </div>

            {/* Class & Stream Pill Selector */}
            <button
              onClick={onOpenClassModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs transition shadow-sm"
            >
              <span className="hidden xs:inline">Class:</span>
              <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-lg text-[11px]">
                {profile.classLevel}
              </span>
              {profile.classLevel.startsWith('SS') && (
                <span className="text-[11px] text-emerald-700 font-semibold hidden md:inline">
                  • {profile.stream}
                </span>
              )}
              <ChevronRight className="w-3.5 h-3.5 text-emerald-700" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-4 border-t border-slate-100 py-1 overflow-x-auto scrollbar-none text-xs sm:text-sm font-semibold">
          {[
            { id: 'home', label: 'Explore & Practice', icon: BookOpen },
            { id: 'subjects', label: 'Curriculum Subjects', icon: Zap },
            { id: 'exam', label: 'National Exam Prep', icon: Award, highlight: true },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
            { id: 'profile', label: 'My Progress', icon: Flame },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectNav(item.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : item.highlight
                    ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-amber-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-amber-500 text-white font-extrabold ml-0.5">
                    WAEC/JAMB
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
