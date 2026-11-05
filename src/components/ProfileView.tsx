import React, { useState } from 'react';
import { useQuizContext } from '../context/QuizContext';
import { SYSTEM_BADGES } from '../data/subjects';
import {
  Flame,
  Zap,
  Award,
  BookOpen,
  Rocket,
  Calculator,
  Atom,
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Rocket,
  Calculator,
  Atom,
  BookOpen,
  Flame,
  Zap,
  Award,
};

interface Props {
  onOpenClassModal: () => void;
}

export const ProfileView: React.FC<Props> = ({ onOpenClassModal }) => {
  const { profile, registerAccount, resetProgress } = useQuizContext();
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [schoolInput, setSchoolInput] = useState(profile.schoolName || '');

  const isSenior = profile.classLevel.startsWith('SS');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    registerAccount(nameInput, schoolInput);
    setIsEditing(false);
  };

  const totalQuizzes = profile.quizHistory.length;
  const averageScore =
    totalQuizzes > 0
      ? Math.round(
          profile.quizHistory.reduce((acc, curr) => acc + curr.percentage, 0) / totalQuizzes
        )
      : 0;

  const highestScore =
    totalQuizzes > 0
      ? Math.max(...profile.quizHistory.map((h) => h.percentage))
      : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Student Identity Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center font-black text-3xl shadow-lg shadow-emerald-600/30">
            {profile.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-2xl font-black text-slate-900">{profile.name}</h2>
              {profile.isGuest && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  Guest Student
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-500 font-semibold mb-2">
              {profile.schoolName || 'Nigerian Secondary School Student'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                {profile.classLevel}
              </span>
              {isSenior && (
                <span className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                  {profile.stream} Stream
                </span>
              )}
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-100 text-slate-700">
                📍 {profile.state || 'Nigeria'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
          <button
            onClick={onOpenClassModal}
            className="w-full px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition text-center"
          >
            Change Class / Department
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="w-full px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition text-center"
          >
            {isEditing ? 'Close Profile Editor' : 'Edit Name & School'}
          </button>
        </div>
      </div>

      {/* Edit Profile Form Drawer */}
      {isEditing && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4 animate-in fade-in duration-150"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">
            Edit Student Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Your Full Name or Display Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium bg-white"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                School Name
              </label>
              <input
                type="text"
                value={schoolInput}
                onChange={(e) => setSchoolInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium bg-white"
                placeholder="e.g. Federal Govt College"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700 transition"
          >
            Save Changes
          </button>
        </form>
      )}

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-1.5 text-orange-600 text-xs font-bold mb-1">
            <Flame className="w-4 h-4 fill-orange-500" />
            <span>Learning Streak</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{profile.streakDays} Days</div>
          <span className="text-[11px] text-slate-400 font-medium">Daily practice active</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-1.5 text-amber-600 text-xs font-bold mb-1">
            <Zap className="w-4 h-4 fill-amber-500" />
            <span>Knowledge XP</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{profile.xpPoints}</div>
          <span className="text-[11px] text-slate-400 font-medium">Accumulated points</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-1.5 text-blue-600 text-xs font-bold mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Quizzes Taken</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalQuizzes}</div>
          <span className="text-[11px] text-slate-400 font-medium">Assessment sessions</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold mb-1">
            <Award className="w-4 h-4" />
            <span>Average Score</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{averageScore}%</div>
          <span className="text-[11px] text-slate-400 font-medium">Best: {highestScore}%</span>
        </div>
      </div>

      {/* Achievement Badges Showcase */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Earned Achievement Badges</h3>
        <p className="text-xs text-slate-500 font-medium mb-6">
          Milestones unlocked through curriculum mastery & consistent practice
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {SYSTEM_BADGES.map((badge) => {
            const isUnlocked = profile.unlockedBadges.includes(badge.id);
            const Icon = ICON_MAP[badge.iconName] || Award;

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                  isUnlocked
                    ? 'border-emerald-200 bg-emerald-50/40 shadow-sm'
                    : 'border-slate-200 bg-slate-50/50 opacity-50 grayscale'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${
                    isUnlocked ? badge.color : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="mb-2">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">{badge.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-tight mt-1 line-clamp-2">
                    {badge.description}
                  </p>
                </div>

                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    isUnlocked
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isUnlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Quiz History */}
      {profile.quizHistory.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Quiz Performance</h3>
          <div className="space-y-3">
            {profile.quizHistory.slice(0, 5).map((history) => (
              <div
                key={history.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{history.topicTitle}</h4>
                  <p className="text-xs text-slate-500">
                    {history.classLevel} {history.stream ? `(${history.stream})` : ''} •{' '}
                    {new Date(history.completedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-black text-sm px-3 py-1 rounded-xl ${
                      history.percentage >= 70
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {history.score} / {history.questions.length} ({history.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset progress */}
      <div className="pt-4 text-center">
        <button
          onClick={resetProgress}
          className="text-xs font-semibold text-slate-400 hover:text-red-600 transition"
        >
          Reset Session & Local Data
        </button>
      </div>
    </div>
  );
};
