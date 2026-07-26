import React from 'react';
import {
  GraduationCap,
  Laptop,
  Calendar,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { User, StudentProfile, CBTExam, TimetableSlot, ReportCard } from '../../types';
import { formatNaira } from '../../utils/formatters';

interface StudentDashboardProps {
  currentUser: User;
  studentProfile: StudentProfile;
  cbtExams: CBTExam[];
  timetable: TimetableSlot[];
  reportCards: ReportCard[];
  onNavigate: (tab: string) => void;
  onTakeCBT: (exam: CBTExam) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  studentProfile,
  cbtExams,
  timetable,
  reportCards,
  onNavigate,
  onTakeCBT,
}) => {
  const activeExam = cbtExams[0];
  const studentReport = reportCards.find((r) => r.studentId === studentProfile.id) || reportCards[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Student Banner */}
      <div className="bg-[#162825] text-white rounded-3xl p-6 shadow-xl border border-[#23423d] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={studentProfile.personal.passportUrl}
            alt={studentProfile.personal.firstName}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#f5ded7]/30 shadow-md"
          />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#f5ded7] text-[#162825] px-2.5 py-0.5 rounded-full">
              {studentProfile.personal.className} ({studentProfile.personal.arm}) • Science Department
            </span>
            <h3 className="font-serif text-2xl font-bold mt-1.5">
              {studentProfile.personal.firstName} {studentProfile.personal.surname}
            </h3>
            <p className="text-xs text-[#a1beba] font-mono mt-0.5">
              Admission No: <strong className="text-white">{studentProfile.personal.admissionNo}</strong> • House: {studentProfile.personal.house}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#23423d] p-3 rounded-2xl border border-[#315750] text-center min-w-[100px]">
            <p className="text-[10px] text-[#8ea8a2] uppercase font-bold">Terminal GPA</p>
            <p className="text-xl font-extrabold text-[#f5ded7] mt-0.5">{studentProfile.currentGpa} / 5.0</p>
          </div>
          <div className="bg-[#23423d] p-3 rounded-2xl border border-[#315750] text-center min-w-[100px]">
            <p className="text-[10px] text-[#8ea8a2] uppercase font-bold">Class Rank</p>
            <p className="text-xl font-extrabold text-white mt-0.5">1st / 32</p>
          </div>
        </div>
      </div>

      {/* Active CBT Online Exam Highlight Banner */}
      {activeExam && (
        <div className="bg-[#fbeee9] border border-[#f5ded7] p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#162825] text-[#f5ded7] flex items-center justify-center shrink-0">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Active CBT Test Open
              </span>
              <h4 className="font-serif text-lg font-bold text-stone-900 mt-1">{activeExam.title}</h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Duration: <strong>{activeExam.durationMinutes} Minutes</strong> • {activeExam.questions.length} Questions ({activeExam.totalMarks} Marks)
              </p>
            </div>
          </div>

          <button
            onClick={() => onTakeCBT(activeExam)}
            className="w-full sm:w-auto px-5 py-3 bg-[#162825] hover:bg-[#203a36] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
          >
            <span>Start CBT Exam Now</span>
            <ArrowRight className="w-4 h-4 text-[#f5ded7]" />
          </button>
        </div>
      )}

      {/* Main Grid: Today's Timetable + Terminal Result Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Today's Timetable */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#162825]" />
              <h4 className="font-serif text-lg font-bold text-stone-900">Today's Period Schedule</h4>
            </div>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
              Monday Classes
            </span>
          </div>

          <div className="mt-4 space-y-2.5">
            {timetable.map((slot) => (
              <div key={slot.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-stone-400 font-mono">{slot.startTime} - {slot.endTime}</span>
                  <h5 className="text-xs font-bold text-stone-900 mt-0.5">{slot.subjectName}</h5>
                  <p className="text-[11px] text-stone-500">{slot.teacherName} • {slot.room}</p>
                </div>
                <span className="text-[10px] font-bold text-[#162825] bg-[#f5ded7] px-2.5 py-1 rounded-full">
                  Period Active
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Terminal Report Preview Card */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h4 className="font-serif text-lg font-bold text-stone-900">3rd Term Academic Result</h4>
              <button
                onClick={() => onNavigate('results')}
                className="text-xs text-[#162825] font-bold hover:underline"
              >
                Full Report Card →
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {studentReport?.scores.slice(0, 4).map((sc) => (
                <div key={sc.subjectId} className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs">
                  <div>
                    <p className="font-bold text-stone-800">{sc.subjectName}</p>
                    <p className="text-[10px] text-stone-500">CA: {sc.ca1 + sc.ca2 + sc.midTerm + sc.project} | Exam: {sc.exam}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-stone-900">{sc.total} / 100</span>
                    <span className="ml-2 px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800">
                      {sc.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('results')}
            className="mt-4 w-full py-2.5 bg-[#162825] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#203a36] transition-all cursor-pointer"
          >
            <span>Download Official Report Card (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
