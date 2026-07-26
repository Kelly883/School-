import React, { useState, useEffect } from 'react';
import {
  Laptop,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { CBTExam, CBTQuestion, CBTResult } from '../../types';

interface CBTModuleProps {
  cbtExams: CBTExam[];
  onFinishExam?: (result: CBTResult) => void;
}

export const CBTModule: React.FC<CBTModuleProps> = ({
  cbtExams,
  onFinishExam,
}) => {
  const [activeExam, setActiveExam] = useState<CBTExam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(1200); // 20 mins
  const [isExamCompleted, setIsExamCompleted] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<{ marks: number; total: number; percentage: number } | null>(null);

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (activeExam && !isExamCompleted && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleCompleteExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeExam, isExamCompleted, secondsRemaining]);

  const handleStartExam = (exam: CBTExam) => {
    setActiveExam(exam);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setSecondsRemaining(exam.durationMinutes * 60);
    setIsExamCompleted(false);
    setFinalScore(null);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleCompleteExam = () => {
    if (!activeExam) return;

    let totalMarksObtained = 0;
    activeExam.questions.forEach((q) => {
      const chosen = selectedAnswers[q.id];
      if (chosen === q.correctOptionIndex) {
        totalMarksObtained += q.marks;
      }
    });

    const percentage = Math.round((totalMarksObtained / activeExam.totalMarks) * 100);
    setFinalScore({
      marks: totalMarksObtained,
      total: activeExam.totalMarks,
      percentage,
    });
    setIsExamCompleted(true);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {!activeExam ? (
        // Exam List View
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-900 border border-rose-200 px-2.5 py-0.5 rounded-full">
                Computer-Based Test (CBT) Portal
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                Online Examination Engine
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Timed online tests, auto-grading, instant answer explanations & WAEC/NECO simulation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {cbtExams.map((exam) => (
              <div key={exam.id} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase bg-[#162825] text-white px-3 py-1 rounded-full">
                    {exam.className} • {exam.subjectName}
                  </span>
                  <span className="text-xs text-stone-500 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {exam.durationMinutes} Minutes
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">{exam.title}</h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Questions: <strong>{exam.questions.length} Multiple Choice</strong> • Total Marks: {exam.totalMarks} Marks
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5">Created By: {exam.createdTeacher}</p>
                </div>

                <button
                  onClick={() => handleStartExam(exam)}
                  className="w-full py-3 bg-[#162825] hover:bg-[#203a36] text-[#f5ded7] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Laptop className="w-4 h-4 text-[#f5ded7]" />
                  <span>Launch CBT Test Environment</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Active CBT Exam Interface
        <div className="bg-white rounded-3xl border-2 border-stone-800 shadow-xl p-6 space-y-6 max-w-3xl mx-auto">
          {!isExamCompleted ? (
            <>
              {/* CBT Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">{activeExam.title}</h3>
                  <p className="text-xs text-stone-500">
                    Question {currentQuestionIndex + 1} of {activeExam.questions.length}
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-rose-50 text-rose-800 border border-rose-200 px-3.5 py-1.5 rounded-full font-mono font-bold text-sm">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>{formatTimer(secondsRemaining)}</span>
                </div>
              </div>

              {/* Active Question */}
              {activeExam.questions[currentQuestionIndex] && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-semibold text-stone-900 leading-relaxed">
                    <span className="font-extrabold text-[#162825] mr-2">Q{currentQuestionIndex + 1}.</span>
                    {activeExam.questions[currentQuestionIndex].text}
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {activeExam.questions[currentQuestionIndex].options.map((opt, idx) => {
                      const qId = activeExam.questions[currentQuestionIndex].id;
                      const isSelected = selectedAnswers[qId] === idx;

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectOption(qId, idx)}
                          className={`w-full text-left p-3.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-3 ${
                            isSelected
                              ? 'bg-[#162825] text-white border-[#162825] shadow-md'
                              : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              isSelected ? 'bg-[#f5ded7] text-[#162825]' : 'bg-stone-200 text-stone-700'
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl disabled:opacity-40 cursor-pointer"
                >
                  Previous
                </button>

                {currentQuestionIndex < activeExam.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="px-5 py-2.5 bg-[#162825] text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    Next Question <ArrowRight className="w-3.5 h-3.5 text-[#f5ded7]" />
                  </button>
                ) : (
                  <button
                    onClick={handleCompleteExam}
                    className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl cursor-pointer shadow-lg"
                  >
                    Submit Exam Paper
                  </button>
                )}
              </div>
            </>
          ) : (
            // Result & Answer Explanation View
            <div className="space-y-6 text-center">
              <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-2">
                <Award className="w-12 h-12 text-emerald-700 mx-auto" />
                <h3 className="font-serif text-2xl font-bold text-stone-900">CBT Exam Completed!</h3>
                <p className="text-3xl font-extrabold text-emerald-800 mt-2">
                  {finalScore?.marks} / {finalScore?.total} Marks ({finalScore?.percentage}%)
                </p>
                <p className="text-xs text-emerald-700 font-medium">
                  {finalScore?.percentage && finalScore.percentage >= 75 ? 'Excellent Distinction Pass! 🎉' : 'Good Effort! Review answers below.'}
                </p>
              </div>

              {/* Answer Explanations Review */}
              <div className="space-y-4 text-left">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Answer Review & Explanations:</h4>
                {activeExam.questions.map((q, idx) => {
                  const chosen = selectedAnswers[q.id];
                  const isCorrect = chosen === q.correctOptionIndex;

                  return (
                    <div key={q.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-stone-900">
                          {idx + 1}. {q.text}
                        </p>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                        </span>
                      </div>

                      <p className="text-stone-600">
                        Selected: <strong className={isCorrect ? 'text-emerald-800' : 'text-rose-700'}>
                          {chosen !== undefined ? q.options[chosen] : 'None'}
                        </strong>
                      </p>
                      <p className="text-emerald-900 font-bold">
                        Correct Option: {q.options[q.correctOptionIndex]}
                      </p>
                      {q.explanation && (
                        <p className="text-[11px] text-stone-500 italic bg-white p-2 rounded-lg border border-stone-200">
                          Explanation: {q.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setActiveExam(null)}
                className="w-full py-3 bg-[#162825] text-[#f5ded7] font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <RotateCcw className="w-4 h-4" /> Return to CBT Exams List
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
