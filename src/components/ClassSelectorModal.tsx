import React, { useState } from 'react';
import { useQuizContext } from '../context/QuizContext';
import type { AcademicClass, Stream } from '../types/quiz';
import { GraduationCap, Sparkles, User, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ClassSelectorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { profile, updateClassAndStream, registerAccount } = useQuizContext();
  const [selectedClass, setSelectedClass] = useState<AcademicClass>(profile.classLevel);
  const [selectedStream, setSelectedStream] = useState<Stream>(profile.stream);
  const [studentName, setStudentName] = useState(profile.name);
  const [schoolName, setSchoolName] = useState(profile.schoolName || '');

  if (!isOpen) return null;

  const isSenior = selectedClass.startsWith('SS');

  const handleSave = () => {
    updateClassAndStream(selectedClass, isSenior ? selectedStream : 'General');
    if (studentName !== profile.name || schoolName !== profile.schoolName) {
      registerAccount(studentName, schoolName);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/20 hover:bg-white/30 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Academic Profile Setup</h2>
              <p className="text-emerald-100 text-xs">Tailor curriculum subjects & quizzes to your level</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Student Info */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Student Name or Nickname
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your name"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
              />
            </div>
          </div>

          {/* School Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              School Name (Optional)
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="e.g. King's College Lagos"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
            />
          </div>

          {/* Junior Secondary Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Junior Secondary (JSS 1 – JSS 3)
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['JSS 1', 'JSS 2', 'JSS 3'] as AcademicClass[]).map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setSelectedClass(cls)}
                  className={`py-3 px-3 rounded-2xl font-bold text-sm border-2 transition-all flex flex-col items-center gap-1 ${
                    selectedClass === cls
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm shadow-emerald-600/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <span>{cls}</span>
                  {cls === 'JSS 3' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                      BECE
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Senior Secondary Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Senior Secondary (SS 1 – SS 3)
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['SS 1', 'SS 2', 'SS 3'] as AcademicClass[]).map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setSelectedClass(cls)}
                  className={`py-3 px-3 rounded-2xl font-bold text-sm border-2 transition-all flex flex-col items-center gap-1 ${
                    selectedClass === cls
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm shadow-emerald-600/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <span>{cls}</span>
                  {cls === 'SS 3' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      WAEC / JAMB
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Stream Selection (if Senior Secondary) */}
          {isSenior && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 animate-in fade-in duration-150">
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Select Senior Secondary Department
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Science', 'Arts', 'Commercial'] as Stream[]).map((stream) => (
                  <button
                    key={stream}
                    type="button"
                    onClick={() => setSelectedStream(stream)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border-2 transition-all text-center ${
                      selectedStream === stream
                        ? 'border-amber-600 bg-white text-amber-900 shadow-sm'
                        : 'border-amber-200 bg-amber-100/50 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    {stream}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 transition transform active:scale-95"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};
