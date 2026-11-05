import React, { useState } from 'react';
import { useQuizContext } from '../context/QuizContext';
import { ALL_SUBJECTS } from '../data/subjects';
import type { ExamType, Subject } from '../types/quiz';
import { Award, Clock, ChevronRight } from 'lucide-react';

interface Props {
  onStartExamQuiz: (subject: Subject, examType: ExamType) => void;
}

export const ExamPrepView: React.FC<Props> = ({ onStartExamQuiz }) => {
  const { profile } = useQuizContext();
  const isSenior = profile.classLevel.startsWith('SS');

  const [selectedExam, setSelectedExam] = useState<ExamType>(isSenior ? 'WAEC' : 'BECE');

  const examOptions: { type: ExamType; name: string; target: string; desc: string }[] = isSenior
    ? [
        {
          type: 'WAEC',
          name: 'WASSCE (WAEC)',
          target: 'SS 3 Candidates',
          desc: 'West African Senior School Certificate Examination practice papers and questions.',
        },
        {
          type: 'JAMB',
          name: 'UTME (JAMB)',
          target: 'University Aspirants',
          desc: 'Joint Admissions and Matriculation Board computer-based test simulation.',
        },
        {
          type: 'NECO',
          name: 'SSCE (NECO)',
          target: 'Senior Secondary',
          desc: 'National Examinations Council senior school certificate past question sets.',
        },
      ]
    : [
        {
          type: 'BECE',
          name: 'BECE (Junior WAEC)',
          target: 'JSS 3 Candidates',
          desc: 'Basic Education Certificate Examination standard past question drills.',
        },
      ];

  // Get subjects corresponding to current class & stream
  const availableSubjects = ALL_SUBJECTS.filter((sub) => {
    if (!isSenior) return sub.division === 'JSS';
    return sub.division === 'SSS' && (sub.stream === 'General' || sub.stream === profile.stream);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-100 text-xs font-bold mb-3">
            <Award className="w-4 h-4" />
            <span>National Examination Readiness</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black mb-2">
            BECE, WAEC, NECO & JAMB Past Questions
          </h1>
          <p className="text-amber-100 text-sm sm:text-base leading-relaxed font-medium">
            Test yourself with real past exam question sets under a 20-second timer per question.
            Discover your readiness and master difficult topics before exam day!
          </p>
        </div>
      </div>

      {/* Exam Selector Tabs */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
          Select Target Examination
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {examOptions.map((exam) => (
            <button
              key={exam.type}
              type="button"
              onClick={() => setSelectedExam(exam.type)}
              className={`p-5 rounded-2xl border-2 text-left transition-all ${
                selectedExam === exam.type
                  ? 'border-amber-500 bg-amber-50/70 text-amber-950 shadow-md ring-2 ring-amber-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-black">{exam.name}</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {exam.target}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-snug">{exam.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Available Exam Subject Papers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-slate-900">
            {selectedExam} Subject Papers for {profile.classLevel}{' '}
            {isSenior ? `(${profile.stream})` : ''}
          </h2>
          <span className="text-xs text-slate-500 font-semibold">20 Questions • 20s / question</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableSubjects.map((sub) => {
            return (
              <div
                key={sub.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      {selectedExam} Standard Drills
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Full Explanation</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{sub.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{sub.description}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 20s timer
                  </span>

                  <button
                    onClick={() => onStartExamQuiz(sub, selectedExam)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition transform active:scale-95"
                  >
                    <span>Take Exam Quiz</span>
                    <ChevronRight className="w-3.5 h-3.5" />
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
