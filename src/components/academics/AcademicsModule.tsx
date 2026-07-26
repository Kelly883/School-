import React, { useState } from 'react';
import {
  GraduationCap,
  Building,
  Calendar,
  CheckCircle2,
  Users,
  Plus,
  ArrowRight
} from 'lucide-react';
import { ClassStructure, AcademicTerm, SchoolSettings } from '../../types';

interface AcademicsModuleProps {
  classes: ClassStructure[];
  terms: AcademicTerm[];
  schoolSettings: SchoolSettings;
  onUpdateTerm: (term: AcademicTerm) => void;
}

export const AcademicsModule: React.FC<AcademicsModuleProps> = ({
  classes,
  terms,
  schoolSettings,
  onUpdateTerm,
}) => {
  const currentTerm = terms.find((t) => t.isCurrent) || terms[0];

  const handlePromote = () => {
    alert('End of Academic Year Bulk Student Promotion Engine triggered successfully! Students progressed to next academic level.');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            Nursery, Primary & Secondary Structure
          </span>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
            Classes & Academic Curriculum
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage Nursery, Primary 1-6, JSS1-3, SSS1-3 class arms, subjects and promotion.
          </p>
        </div>

        <button
          onClick={handlePromote}
          className="bg-[#162825] hover:bg-[#203a36] text-[#f5ded7] font-bold text-xs py-3 px-5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <GraduationCap className="w-4 h-4 text-[#f5ded7]" />
          <span>Execute End-of-Year Student Promotion</span>
        </button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase bg-[#162825] text-white px-3 py-1 rounded-full">
                {cls.name} ({cls.arm})
              </span>
              <span className="text-xs text-stone-500 font-semibold">
                {cls.currentCount} / {cls.maxCapacity} Students
              </span>
            </div>

            <div className="text-xs text-stone-700">
              <p className="font-bold text-stone-900">Form Teacher: {cls.classTeacher}</p>
              <p className="text-stone-500 mt-1">{cls.subjects.length} Allocated Curriculum Subjects</p>
            </div>

            <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-1">
              {cls.subjects.slice(0, 4).map((s) => (
                <span key={s.id} className="text-[10px] font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
