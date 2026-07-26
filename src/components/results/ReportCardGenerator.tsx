import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  CheckCircle2,
  Sparkles,
  Award,
  BookOpen,
  Calendar,
  User,
  Shield
} from 'lucide-react';
import { ReportCard, SchoolSettings, StudentProfile } from '../../types';
import { formatNaira } from '../../utils/formatters';

interface ReportCardGeneratorProps {
  reportCards: ReportCard[];
  students: StudentProfile[];
  schoolSettings: SchoolSettings;
}

export const ReportCardGenerator: React.FC<ReportCardGeneratorProps> = ({
  reportCards,
  students,
  schoolSettings,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    reportCards[0]?.studentId || students[0]?.id || ''
  );

  const activeReport = reportCards.find((r) => r.studentId === selectedStudentId) || reportCards[0];
  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Selector & Actions Top Bar */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            Nigerian Terminal Report Card Generator
          </span>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
            Official Terminal Academic Report
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Automated grade computation, psychomotor rating, teacher remarks & digital principal signature.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Student Selector */}
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3.5 text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#162825]"
          >
            {students.map((stu) => (
              <option key={stu.id} value={stu.id}>
                {stu.personal.surname} {stu.personal.firstName} ({stu.personal.className} - {stu.personal.admissionNo})
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="bg-[#162825] hover:bg-[#203a36] text-[#f5ded7] font-bold text-xs py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4 text-[#f5ded7]" />
            <span>Print / Download PDF</span>
          </button>
        </div>
      </div>

      {/* OFFICIAL REPORT CARD SHEET CONTAINER (Formatted for Print) */}
      <div id="report-card-printable" className="bg-white border-2 border-stone-800 p-8 rounded-3xl shadow-xl max-w-4xl mx-auto space-y-6 text-stone-900 print:border-none print:shadow-none print:p-0 print:max-w-none">
        {/* 1. Official School Header */}
        <div className="border-b-2 border-stone-800 pb-5 text-center relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#162825] text-white flex items-center justify-center text-xl font-serif font-bold shadow-md shrink-0">
              ARC
            </div>

            <div className="flex-1 text-center">
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-stone-900">
                {schoolSettings.schoolName}
              </h1>
              <p className="text-xs font-serif italic text-stone-600 font-semibold mt-0.5">
                Motto: "{schoolSettings.motto}"
              </p>
              <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                {schoolSettings.address} • Phone: {schoolSettings.phone}
              </p>
              <div className="mt-2 inline-block bg-[#162825] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                Terminal Report Card — {schoolSettings.currentTerm} ({schoolSettings.currentSession})
              </div>
            </div>

            <img
              src={activeStudent?.personal.passportUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
              alt={activeReport?.studentName}
              className="w-20 h-20 rounded-xl object-cover border-2 border-stone-800 shadow-sm shrink-0"
            />
          </div>
        </div>

        {/* 2. Student Bio & Class Performance Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase">Student Name:</span>
            <p className="font-bold text-stone-900 text-sm mt-0.5">{activeReport?.studentName}</p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase">Admission Number:</span>
            <p className="font-mono font-bold text-stone-900 text-sm mt-0.5">{activeReport?.admissionNo}</p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase">Class & Arm:</span>
            <p className="font-bold text-stone-900 text-sm mt-0.5">{activeReport?.className} ({activeReport?.arm})</p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase">Position in Class:</span>
            <p className="font-extrabold text-emerald-800 text-sm mt-0.5">
              {activeReport?.positionInClass}st / {activeReport?.totalStudentsInClass}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase">Total Marks:</span>
            <p className="font-bold text-stone-900 mt-0.5">{activeReport?.totalScore} Marks</p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase">Terminal Average:</span>
            <p className="font-extrabold text-[#162825] mt-0.5">{activeReport?.averageScore}%</p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase">Terminal GPA (5.0):</span>
            <p className="font-extrabold text-stone-900 mt-0.5">{activeReport?.gpa} / 5.0</p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase">Attendance:</span>
            <p className="font-bold text-emerald-700 mt-0.5">
              {activeReport?.daysPresent} / {activeReport?.daysOpened} Days Opened
            </p>
          </div>
        </div>

        {/* 3. Subject Academic Performance Breakdown Table */}
        <div>
          <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
            Cognitive Academic Subject Scores (100% Scale)
          </h4>
          <div className="overflow-x-auto rounded-xl border border-stone-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#162825] text-white font-bold text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-3 border-r border-[#23423d]">Subject Title</th>
                  <th className="py-2.5 px-2 text-center border-r border-[#23423d]">CA1 (10)</th>
                  <th className="py-2.5 px-2 text-center border-r border-[#23423d]">CA2 (10)</th>
                  <th className="py-2.5 px-2 text-center border-r border-[#23423d]">Mid (10)</th>
                  <th className="py-2.5 px-2 text-center border-r border-[#23423d]">Proj (10)</th>
                  <th className="py-2.5 px-2 text-center border-r border-[#23423d]">Exam (60)</th>
                  <th className="py-2.5 px-2 text-center border-r border-[#23423d]">Total</th>
                  <th className="py-2.5 px-2 text-center border-r border-[#23423d]">Highest</th>
                  <th className="py-2.5 px-2 text-center border-r border-[#23423d]">Grade</th>
                  <th className="py-2.5 px-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-[11px]">
                {activeReport?.scores.map((sc) => (
                  <tr key={sc.subjectId} className="hover:bg-stone-50">
                    <td className="py-2 px-3 font-bold text-stone-900 border-r border-stone-200">{sc.subjectName}</td>
                    <td className="py-2 px-2 text-center border-r border-stone-200 font-semibold">{sc.ca1}</td>
                    <td className="py-2 px-2 text-center border-r border-stone-200 font-semibold">{sc.ca2}</td>
                    <td className="py-2 px-2 text-center border-r border-stone-200 font-semibold">{sc.midTerm}</td>
                    <td className="py-2 px-2 text-center border-r border-stone-200 font-semibold">{sc.project}</td>
                    <td className="py-2 px-2 text-center border-r border-stone-200 font-bold">{sc.exam}</td>
                    <td className="py-2 px-2 text-center border-r border-stone-200 font-extrabold text-stone-900">{sc.total}</td>
                    <td className="py-2 px-2 text-center border-r border-stone-200 text-stone-500">{sc.classHighest}</td>
                    <td className="py-2 px-2 text-center border-r border-stone-200 font-bold">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-900 border border-stone-300">
                        {sc.grade}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-stone-600 font-medium">{sc.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Psychomotor & Affective Rating + Remarks Section */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
          {/* Psychomotor ratings */}
          <div className="sm:col-span-5 bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <h5 className="text-[11px] font-bold uppercase text-stone-800 border-b border-stone-200 pb-1.5">
              Affective & Psychomotor Domain (Scale 1-5)
            </h5>
            <div className="space-y-1.5 text-[11px]">
              {activeReport?.psychomotor.map((p) => (
                <div key={p.category} className="flex justify-between items-center">
                  <span className="text-stone-700 font-medium">{p.category}</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-emerald-800">
                    {'★'.repeat(p.rating)} <span className="text-stone-400">({p.rating}/5)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Remarks */}
          <div className="sm:col-span-7 space-y-3">
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
              <span className="text-[10px] font-bold uppercase text-stone-400">Class Teacher's Remarks:</span>
              <p className="text-xs font-serif italic text-stone-800 mt-1">
                "{activeReport?.teacherRemarks}"
              </p>
              <div className="mt-2 text-[10px] font-bold text-stone-500 flex justify-between">
                <span>Mrs. Chidimma Okeke (Class Teacher)</span>
                <span className="font-mono">Signed ✓</span>
              </div>
            </div>

            <div className="bg-[#162825] text-white p-3.5 rounded-2xl border border-[#23423d]">
              <span className="text-[10px] font-bold uppercase text-[#f5ded7]">Principal's Official Recommendation:</span>
              <p className="text-xs font-serif italic text-stone-100 mt-1">
                "{activeReport?.principalRemarks}"
              </p>
              <div className="mt-2 text-[10px] font-bold text-[#8ea8a2] flex justify-between">
                <span>{schoolSettings.principalName} (Principal)</span>
                <span className="text-[#f5ded7] font-mono">Official Seal & Signature</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Next Term Resumption & Fees Notice */}
        <div className="pt-4 border-t-2 border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-700 gap-2">
          <div>
            <span className="font-bold text-stone-900">Next Term Resumption Date:</span>{' '}
            <strong className="text-emerald-800">{activeReport?.nextTermBegins}</strong>
          </div>
          <div>
            <span className="font-bold text-stone-900">Next Term Fees Payable:</span>{' '}
            <strong className="text-stone-900">{formatNaira(activeReport?.nextTermFees || 235000)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
