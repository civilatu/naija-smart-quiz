import React, { useState, useEffect } from 'react';
import type { Question, QuizSessionResult, UserAnswer } from '../types/quiz';
import { Timer, CheckCircle2, XCircle, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  title: string;
  subtitle?: string;
  questions: Question[];
  subjectId: string;
  topicTitle: string;
  classLevel: any;
  stream?: any;
  examType?: any;
  onFinishQuiz: (result: QuizSessionResult) => void;
  onExit: () => void;
}

export const QuizEngine: React.FC<Props> = ({
  title,
  questions,
  subjectId,
  topicTitle,
  classLevel,
  stream,
  examType,
  onFinishQuiz,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20); // 20-second uniform countdown
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [sessionStartTime] = useState<number>(() => Date.now());

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswer = (optionIdx: number | null, timeSpent: number = 20 - timeLeft) => {
    if (isAnswered) return;

    const isCorrect = optionIdx !== null && optionIdx === currentQuestion.correctOptionIndex;
    setSelectedOption(optionIdx);
    setIsAnswered(true);

    // Mini confetti on correct answer
    if (isCorrect) {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.7 },
      });
    }

    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOption: optionIdx,
      isCorrect,
      timeSpentSeconds: Math.min(20, Math.max(1, timeSpent)),
    };

    setAnswers((prev) => [...prev, newAnswer]);
  };

  // 20-second timer countdown
  useEffect(() => {
    if (isAnswered) return; // Stop timer if student chose an answer

    if (timeLeft <= 0) {
      // Time expired! Record timeout
      handleAnswer(null, 20);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered]);

  const handleNext = () => {
    if (!isAnswered) return;

    if (isLastQuestion) {
      // Finalize session
      const totalScore = answers.filter((a) => a.isCorrect).length;
      const totalQuestionsCount = questions.length;
      const percentage = Math.round((totalScore / totalQuestionsCount) * 100);
      const totalTimeSeconds = Math.round((Date.now() - sessionStartTime) / 1000);

      // Diagnostic: Find weak areas based on wrong answers
      const wrongQuestions = questions.filter((q) => {
        const ans = answers.find((a) => a.questionId === q.id);
        return !ans || !ans.isCorrect;
      });
      const recommendedTopics = Array.from(new Set(wrongQuestions.map((q) => q.topicId || 'General Revision'))).slice(0, 3);

      const result: QuizSessionResult = {
        id: 'session_' + Date.now(),
        subjectId,
        topicTitle,
        classLevel,
        stream,
        examType,
        questions,
        userAnswers: answers,
        score: totalScore,
        percentage,
        totalTimeSeconds,
        completedAt: new Date().toISOString(),
        recommendedTopics,
      };

      onFinishQuiz(result);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(20);
    }
  };

  // Timer color changes
  const timerColor =
    timeLeft > 10
      ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
      : timeLeft > 5
      ? 'text-amber-600 bg-amber-50 border-amber-200'
      : 'text-red-600 bg-red-50 border-red-200 animate-pulse';

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Top Bar with Exit, Progress & 20s Countdown Timer */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onExit}
          className="text-xs font-bold text-slate-500 hover:text-red-600 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-red-50 transition"
        >
          Exit Quiz
        </button>

        <div className="text-center">
          <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            {title}
          </span>
        </div>

        {/* 20-Second Uniform Countdown Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border font-black text-sm shadow-sm ${timerColor}`}>
          <Timer className="w-4 h-4" />
          <span>{timeLeft}s</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span>{Math.round(progressPercentage)}% complete</span>
        </div>
        <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 mb-6">
        {currentQuestion.examTag && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[11px] font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Past Exam: {currentQuestion.examTag}</span>
          </div>
        )}

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-6">
          {currentQuestion.questionText}
        </h3>

        {/* 4 Options Grid */}
        <div className="space-y-3">
          {currentQuestion.options.map((optionText, idx) => {
            const letter = ['A', 'B', 'C', 'D'][idx];
            let cardStyle =
              'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-800';

            if (isAnswered) {
              if (idx === currentQuestion.correctOptionIndex) {
                // Correct answer
                cardStyle =
                  'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/30';
              } else if (idx === selectedOption) {
                // Chosen wrong answer
                cardStyle = 'border-red-500 bg-red-50 text-red-950 ring-2 ring-red-500/30';
              } else {
                cardStyle = 'border-slate-200 bg-slate-50 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswered}
                onClick={() => handleAnswer(idx)}
                className={`w-full p-4 rounded-2xl border-2 text-left font-medium transition-all flex items-center justify-between text-sm sm:text-base group active:scale-[0.99] ${cardStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 transition ${
                      isAnswered && idx === currentQuestion.correctOptionIndex
                        ? 'bg-emerald-600 text-white'
                        : isAnswered && idx === selectedOption
                        ? 'bg-red-600 text-white'
                        : 'bg-white border border-slate-300 text-slate-700 group-hover:bg-slate-200'
                    }`}
                  >
                    {letter}
                  </span>
                  <span>{optionText}</span>
                </div>

                {isAnswered && idx === currentQuestion.correctOptionIndex && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswered && idx === selectedOption && idx !== currentQuestion.correctOptionIndex && (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Feedback Card */}
        {isAnswered && (
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <div
                className={`p-1.5 rounded-xl shrink-0 ${
                  selectedOption === currentQuestion.correctOptionIndex
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900 block mb-0.5">
                  {selectedOption === currentQuestion.correctOptionIndex
                    ? '🎉 Correct! Well done.'
                    : selectedOption === null
                    ? '⏱️ Time expired! Here is the concept explanation:'
                    : '💡 Not quite. Curriculum Explanation:'}
                </span>
                {currentQuestion.explanation}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action: Next Question */}
      {isAnswered && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition transform active:scale-95"
          >
            <span>{isLastQuestion ? 'View Results & Diagnostics' : 'Next Question'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
