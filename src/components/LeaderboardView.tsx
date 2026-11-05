import React, { useState } from 'react';
import { useQuizContext } from '../context/QuizContext';
import type { LeaderboardEntry } from '../types/quiz';
import { Trophy, Flame, Zap, Eye, EyeOff } from 'lucide-react';

const MOCK_LEADERBOARD_JUNIOR: LeaderboardEntry[] = [
  {
    id: 'l-j-1',
    name: 'Chidubem Okafor',
    classLevel: 'JSS 3',
    stream: 'General',
    schoolName: 'Loyola Jesuit College, Abuja',
    xpPoints: 2450,
    streakDays: 14,
    rank: 1,
  },
  {
    id: 'l-j-2',
    name: 'Amina Bello',
    classLevel: 'JSS 3',
    stream: 'General',
    schoolName: 'Queens College, Yaba',
    xpPoints: 2180,
    streakDays: 9,
    rank: 2,
  },
  {
    id: 'l-j-3',
    name: 'Femi Adeyemi',
    classLevel: 'JSS 2',
    stream: 'General',
    schoolName: 'Corona Secondary School, Agbara',
    xpPoints: 1940,
    streakDays: 11,
    rank: 3,
  },
  {
    id: 'l-j-4',
    name: 'Fatima Sanusi',
    classLevel: 'JSS 1',
    stream: 'General',
    schoolName: 'Federal Government Girls College, Zaria',
    xpPoints: 1720,
    streakDays: 7,
    rank: 4,
  },
  {
    id: 'l-j-5',
    name: 'Tunde Bakare',
    classLevel: 'JSS 2',
    stream: 'General',
    schoolName: 'St. Gregory\'s College, Ikoyi',
    xpPoints: 1530,
    streakDays: 5,
    rank: 5,
  },
];

const MOCK_LEADERBOARD_SENIOR_SCIENCE: LeaderboardEntry[] = [
  {
    id: 'l-s-1',
    name: 'Emeka Nwosu',
    classLevel: 'SS 3',
    stream: 'Science',
    schoolName: 'King\'s College, Lagos',
    xpPoints: 3680,
    streakDays: 21,
    rank: 1,
  },
  {
    id: 'l-s-2',
    name: 'Zainab Danjuma',
    classLevel: 'SS 3',
    stream: 'Science',
    schoolName: 'Turkish International School, Kaduna',
    xpPoints: 3410,
    streakDays: 18,
    rank: 2,
  },
  {
    id: 'l-s-3',
    name: 'Oluwaseun Ajayi',
    classLevel: 'SS 2',
    stream: 'Science',
    schoolName: 'Christ The King College, Onitsha',
    xpPoints: 3120,
    streakDays: 15,
    rank: 3,
  },
  {
    id: 'l-s-4',
    name: 'Chisom Eze',
    classLevel: 'SS 2',
    stream: 'Science',
    schoolName: 'Federal Science & Tech College, Yaba',
    xpPoints: 2790,
    streakDays: 8,
    rank: 4,
  },
];

const MOCK_LEADERBOARD_SENIOR_ARTS: LeaderboardEntry[] = [
  {
    id: 'l-a-1',
    name: 'Aisha Garba',
    classLevel: 'SS 3',
    stream: 'Arts',
    schoolName: 'Capital Science Academy, Kuje',
    xpPoints: 3250,
    streakDays: 16,
    rank: 1,
  },
  {
    id: 'l-a-2',
    name: 'Gbenga Johnson',
    classLevel: 'SS 2',
    stream: 'Arts',
    schoolName: 'Baptist High School, Jos',
    xpPoints: 2890,
    streakDays: 12,
    rank: 2,
  },
];

const MOCK_LEADERBOARD_SENIOR_COMMERCIAL: LeaderboardEntry[] = [
  {
    id: 'l-c-1',
    name: 'Kelechi Umeh',
    classLevel: 'SS 3',
    stream: 'Commercial',
    schoolName: 'Graceland International School, Port Harcourt',
    xpPoints: 3190,
    streakDays: 19,
    rank: 1,
  },
  {
    id: 'l-c-2',
    name: 'Maryam Aliyu',
    classLevel: 'SS 2',
    stream: 'Commercial',
    schoolName: 'Nana Aisha Memorial College, Ilorin',
    xpPoints: 2980,
    streakDays: 14,
    rank: 2,
  },
];

