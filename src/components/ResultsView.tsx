import React, { useEffect } from 'react';
import type { QuizSessionResult } from '../types/quiz';
import { Award, CheckCircle2, XCircle, Clock, RotateCcw, Home, Sparkles, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  result: QuizSessionResult;
  onRetake: () => void;
  onGoHome: () => void;
}

export const ResultsView: React.FC<Props> = ({ result, onRetake, onGoHome }) => {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  useEffect(() => {
    if (result.percentage >= 70) {
      // Celebratory multi-burst confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 300);
    }
  }, [result.percentage]);

  const correctCount = result.userAnswers.filter((a) => a.isCorrect).length;
  const incorrectCount = result.userAnswers.filter(
    (a) => !a.isCorrect && a.selectedOption !== null
  ).length;
  const unansweredCount = result.userAnswers.filter((a) => a.selectedOption === null).length;

  const minutes = Math.floor(result.totalTimeSeconds / 60);
  const seconds = result.totalTimeSeconds % 60;

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-in fade-in zoom-in-95 duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 text-center mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500" />

        <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 shadow-sm">
          <Award className="w-9 h-9" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">Assessment Report</h2>
        <p className="text-slate-500 text-sm font-medium mb-4">
          {result.topicTitle} • {result.classLevel} {result.stream ? `(${result.stream})` : ''}
        </p>

        {/* Big Score Dial */}
        <div className="inline-flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50 border border-slate-200 mb-6">
          <div className="text-4xl sm:text-5xl font-black text-emerald-600">
            {result.score} / {result.questions.length}
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
            {result.percentage}% Mastery Score
          </span>
          <div className="mt-2 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
            {result.percentage >= 80
              ? '🌟 Excellent Mastery!'
              : result.percentage >= 60
              ? '👍 Good Effort - Keep Practicing!'
              : '📚 Review & Practice Required'}
          </div>
        </div>

        {/* 4 Performance Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Correct</span>
            </div>
            <span className="text-xl font-black text-emerald-900">{correctCount}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-100">
            <div className="flex items-center gap-1.5 text-red-600 text-xs font-bold mb-1">
              <XCircle className="w-4 h-4" />
              <span>Wrong</span>
            </div>
            <span className="text-xl font-black text-red-900">{incorrectCount}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100">
            <div className="flex items-center gap-1.5 text-amber-600 text-xs font-bold mb-1">
              <Clock className="w-4 h-4" />
              <span>Timed Out</span>
            </div>
            <span className="text-xl font-black text-amber-900">{unansweredCount}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100">
            <div className="flex items-center gap-1.5 text-blue-600 text-xs font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Time Taken</span>
            </div>
            <span className="text-xl font-black text-blue-900">
              {minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`}
            </span>
          </div>
        </div>

        {/* Weak Topic Recommendations */}
        {result.recommendedTopics.length > 0 && result.percentage < 85 && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-left">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Recommended Topics for Improvement:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.recommendedTopics.map((topic, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-bold"
                >
                  📖 {topic.replace(/-/g, ' ').toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onRetake}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Quiz</span>
          </button>
          <button
            onClick={onGoHome}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
          >
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Complete Step-by-Step Question Review Accordion */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
          <span>Question Review & Explanations ({result.questions.length})</span>
          <span className="text-xs text-slate-400 font-normal">Tap any question to reveal answers</span>
        </h3>

        <div className="space-y-3">
          {result.questions.map((q, idx) => {
            const userAns = result.userAnswers.find((a) => a.questionId === q.id);
            const isCorrect = userAns?.isCorrect;
            const isTimeout = userAns?.selectedOption === null;
            const isExpanded = expandedIndex === idx;

            return (
              <div
                key={q.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isCorrect
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : isTimeout
                    ? 'border-amber-200 bg-amber-50/20'
                    : 'border-red-200 bg-red-50/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleExpand(idx)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-600 text-white'
                          : isTimeout
                          ? 'bg-amber-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-sm font-semibold text-slate-800 line-clamp-1">
                      {q.questionText}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <span className="text-xs font-bold text-emerald-600 hidden sm:inline">Correct</span>
                    ) : isTimeout ? (
                      <span className="text-xs font-bold text-amber-600 hidden sm:inline">Timed Out</span>
                    ) : (
                      <span className="text-xs font-bold text-red-600 hidden sm:inline">Incorrect</span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 pt-1 bg-white border-t border-slate-100 text-xs sm:text-sm space-y-3">
                    <p className="font-bold text-slate-900">{q.questionText}</p>

                    <div className="space-y-1.5">
                      {q.options.map((opt, optIdx) => {
                        const letter = ['A', 'B', 'C', 'D'][optIdx];
                        const isThisCorrect = optIdx === q.correctOptionIndex;
                        const isThisSelected = userAns?.selectedOption === optIdx;

                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-xl border flex items-center justify-between ${
                              isThisCorrect
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold'
                                : isThisSelected
                                ? 'border-red-500 bg-red-50 text-red-950 font-semibold'
                                : 'border-slate-100 text-slate-600'
                            }`}
                          >
                            <span>
                              <span className="font-bold mr-2">{letter}.</span> {opt}
                            </span>
                            {isThisCorrect && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                Correct Answer
                              </span>
                            )}
                            {isThisSelected && !isThisCorrect && (
                              <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                                Your Choice
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                      <span className="font-bold text-slate-900 block mb-0.5">Explanation:</span>
                      {q.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
