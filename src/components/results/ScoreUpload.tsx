import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Save,
  CheckCircle2,
  Sparkles,
  Calculator,
  UploadCloud,
  ChevronRight
} from 'lucide-react';
import { StudentProfile, ClassStructure, SubjectScore, User } from '../../types';
import { calculateGrade } from '../../utils/formatters';

interface ScoreUploadProps {
  students: StudentProfile[];
  classes: ClassStructure[];
  currentUser?: User;
  onSaveScores: (studentId: string, scores: SubjectScore[]) => void;
}

export const ScoreUpload: React.FC<ScoreUploadProps> = ({
  students,
  classes,
  currentUser,
  onSaveScores,
}) => {
  const isAuthorized = !currentUser || ['super_admin', 'teacher'].includes(currentUser.role);

  if (!isAuthorized) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm text-center max-w-xl mx-auto my-12">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
          Access Restricted
        </h3>
        <p className="text-sm text-stone-600">
          Continuous Assessment and Exam Score Upload is strictly reserved for academic staff and authorized subject teachers.
        </p>
      </div>
    );
  }

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[4]?.id || classes[0].id); // SSS2
  const [selectedSubjectName, setSelectedSubjectName] = useState<string>('General Mathematics');
  const [isSaved, setIsSaved] = useState(false);

  const activeClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter((s) => s.personal.className === activeClass.name) || students;

  // Local score matrix
  const [scoreMatrix, setScoreMatrix] = useState<Record<string, { ca1: number; ca2: number; midTerm: number; project: number; exam: number }>>({
    'stu-1': { ca1: 10, ca2: 9, midTerm: 10, project: 10, exam: 57 },
    'stu-3': { ca1: 9, ca2: 8, midTerm: 9, project: 9, exam: 50 },
  });

  const handleScoreChange = (studentId: string, field: string, value: number) => {
    setScoreMatrix((prev) => {
      const current = prev[studentId] || { ca1: 0, ca2: 0, midTerm: 0, project: 0, exam: 0 };
      return {
        ...prev,
        [studentId]: {
          ...current,
          [field]: Math.min(
            field === 'exam' ? 60 : 10,
            Math.max(0, value || 0)
          ),
        },
      };
    });
  };

  const handleSaveAll = () => {
    classStudents.forEach((stu) => {
      const s = scoreMatrix[stu.id] || { ca1: 8, ca2: 8, midTerm: 8, project: 8, exam: 45 };
      const total = s.ca1 + s.ca2 + s.midTerm + s.project + s.exam;
      const { grade, remarks } = calculateGrade(total);

      const updatedScore: SubjectScore = {
        subjectId: `sub-${selectedSubjectName.toLowerCase().replace(/\s+/g, '-')}`,
        subjectName: selectedSubjectName,
        ca1: s.ca1,
        ca2: s.ca2,
        midTerm: s.midTerm,
        project: s.project,
        exam: s.exam,
        total,
        grade,
        remarks,
        classHighest: 98,
        classLowest: 40,
        classAverage: 68.5,
      };

      onSaveScores(stu.id, [updatedScore]);
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Selector Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            Continuous Assessment & Exam Score Upload
          </span>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
            Teacher Score Entry Portal
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Nigerian 100% Curriculum Breakdown: CA1 (10%), CA2 (10%), Mid-Term (10%), Project (10%), Exam (60%).
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="bg-[#162825] hover:bg-[#203a36] text-[#f5ded7] font-bold text-xs py-3 px-6 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md self-start md:self-auto"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4 text-[#f5ded7]" />}
          <span>{isSaved ? 'Scores Saved Successfully!' : 'Save & Post All Scores'}</span>
        </button>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-stone-700">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Select Class:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-xs font-bold text-stone-800"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.arm})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span>Select Subject:</span>
            <select
              value={selectedSubjectName}
              onChange={(e) => setSelectedSubjectName(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-xs font-bold text-stone-800"
            >
              {activeClass.subjects.map((sub) => (
                <option key={sub.id} value={sub.name}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-stone-500">
          Recording Scores for <strong className="text-stone-900">{classStudents.length} Students</strong> in {activeClass.name}
        </div>
      </div>

      {/* Score Sheet Entry Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#162825] text-white uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Admission No</th>
                <th className="py-3.5 px-4 text-center">CA 1 (10)</th>
                <th className="py-3.5 px-4 text-center">CA 2 (10)</th>
                <th className="py-3.5 px-4 text-center">Mid-Term (10)</th>
                <th className="py-3.5 px-4 text-center">Project (10)</th>
                <th className="py-3.5 px-4 text-center">Exam (60)</th>
                <th className="py-3.5 px-4 text-center">Total Score</th>
                <th className="py-3.5 px-4 text-center">Grade</th>
                <th className="py-3.5 px-4">Auto Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {classStudents.map((stu) => {
                const s = scoreMatrix[stu.id] || { ca1: 9, ca2: 8, midTerm: 9, project: 9, exam: 52 };
                const total = s.ca1 + s.ca2 + s.midTerm + s.project + s.exam;
                const { grade, remarks } = calculateGrade(total);

                return (
                  <tr key={stu.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-stone-900 flex items-center gap-2.5">
                      <img
                        src={stu.personal.passportUrl}
                        alt={stu.personal.firstName}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span>{stu.personal.surname}, {stu.personal.firstName}</span>
                    </td>

                    <td className="py-3 px-4 font-mono text-stone-500 font-semibold">{stu.personal.admissionNo}</td>

                    <td className="py-3 px-2 text-center">
                      <input
                        type="number"
                        max={10}
                        min={0}
                        value={s.ca1}
                        onChange={(e) => handleScoreChange(stu.id, 'ca1', Number(e.target.value))}
                        className="w-12 p-1.5 bg-stone-50 border border-stone-200 rounded-lg text-center font-bold focus:ring-2 focus:ring-[#162825]"
                      />
                    </td>

                    <td className="py-3 px-2 text-center">
                      <input
                        type="number"
                        max={10}
                        min={0}
                        value={s.ca2}
                        onChange={(e) => handleScoreChange(stu.id, 'ca2', Number(e.target.value))}
                        className="w-12 p-1.5 bg-stone-50 border border-stone-200 rounded-lg text-center font-bold focus:ring-2 focus:ring-[#162825]"
                      />
                    </td>

                    <td className="py-3 px-2 text-center">
                      <input
                        type="number"
                        max={10}
                        min={0}
                        value={s.midTerm}
                        onChange={(e) => handleScoreChange(stu.id, 'midTerm', Number(e.target.value))}
                        className="w-12 p-1.5 bg-stone-50 border border-stone-200 rounded-lg text-center font-bold focus:ring-2 focus:ring-[#162825]"
                      />
                    </td>

                    <td className="py-3 px-2 text-center">
                      <input
                        type="number"
                        max={10}
                        min={0}
                        value={s.project}
                        onChange={(e) => handleScoreChange(stu.id, 'project', Number(e.target.value))}
                        className="w-12 p-1.5 bg-stone-50 border border-stone-200 rounded-lg text-center font-bold focus:ring-2 focus:ring-[#162825]"
                      />
                    </td>

                    <td className="py-3 px-2 text-center">
                      <input
                        type="number"
                        max={60}
                        min={0}
                        value={s.exam}
                        onChange={(e) => handleScoreChange(stu.id, 'exam', Number(e.target.value))}
                        className="w-16 p-1.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-center font-bold focus:ring-2 focus:ring-emerald-700"
                      />
                    </td>

                    <td className="py-3 px-4 text-center font-extrabold text-stone-900 text-sm">
                      {total} / 100
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded font-extrabold text-xs ${
                        grade === 'A' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {grade}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-stone-600 font-medium">
                      {remarks}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
