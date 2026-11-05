import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AcademicClass, QuizSessionResult, Stream, UserProfile } from '../types/quiz';

interface QuizContextType {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  updateClassAndStream: (classLevel: AcademicClass, stream?: Stream) => void;
  saveQuizResult: (result: QuizSessionResult) => void;
  registerAccount: (name: string, schoolName?: string) => void;
  toggleLeaderboardPrivacy: () => void;
  resetProgress: () => void;
}

const STORAGE_KEY = 'naija_smart_quiz_profile_v2';

const DEFAULT_PROFILE: UserProfile = {
  id: 'guest_' + Math.random().toString(36).substring(2, 9),
  isGuest: true,
  name: 'Future Scholar',
  classLevel: 'SS 2',
  stream: 'Science',
  schoolName: 'Federal Government College, Lagos',
  state: 'Lagos',
  xpPoints: 120,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  unlockedBadges: ['first_quiz'],
  quizHistory: [],
  privacyShowOnLeaderboard: true,
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load profile from localStorage:', e);
    }
    return DEFAULT_PROFILE;
  });

  // Keep localStorage updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save profile to localStorage:', e);
    }
  }, [profile]);

  // Update streak if active today vs yesterday
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastActiveDate !== today) {
      const lastDate = new Date(profile.lastActiveDate);
      const currDate = new Date(today);
      const diffDays = Math.floor((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

      let newStreak = profile.streakDays;
      if (diffDays === 1) {
        newStreak += 1; // streak maintained
      } else if (diffDays > 1) {
        newStreak = 1; // streak broken
      }

      const unlockedBadges = [...profile.unlockedBadges];
      if (newStreak >= 3 && !unlockedBadges.includes('streak_3')) {
        unlockedBadges.push('streak_3');
      }

      setProfile((prev) => ({
        ...prev,
        streakDays: newStreak,
        lastActiveDate: today,
        unlockedBadges,
      }));
    }
  }, [profile.lastActiveDate, profile.streakDays, profile.unlockedBadges]);

  const updateClassAndStream = (classLevel: AcademicClass, stream?: Stream) => {
    setProfile((prev) => {
      const isJSS = classLevel.startsWith('JSS');
      return {
        ...prev,
        classLevel,
        stream: isJSS ? 'General' : (stream || prev.stream || 'Science'),
      };
    });
  };

  const registerAccount = (name: string, schoolName?: string) => {
    setProfile((prev) => ({
      ...prev,
      isGuest: false,
      name: name.trim() || prev.name,
      schoolName: schoolName?.trim() || prev.schoolName,
      xpPoints: prev.xpPoints + 50, // Welcome bonus
    }));
  };

  const toggleLeaderboardPrivacy = () => {
    setProfile((prev) => ({
      ...prev,
      privacyShowOnLeaderboard: !prev.privacyShowOnLeaderboard,
    }));
  };

  const resetProgress = () => {
    setProfile(DEFAULT_PROFILE);
    localStorage.removeItem(STORAGE_KEY);
  };

  const saveQuizResult = (result: QuizSessionResult) => {
    setProfile((prev) => {
      // Calculate XP gained
      let earnedXP = result.score * 10;
      if (result.percentage >= 70) earnedXP += 50; // High score bonus
      if (result.percentage === 100) earnedXP += 100; // Perfect score bonus

      const updatedBadges = [...prev.unlockedBadges];

      // Check badges
      if (!updatedBadges.includes('first_quiz')) {
        updatedBadges.push('first_quiz');
      }
      if (result.percentage >= 80) {
        if (result.subjectId.includes('math') && !updatedBadges.includes('maths_star')) {
          updatedBadges.push('maths_star');
        }
        if (
          (result.subjectId.includes('science') ||
            result.subjectId.includes('biology') ||
            result.subjectId.includes('chemistry') ||
            result.subjectId.includes('physics')) &&
          !updatedBadges.includes('science_champ')
        ) {
          updatedBadges.push('science_champ');
        }
        if (
          (result.subjectId.includes('english') || result.subjectId.includes('literature')) &&
          !updatedBadges.includes('english_scholar')
        ) {
          updatedBadges.push('english_scholar');
        }
      }
      if (result.examType && !updatedBadges.includes('exam_ready')) {
        updatedBadges.push('exam_ready');
      }

      return {
        ...prev,
        xpPoints: prev.xpPoints + earnedXP,
        unlockedBadges: updatedBadges,
        quizHistory: [result, ...prev.quizHistory].slice(0, 50), // keep last 50
      };
    });
  };

  return (
    <QuizContext.Provider
      value={{
        profile,
        setProfile,
        updateClassAndStream,
        saveQuizResult,
        registerAccount,
        toggleLeaderboardPrivacy,
        resetProgress,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return context;
};
