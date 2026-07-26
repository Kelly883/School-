import React from 'react';
import {
  BookOpen,
  CalendarDays,
  FileCheck2,
  Users,
  CheckCircle,
  PlusCircle,
  MessageSquare,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';
import { User, StudentProfile, ClassStructure, CBTExam } from '../../types';

interface TeacherDashboardProps {
  currentUser: User;
  students: StudentProfile[];
  classes: ClassStructure[];
  cbtExams: CBTExam[];
  onNavigate: (tab: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  currentUser,
  students,
  classes,
  cbtExams,
  onNavigate,
}) => {
  const assignedClass = classes.find((c) => c.classTeacher.includes(currentUser.name)) || classes[3]; // Default JSS3

  return (
    <div className="space-y-6 pb-12">
      {/* Teacher Banner */}
      <div className="bg-[#162825] text-white rounded-3xl p-6 shadow-xl border border-[#23423d] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#f5ded7]/30 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#f5ded7] text-[#162825] px-2.5 py-0.5 rounded-full">
                Form Teacher & Subject Specialist
              </span>
            </div>
            <h3 className="font-serif text-2xl font-bold mt-1">{currentUser.name}</h3>
            <p className="text-xs text-[#a1beba] mt-0.5">
              Assigned Class: <strong className="text-white">{assignedClass.name} ({assignedClass.arm})</strong> • General Mathematics & Physics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('results')}
            className="bg-[#f5ded7] hover:bg-white text-[#162825] font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Upload CA & Exam Scores</span>
          </button>
          <button
            onClick={() => onNavigate('timetable_attendance')}
            className="bg-[#23423d] hover:bg-[#2d4e48] text-white border border-[#315750] font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
          >
            <CalendarDays className="w-4 h-4 text-[#f5ded7]" />
            <span>Take Roll Call</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Class Roll Count</p>
            <h4 className="text-xl font-extrabold text-stone-900 mt-0.5">{assignedClass.currentCount} Students</h4>
            <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">100% Active Enrolled</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-800 border border-blue-100">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">CA Score Uploads</p>
            <h4 className="text-xl font-extrabold text-stone-900 mt-0.5">85% Complete</h4>
            <p className="text-[10px] text-blue-700 font-semibold mt-0.5">Third Term 2026</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-800 border border-purple-100">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Active CBT Tests</p>
            <h4 className="text-xl font-extrabold text-stone-900 mt-0.5">{cbtExams.length} Exams Active</h4>
            <p className="text-[10px] text-purple-700 font-semibold mt-0.5">Auto-Graded</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-800 border border-amber-100">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Parent Messages</p>
            <h4 className="text-xl font-extrabold text-stone-900 mt-0.5">3 Unread</h4>
            <p className="text-[10px] text-amber-700 font-semibold mt-0.5">Direct Inquiry</p>
          </div>
        </div>
      </div>

      {/* Classroom Roster & Score Status */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h4 className="font-serif text-lg font-bold text-stone-900">Assigned Class Roster ({assignedClass.name})</h4>
            <p className="text-xs text-stone-500">Student Continuous Assessment & Examination Entry Status</p>
          </div>
          <button
            onClick={() => onNavigate('results')}
            className="text-xs text-[#162825] font-bold hover:underline"
          >
            Open Score Sheet Editor →
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-stone-500 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Admission No</th>
                <th className="py-3 px-4">Class / Arm</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">CA 1 & 2 Score</th>
                <th className="py-3 px-4">Exam Score</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {students.slice(0, 5).map((stu) => (
                <tr key={stu.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-stone-900 flex items-center gap-2.5">
                    <img
                      src={stu.personal.passportUrl}
                      alt={stu.personal.firstName}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span>{stu.personal.surname}, {stu.personal.firstName}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-stone-500">{stu.personal.admissionNo}</td>
                  <td className="py-3 px-4 font-medium">{stu.personal.className} ({stu.personal.arm})</td>
                  <td className="py-3 px-4">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold text-[10px]">
                      {stu.attendanceRate}% Present
                    </span>
                  </td>
                  <td className="py-3 px-4 text-stone-800 font-semibold">28 / 30</td>
                  <td className="py-3 px-4 text-stone-800 font-semibold">58 / 60</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onNavigate('results')}
                      className="text-xs text-[#162825] font-bold hover:underline"
                    >
                      Edit Scores
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