export const LeaderboardView: React.FC = () => {
  const { profile, toggleLeaderboardPrivacy } = useQuizContext();
  const [activeTab, setActiveTab] = useState<'junior' | 'senior' | 'overall'>('overall');
  const [streamFilter, setStreamFilter] = useState<'Science' | 'Arts' | 'Commercial'>('Science');

  let entries: LeaderboardEntry[] = [];
  if (activeTab === 'junior') {
    entries = MOCK_LEADERBOARD_JUNIOR;
  } else if (activeTab === 'senior') {
    entries =
      streamFilter === 'Science'
        ? MOCK_LEADERBOARD_SENIOR_SCIENCE
        : streamFilter === 'Arts'
        ? MOCK_LEADERBOARD_SENIOR_ARTS
        : MOCK_LEADERBOARD_SENIOR_COMMERCIAL;
  } else {
    // Overall Top Podium: Merge & sort
    entries = [
      ...MOCK_LEADERBOARD_SENIOR_SCIENCE,
      ...MOCK_LEADERBOARD_JUNIOR,
      ...MOCK_LEADERBOARD_SENIOR_ARTS,
      ...MOCK_LEADERBOARD_SENIOR_COMMERCIAL,
    ]
      .sort((a, b) => b.xpPoints - a.xpPoints)
      .slice(0, 10)
      .map((e, idx) => ({ ...e, rank: idx + 1 }));
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-emerald-200 text-xs font-bold mb-2">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Fair Academic Competition</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-1">All-Naija Leaderboard</h1>
          <p className="text-emerald-100 text-xs sm:text-sm font-medium">
            Junior & Senior divisions ranked separately for true fairness
          </p>
        </div>

        {/* Privacy toggle */}
        <button
          onClick={toggleLeaderboardPrivacy}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition whitespace-nowrap"
        >
          {profile.privacyShowOnLeaderboard ? (
            <>
              <Eye className="w-4 h-4 text-emerald-300" />
              <span>Visible on Board</span>
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4 text-amber-300" />
              <span>Hidden (Private)</span>
            </>
          )}
        </button>
      </div>

      {/* Division Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center p-1 rounded-2xl bg-slate-200/80 text-xs font-bold text-slate-700">
          <button
            onClick={() => setActiveTab('overall')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'overall' ? 'bg-white text-slate-950 shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            🏆 All-Naija Top 10
          </button>
          <button
            onClick={() => setActiveTab('junior')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'junior' ? 'bg-white text-slate-950 shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            Junior Division (JSS 1–3)
          </button>
          <button
            onClick={() => setActiveTab('senior')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'senior' ? 'bg-white text-slate-950 shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            Senior Division (SS 1–3)
          </button>
        </div>

        {/* SSS Stream Sub-Filter */}
        {activeTab === 'senior' && (
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-amber-100/80 text-xs font-bold text-amber-900">
            {(['Science', 'Arts', 'Commercial'] as const).map((stream) => (
              <button
                key={stream}
                onClick={() => setStreamFilter(stream)}
                className={`px-3 py-1.5 rounded-xl transition ${
                  streamFilter === stream ? 'bg-white text-amber-950 shadow-sm' : 'hover:text-amber-950'
                }`}
              >
                {stream}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Top 3 Podium Cards (if overall) */}
      {activeTab === 'overall' && entries.length >= 3 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4">
          {/* Silver #2 */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-md text-center flex flex-col justify-end items-center relative order-1">
            <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-black text-sm flex items-center justify-center mb-2">
              2
            </span>
            <div className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
              {entries[1].name}
            </div>
            <div className="text-[11px] text-slate-500 font-semibold">{entries[1].classLevel}</div>
            <div className="mt-2 text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {entries[1].xpPoints} XP
            </div>
          </div>

          {/* Gold #1 */}
          <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl p-4 sm:p-6 border-2 border-amber-400 shadow-xl text-center flex flex-col justify-end items-center relative order-2 transform -translate-y-2">
            <div className="p-2 rounded-2xl bg-amber-400 text-slate-950 shadow-md mb-2">
              <Trophy className="w-6 h-6 fill-slate-950" />
            </div>
            <div className="font-black text-slate-950 text-sm sm:text-base line-clamp-1">
              {entries[0].name}
            </div>
            <div className="text-xs text-amber-900 font-bold">{entries[0].classLevel} • {entries[0].schoolName}</div>
            <div className="mt-2 text-sm font-black text-amber-900 bg-amber-200 px-3 py-1 rounded-full shadow-sm">
              {entries[0].xpPoints} XP
            </div>
          </div>

          {/* Bronze #3 */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-md text-center flex flex-col justify-end items-center relative order-3">
            <span className="w-8 h-8 rounded-full bg-amber-700/20 text-amber-900 font-black text-sm flex items-center justify-center mb-2">
              3
            </span>
            <div className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
              {entries[2].name}
            </div>
            <div className="text-[11px] text-slate-500 font-semibold">{entries[2].classLevel}</div>
            <div className="mt-2 text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {entries[2].xpPoints} XP
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table / Cards */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {entries.map((student) => {
            return (
              <div
                key={student.id}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/80 transition"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <span
                    className={`w-8 h-8 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 ${
                      student.rank === 1
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                        : student.rank === 2
                        ? 'bg-slate-200 text-slate-800'
                        : student.rank === 3
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-slate-100 text-slate-600 font-bold'
                    }`}
                  >
                    #{student.rank}
                  </span>

                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                      <span>{student.name}</span>
                      <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {student.classLevel}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{student.schoolName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-6">
                  <div className="flex items-center gap-1 text-xs font-bold text-orange-600">
                    <Flame className="w-4 h-4 fill-orange-500" />
                    <span>{student.streakDays}d</span>
                  </div>

                  <div className="flex items-center gap-1 text-sm font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <Zap className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                    <span>{student.xpPoints} XP</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
